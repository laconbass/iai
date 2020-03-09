const assert = require('assert')

const ui = require('./')
const parent = require('./AbstractView')

exports = module.exports = View

function View (tag, opts = {}) {
  assert(this instanceof View, 'use the new keyword')
  return parent.call(this, View.createElement(tag), opts)
}

View.prototype = Object.create(parent.prototype)
View.prototype.constructor = View

// static method allowing View constructor to have a default document source
// this is the reason why this constructor depends on iai-ui singleton
View.createElement = (tag, document = ui.$doc ) => {
  assert('string' == typeof tag)
  assert(document instanceof HTMLDocument, 'ui is not initialized')
  return document.createElement(tag)
}

// INJECTION INTERFACE
// TODO refactor injection methods
// see https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
// see https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText
// see https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
View.prototype.inject = function (tag) {
  let child = new View(tag)
  this.$.appendChild(child.$)
  return child
}

// EVENT TRIGGER INTERFACE
View.prototype.focus = function () {
  let element = this.$.querySelector('[tabindex]')
  if (element.ownerDocument.hasFocus()) {
    console.debug('setting focus to', element)
    element.focus()
  } else {
    console.debug('waiting document focus')
    ui.observe(element.ownerDocument).one('focus', event => {
      console.debug('document gained focus')
      this.focus()
      return false
    })
  }
  return this
}

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
