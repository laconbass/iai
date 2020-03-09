const assert = require('assert')
const { EventEmitter } = require('events')
const WebSocket = require('ws')

const oop = require('iai-oop')

const Log = require('@iaigz/core-log')
const log = new Log()
log.level = log.VERB

//
// exports: a builder (aka constructor)
//

const Parent = require('./ServiceActor')

let builder = module.exports = function ServiceClient (uri) {
  assert(this instanceof builder, 'use the new keyword')

  if (! uri && 'undefined' === typeof document) {
    throw new TypeError('There is no document, uri must be provided')
  }
  if (! /^ws:\/\//.test(uri)) {
    uri = `ws://${uri}`
  }

  Parent.call(this)

  oop(this)
    // it's supossed this code is for browser so seems safe using document
    // TODO it may not be for browser motherfucker
    .visible('uri', uri || ('ws://' + document.location.host))
    .internal('_ws', null)
    .accessor('connected', () => {
      return this._ws !== null && this._ws.readyState === WebSocket.OPEN
    })

  return this
}


builder.prototype = Object.create(Parent.prototype)
builder.prototype.constructor = builder

builder.prototype.send = function (data) {
  return Parent.prototype.send.call(this, data, this._ws)
}

builder.prototype.connect = function () {
  assert.strictEqual(this.connected, false, 'already connected')
  // TODO WebSocket may be also connecting, or closing

  log.info('connecting to %s...', this.uri)
  this._ws = new WebSocket(this.uri)
  // Websocket event handlers
  return new Promise((resolve, reject) => {
    this._ws.onopen = event => {
      //console.log(event)
      log.info('connected to %s', this.uri)
      // don't bind message receiving logic until connection is open
      this._ws.onmessage = event => this.receive(event.data, this._ws)
      // don't bind reconnection logic until connection is open
      this._ws.onclose = event => {
        log.info('websocket disconected')
        this._ws = null
        this.emit('disconnect', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        })

        /*var t = 5
        setTimeout(() => {
          this.connect().catch(this.emit.bind(this, 'error'))
        }, t * 1000 + 1)
        var i = setInterval(function () {
          log.verb('reconnecting in ' + t)
          if (!--t) clearInterval(i)
        }, 1000)
        */
      }
      this.emit('connection', this._ws)
      resolve()
    }
    this._ws.onerror = event => {
      log.error(`could not open websocket (code ${event.error.code})`)
      switch (event.error.code) {
        case 'EAI_AGAIN':
          // see https://www.codingdefined.com/2015/06/nodejs-error-errno-eaiagain.html
          log.warn('A temporary failure in name resolution occurred')
          break
      }
      reject(event.error)
    }
  })
}

builder.prototype.disconnect = function (code, reason) {
  this._ws.close(code, reason)
  return this
}

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
