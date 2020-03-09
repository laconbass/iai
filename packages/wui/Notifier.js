const $ = require('jquery')
const assert = require('assert')

const View = require('./AbstractView')

exports = module.exports = NotifyView

// Constructor Notifier

function NotifyView (element, opts) {
  assert(this instanceof NotifyView, 'use the new keyword')
  View.call(this, element, {
    styles: ['node_modules/@iaigz/wui/Notifier.css'],
    ...opts
  })
  return this
}

NotifyView.prototype = Object.create(View.prototype)
NotifyView.prototype.constructor = NotifyView

Array('error', 'warn', 'info').map(className => {
  Object.defineProperty(NotifyView.prototype, className, {
    get: function (...args) { return (message) => this.message(className, message) }
  })
})

NotifyView.prototype.message = function (className, message) {
  this.$.ownerDocument.body.classList.add(className)
  $(`<p>${message}</p>`)
    .addClass(`message ${className}`)
    .prependTo(this.$)
  return this
}

NotifyView.prototype.ready = function (ui) {
  ui.observe(this).on('click', event => {
    if (! event.target.classList.contains('message')) return
    this.$.removeChild(event.target)
  })
}
/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
