const assert = require('assert')
const WebSocket = require('ws')

const abc = require('iai-abc')
const log = abc.log

log.level = log.INFO

//
// exports: a builder (aka constructor)
//

const Parent = require('events').EventEmitter

let builder = module.exports = function ServiceActor () {
  assert(this instanceof builder, 'use the new keyword')

  Parent.call(this)

  return this
}

builder.prototype = Object.create(Parent.prototype)
builder.prototype.constructor = builder

// this is just a quick-n-dirty way to get it working now
builder.prototype.send = function (data, destination) {
  assert.ok(destination instanceof WebSocket, 'destination should be a WebSocket instance')
  if (typeof data !== 'string') {
    // TODO bypass buffer objects
    data = JSON.stringify(data)
  }
  destination.send(data)
  return this
}

// Never implement here details of what to do with messages, nor send data
builder.prototype.receive = function (data, origin) {
  assert.ok(typeof data, 'string', 'expected data as string')
  assert.ok(origin instanceof WebSocket, 'origin should be a WebSocket instance')
  try {
    data = JSON.parse(data)
    log.verb('received object: %j', data)
  } catch (err) {
    if (err instanceof SyntaxError) {
      // no valid JSON response, emit ws:message as string
      log.verb('received string: %s', data)
    }
    else { 
      // throw unknow errors
      throw err
    }
  }
  if (data.event) {
    log.verb('emit %s(%j)', data.event, Object.keys(data))
    return this.emit(data.event, data, origin)
  }
  return this.emit('ws:message', data, origin)
}

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
