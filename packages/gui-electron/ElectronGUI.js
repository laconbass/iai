
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

const WebsocketService = require('@iaigz/service-ws')

//
// packaged dependencies
//

//const BrowserWindowRemote = require('./BrowserWindowRemote')

//
// exports: a builder (aka constructor)
//

const Parent = require('@iaigz/abc-events')

function ElectronGUI() {
  assert(this instanceof ElectronGUI, 'use the new keyword')

  Parent.call(this)

  this._cp = null
  this._dm = WebsocketService.create()

  return this
}

const builder = module.exports = ElectronGUI

builder.prototype = Object.create(Parent.prototype)
builder.prototype.constructor = builder

builder.prototype.toString = function () {
  return `[${this.constructor.name}@${process.pid}#${this._cp?this._cp.pid:''}]`
}

// controls the spawning of the child process running electron
builder.prototype.start = function (opts = {}) {
  opts = {
    url: '',
    bin: electron,
    ...opts
  }
  // TODO opts conformance

  assert(this._cp === null, 'Cannot start GUI twice')
  log.verb(`${this} Will spawn ${opts.bin} now`)

  console.log(this._dm.address)

  this._cp = spawn(opts.bin, [path.join(__dirname, 'backend.js')], {
    cwd: process.cwd(),
    env: { ...process.env, IAI_DM_SERVICE: 'fuckyou' },
    stdio: [null, 'pipe', 'pipe']
  })
  // ensure electron is killed if process exits
  process.on('exit', this._cp.kill.bind(this._cp, 'SIGTERM'))

  // neccessary to see messages writen to stdX from electron process
  // TODO (YAGNI) option to change the streams to pipe cp.stdX to??
  this._cp.stdout.pipe(process.stdout)
  this._cp.stderr.pipe(process.stderr)

  // listening for myself seems not good
  // loadUrl should be a method and a window should be specified
  opts.url && this.on('app:ready', () => {
    throw new Error('working on')
    this._cp.send({ control: 'win.loadURL', args: [url] })
  })

  log.verb(`${this} Spawned child_process with pid ${this._cp.pid}`)

  return this
}

builder.prototype.close = function () {
  throw new Error('miss implementation')
}

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
