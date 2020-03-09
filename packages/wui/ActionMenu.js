const $ = require('jquery')
const assert = require('assert')

// ActionMenu builder

const parent = require('./AbstractView')

const prototype = Object.create(parent.prototype)

prototype.constructor = function ActionMenu (element, opts) {
  assert(this instanceof prototype.constructor, 'use the new keyword')
  console.log(element instanceof HTMLElement )
  parent.call(this, element, {
    styles: ['node_modules/@iaigz/wui/ActionMenu.css'],
    ...opts
  })
  this.$.innerHTML = `
    <button>main</button>
    <button>two</button>
    <button>three</button>
  `
  return this
}

module.exports = prototype.constructor
module.exports.prototype = prototype

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
