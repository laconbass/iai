const assert = require('assert')
const Parent = require('events').EventEmitter

function EventEmitter () {
  assert(this instanceof EventEmitter, 'use the new keyword')

  Parent.call(this)

  return this
}

let builder = module.exports = EventEmitter

builder.prototype = Object.create(Parent.prototype)
builder.prototype.constructor = builder


/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
