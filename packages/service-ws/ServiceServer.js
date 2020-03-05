const os = require('os')
const http = require('http')
const assert = require('assert')
const WebSocket = require('ws')

const abc = require('iai-abc')
const oop = abc.oop
const log = abc.log

log.level = log.VERB

//
// exports: a builder (aka constructor)
//

const Parent = require('./ServiceActor')

let builder = module.exports = function ServiceServer () {
  assert(this instanceof builder, 'use the new keyword')

  Parent.call(this)

  oop(this)
  // TODO https
    .internal('_server', http.createServer())
    .internal('_wss', new WebSocket.Server({ server: this._server }))
    .accessor('listening', () => this._server.listening)

  return this
}

builder.prototype = Object.create(Parent.prototype)
builder.prototype.constructor = builder

builder.prototype.listen = function () {
  // Web Socket Integration
  this._wss.on('connection', (ws) => {
    log.info('ws client connected, %d total', this._wss.clients.size)
    // re-emit websocket connection
    this.emit('ws:connection', ws
      // re-emit message events from this websocket on service object
      .on('message', (data) => this.receive(data, ws))
      // handle websocket errors
      .on('error', function (err) {
        log.error('ws client error %s', err.message)
        log.error(err.stack)
      })
      // re-emit websocket closes
      // close codes are defined on Web Socket RFC
      // see https://tools.ietf.org/html/rfc6455#section-7.4
      .on('close', (code, msg) => {
        log.info('ws client close (%d) "%s", %s left', code, msg, this._wss.clients.size)
        this.emit('ws:close', ws, code, msg)
      })
    )
  })

  this._server
    .on('listening', function () {
      // log address where service is listening
      var url = 'http://' + os.hostname() + ':' + this.address().port
      log.info('service listening @ %s', url)
    })
    // handle posible process signals to properly close the service
    .on('listening', () => {
      var signals = ['SIGUSR2', 'SIGINT']
      signals.forEach(signal => process.on(signal, () => {
        log.warn('received %s signal, closing service...', signal)
        this.close()
      }))
      log.info('service will close on %s signals', signals.join(' or '))
    })
    // re-emit server's 'listening' and 'close' events on this service object
    .on('listening', () => this.emit('listening', this._server.address()))
    // aditionally, log when the service server closes
    .on('close', () => log.info('service closed') + this.emit('close'))

  // will need to keep record of socket connections to allow a gracefull shutdown
  this._sockets = []

  this._server
    .on('connection', (socket) => {
      log.verb('socket connected, %s total', this._sockets.push(socket))
      socket.on('close', () => {
        this._sockets.splice(this._sockets.indexOf(socket), 1)
        log.verb('socket closed, %s left', this._sockets.length)
      })
    })
    // to free up resources, destroy request's sockets when responses finish
    // TODO could be a better procedure ussing a keep-alive timeout?
    .on('request', (req, res) => res.on('finish', () => req.socket.destroy()))
    // log each request received, warn when they take too long to complete
    .on('request', (req, res) => {
      const ip = req.connection.remoteAddress
      log.verb('%s %s from %s', req.method, req.url, ip)
      const tinit = Date.now()
      res.on('finish', function () {
        var code = res.statusCode
        var time = Date.now() - tinit
        log[code < 400 ? 'info' : code < 500 ? 'warn' : 'error'](
          '%s %s %sms',
          res.statusCode, req.url, Date.now() - tinit
        )
        if (time > 1000) {
          log.warn('it took %s seconds to handle %s', time / 1000, req.url)
        }
      })
      // re-emit http server requests on service object
      this.emit('request', req, res)
    })

  // start listening
  this._server.listen.apply(this._server, arguments)
  return this
}

builder.prototype.url = function () {
  if (! this._server.listening) {
    throw new ReferenceError('url is not accesible until server is listening')
  }
  let address = this._server.address()
  return `${os.hostname()}:${address.port}`
}

builder.prototype.close = function () {
  log.verb('closing websocket server...')
  var init = Date.now()
  this._wss.close(() => {
    /* this should never be needed
    if (this._sockets.length) {
      log.warn('destroying %s opened sockets...', this._sockets.length)
      this._sockets.forEach(socket => socket.destroy())
    }
    // */
    log.verb('websocket server closed, closing server...')
    this._server.close(() => {
      log.info('it took %sms to close the service', Date.now() - init)
    })
  })
  return this
}

/*
Service.broadcast = function (data, options, callback) {
  log.debug('broadcast %j to %d clients', data, this._wss.clients.size)
  for (let ws of this._wss.clients) ws.send(data, options, callback)
  return this
}

Service.websocketId = function (ws) {
  if (!ws) throw new ReferenceError('no websocket provided')
  var wid = -1
  if (!this._wss.clients.has(ws)) return wid
  for (let val of this._wss.clients) {
    wid++
    if (val === ws) return wid
  }
  throw abc.Error('this line should never be reached')
}*/

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
