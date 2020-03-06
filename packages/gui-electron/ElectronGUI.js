
//
// dependencies
//

const path = require('path')
const assert = require('assert')
const { spawn } = require('child_process')

const iai = require('iai-abc')
const log = iai.log

log.level = log.VERB

// internal reference to the electron binary
let electron = 'electron'
// to allow usage of electron-prebuilt
try { electron = require('electron-prebuilt') }
catch (err) {
  if (err.code != 'MODULE_NOT_FOUND') {
    throw err
  }
}

const ServiceServer = require('@iaigz/service-ws/ServiceServer')

//
// packaged dependencies
//

//const BrowserWindowRemote = require('./BrowserWindowRemote')

//
// exports: a builder (aka constructor)
//

const Parent = require('events').EventEmitter

function ElectronGUI(opts = {}) {
  assert.ok(this instanceof ElectronGUI, 'use the new keyword')
  Parent.call(this)

  opts = {
    url: '',
    bin: electron,
    ...opts
  }
  // TODO opts conformance

  this.clients = [] //  information about clients (screens, etc)
  this._cp = null // will reference electron process once spawned
  this._wm = new ServiceServer() // will comunicate processes
    .on('listening', () => {
      assert(this._cp === null, '_cp should be null before spawning')
      log.verb(`${this} Will spawn ${opts.bin} now`)
      this._cp = spawn(opts.bin, [path.join(__dirname, 'backend.js')], {
        cwd: process.cwd(),
        env: { ...process.env, IAI_WM_SERVICE: this._wm.url() },
        stdio: [null, 'pipe', 'pipe']
      })
      log.info(`${this} Spawned child_process with pid ${this._cp.pid}`)

      // neccessary to see messages writen to stdX from electron process
      // TODO (YAGNI) option to change the streams to pipe cp.stdX to??
      this._cp.stdout.pipe(process.stdout)
      this._cp.stderr.pipe(process.stderr)

      this._cp.on('exit', (code) => {
        log[code > 0 ? 'warn' : 'info'](`${this} ${opts.bin} has exit with code ${code}`)
      })

      // care when process exits:
      process.on('exit', (code) => {
        log[code > 0 ? 'warn' : 'info'](`${this} process is about to exit with code ${code}`)
      })
    })
    .on('close', () => {
      log.info('%s window manager has closed', this)
    })
    .on('screen:init', (data, origin) => {
      delete data.event
      let id = this.clients.length
      this.clients.push(new builder.Client({
        id: id,
        server: this._wm,
        client: origin,
        screen: data
      }))
      log.info('client created with id', id)
      this.emit('client:created', this.clients[id])
    })
    .on('request', (req, res) => {
      log.warn('received a request')
      res.statusCode = 404
      res.end('Working on')
    })

  return this
}

const builder = module.exports = ElectronGUI

builder.prototype = Object.create(Parent.prototype)
builder.prototype.constructor = builder

builder.prototype.toString = function () {
  return `[object ${this.constructor.name}@${process.pid}#${this._cp?this._cp.pid:''}]`
}

builder.prototype.bootstrap = function (opts = {}) {
  assert(this._cp === null, 'Cannot bootstrap GUI twice')

  // listening for myself seems not good
  // loadUrl should be a method and a window should be specified
  /*opts.url && this.on('app:ready', () => {
    throw new Error('working on')
    this._cp.send({ control: 'win.loadURL', args: [url] })
  })*/

  return new Promise((resolve, reject) => this._wm
    .once('listening', () => resolve(this))
    .listen()
  )
}

builder.prototype.shutdown = function (opts = {}) {
  assert(this._cp !== null, 'Cannot shutdown GUI until bootstraped')
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => reject('shutdown timed out'), 3000)
    let finish = () => {
      if (this._cp.exitCode === null) {
        log.info('%s waiting child process to exit', this)
        return false
      }
      if (this._wm.listening) {
        log.info('%s waiting window manager to close', this)
        return false
      }
      clearTimeout(timeout)
      log.info('shutdown: completed')
      setImmediate(resolve)
    }
    log.info('shut down: killing child_process %s', this._cp.pid)
    this._cp.once('exit', finish).kill('SIGINT')
    log.info('shut down: closing window manager service...')
    this._wm.once('close', finish).close()
  })
}

builder.Client = function ClientController(args = {}) {
  assert.ok(this instanceof builder.Client, 'use the new keyword')

  this.id = args.id
  this.server = args.server
  this.client = args.client
  this.screen = args.screen
  this.windows = []
  // TODO create windows inmediately

  return this
}

builder.Client.prototype = {}
builder.Client.prototype.constructor = builder.Client

builder.Client.prototype.confirm = function (opts) {
  if ('string' === typeof opts) opts = { message: opts }
  let answer = 'answer:confirm:' + opts.message
  return new Promise((resolve, reject) => {
    this.server.once(answer, event => {
      resolve(event.result)
    }).send({
      ...opts, event: 'ask:confirm', answer: answer
    }, this.client)
  })
}

builder.Client.prototype.layout = function (opts = {}) {
  let answer = 'answer:layout' // TODO not unique, may lead to race conditions
  // need strategy-based implementation to deal with layouts
  // TODO this is still so ugly
  let windows = null
  try {
    windows = this.calculateLayout(opts)
  } catch (e) {
    return Promise.reject(e)
  }
  return new Promise((resolve, reject) => {
    this.server.once(answer, event => {
      log.warn('layout answer %j', event)
      this.windows = event.wins
      resolve(this.windows)
    }).send({
      event: 'layout', answer: answer,
      layout: opts,
      windows: windows,
    }, this.client)
  })
}

builder.Client.prototype.calculateLayout = function (opts = {}) {
  opts = {
    rest: 0, // default rest fraction on first window (or first row, first col)
    vertical: 1, // default to 1 row
    horizontal: 1, // default to 1 column
    ...opts
  }
  if (opts.horizontal > 0 && opts.vertical > 0) {
    return this.calculateGridLayout(opts)
  }
  if (opts.horizontal > 0) {
    return this.calculateHorizontalLayout(opts)
  }
  if (opts.vertical > 0) {
    return this.calculateVerticalLayout(opts)
  }
  throw new TypeError('cannot determine a layout strategy')
}

builder.Client.prototype.calculateGridLayout = function (opts) {
  let current = this.screen.displays
    .find(display => display.id === this.screen.current)
  assert.ok(current, 'cannot find current display')
  // see https://www.electronjs.org/docs/api/structures/display#display-object
  let { x, y, width, height } = current.workArea
  let factorX = opts.horizontal
  let restX = width % factorX
  let factorY = opts.vertical
  let restY = height % factorY
  return Array(factorX * factorY)
    .fill({ // base dimensions
      width: Math.floor(width / factorX),
      height: Math.floor(height / factorY),
    })
    .map((dimension, idx) => { return {
      ...dimension, // calculate row and column
      row: Math.floor(idx / factorX),
      col: idx % factorX,
      //floorY: Math.floor(idx / factorY), modY: idx % factorY,
      //floorX: Math.floor(idx / factorX), modX: idx % factorX,
    }})
    .map((grid) => { return {
      ...grid, // correct base dimensions:
      width: grid.width + (grid.col == opts.rest ? restX : 0),
      height: grid.height + (grid.row == opts.rest ? restY : 0),
    }})
    .map((geom, idx, all) => { return {
      ...geom, // calculate { x, y } position
      x: x + all
        .filter(e => e.row == geom.row && e.col < geom.col)
        .reduce((acc, cur) => acc + cur.width, 0),
      y: y + all
        .filter(e => e.col == geom.col && e.row < geom.row)
        .reduce((acc, cur) => acc + cur.height, 0),
    }})
}

builder.Client.prototype.calculateHorizontalLayout = function (opts) {
  let current = this.screen.displays
    .find(display => display.id === this.screen.current)
  assert.ok(current, 'cannot find current display')
  // see https://www.electronjs.org/docs/api/structures/display#display-object
  let { x, y, width, height } = current.workArea
  let factor = opts.horizontal
  let rest = width % factor
  if (rest > 0) {
    assert.ok(opts.rest >= 0, `${opts.rest} must be zero or greater`)
    assert.ok(opts.rest < factor, `${opts.rest} must be less than ${factor}`)
  }
  return Array(factor).fill({})
    .map((e, idx) => { return {
      width: Math.floor(width / factor) + (idx == opts.rest ? rest : 0),
      height: height,
    }})
    .map((geometry, idx, all) => { return {
      ...geometry,
      // esta lóxica situa ventás de esquerda a dereita, pegadas
      x: x + all.slice(0, idx).reduce((acc, cur) => acc + cur.width, 0),
      y: y, // borde superior
    }})
}

builder.Client.prototype.calculateVerticalLayout = function (opts) {
  let current = this.screen.displays
    .find(display => display.id === this.screen.current)
  assert.ok(current, 'cannot find current display')
  // see https://www.electronjs.org/docs/api/structures/display#display-object
  let { x, y, width, height } = current.workArea
  let factor = opts.vertical
  let rest = height % factor
  if (rest > 0) {
    assert.ok(opts.rest >= 0, `${opts.rest} must be zero or greater`)
    assert.ok(opts.rest < factor, `${opts.rest} must be less than ${factor}`)
  }
  return Array(factor).fill({}) // else will make an array of null values
    .map((e, idx) => { return {
      width: width,
      height: Math.floor(height / factor) + (idx == opts.rest ? rest : 0),
    }})
    .map((geometry, idx, all) => { return {
      ...geometry,
      x: x, // borde esquerdo
      // esta lóxica situa ventás de arriba a abaixo, pegadas
      y: y + all.slice(0, idx).reduce((acc, cur) => acc + cur.height, 0),
    }})
}

      //x: x + width - (geometry.width), // borde dereito
      //x: x + Math.floor(width / 3) * 2, // no último terzo
      //y: y + Math.floor((height - geometry.height) / 2), // centro vertical

/*

// controls the spawning of the child process running electron
exports.visible('start', function (url = '', bin = electron) {
  if (cp) {
    // DO NOT START TWICE!! One child process is enought
    throw new Error('ALREADY STARTED MOTHERFUCKER')
  }
  log.verb('Will spawn the electron process now')
  cp = spawn(electron, [path.join(__dirname, 'backend')], {
    cwd: process.cwd(),
    env: process.env,
    stdio: [null, 'pipe', 'pipe']
  })
  // ensure electron is killed if process exits
  process.on('exit', cp.kill.bind(cp, 'SIGTERM'))

  // neccessary to see messages writen to stdX from electron process
  // TODO (YAGNI) option to change the streams to pipe cp.stdX to??
  cp.stdout.pipe(process.stdout)
  cp.stderr.pipe(process.stderr)

  // TODO gui listening for itself seems not good
  // loadUrl should be a method and a window should be specified
  url && this.on('app:ready', function () {
    cp.send({ control: 'win.loadURL', args: [url] })
  })

  return this
})

// sends a message to the electron child process (through ipc)
exports.visible('send', function (msg) {
  if (!cp) {
    throw new Error('START IT FIRST MOTHERFUCKER')
  }
  console.warn(this + 'send not implemented')
  return this
})

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
