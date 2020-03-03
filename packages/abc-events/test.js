
const assert = require('assert')
const { EventEmitter } = require('events')

console.log('TESTING', require.resolve('./'))

let Emitter = require('./')

assert(typeof Emitter === 'function', 'should export a function')

let thing = null

try {
  thing = new Emitter()
}
catch (error) {
  console.error('should be able to instantiate without arguments')
  throw error
}

assert(thing instanceof EventEmitter, 'instances should extend EventEmitter')
assert(EventEmitter.prototype.isPrototypeOf(thing), 'instances should inherit EventEmitter')

console.log('Inheritance chain seems ok')

try {
  thing = Emitter()
  assert(false, 'should force instances to be created with "new" keyword')
}
catch (error) {
  if (! /new keyword/.test(error.message)) {
    throw error
  }
  console.log('unexpected context error (no new keyword) seems ok')
}


process.stdin.resume()
console.log('beginning async test operations (stdin resumed)')

new Promise((resolve, reject) => {
  try {
    thing.on('event:one', data => {
      assert(data === 'one value', 'should receive event data')
      console.log('Event one seems ok')
      resolve()
    })
    thing.emit('event:one', 'one value')
  }
  catch (error) {
    console.error('should implement #emit() and #on()')
  }
})
.then(() => {
  process.stdin.pause()
  console.log('all async operations done (stdin paused)')
})



/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
