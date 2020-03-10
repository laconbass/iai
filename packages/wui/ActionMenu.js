const assert = require('assert')

// ActionMenu builder

const parent = require('./View')

const prototype = Object.create(parent.prototype)
const constructor = prototype.constructor = function ActionMenu (opts) {
  assert(this instanceof constructor, 'use the new keyword')

  if (Array.isArray(opts)) {
    opts = { buttons: opts }
  }

  opts = {
    buttons: [],
    ...opts
  }

  parent.call(this, 'menu', {
    styles: ['node_modules/@iaigz/wui/ActionMenu.css'],
    ...opts
  })

  this.buttons = opts.buttons
  let fragment = this.createFragment()
  this.buttons.forEach((button, idx) => {
    assert(button instanceof constructor.Button, `value at position ${idx} is not a Button instance`)
    fragment.appendChild(button.$)
  })
  this.$.appendChild(fragment)
 
  return this
}

prototype.ready = function (ui) {
  console.log(this + 'is ready')
  this.buttons.forEach(button => button.ready(ui))
}

prototype.render = function (ui) {
  console.log(this + 'must render')
}

module.exports = prototype.constructor
module.exports.prototype = prototype

// Button builder


constructor.Button = function Button (opts) {
  assert(this instanceof constructor.Button, 'use the new keyword')

  if ('function' == typeof opts)  opts = { action: opts }

  opts = { text: null, action: event => false, ...opts  }

  parent.call(this, 'button', opts)

  this.action = opts.action

  this.render(opts.text)

  return this
}
constructor.Button.prototype = Object.create(parent.prototype)
constructor.Button.prototype.constructor = constructor.Button

constructor.Button.prototype.ready = function (ui) {
  console.log(this + ' is ready')
  ui.observe(this)
    .on('click', event => this.action())
}

// Trigger Button builder

constructor.Trigger = function TriggerButton (opts) {
  assert(this instanceof constructor.Trigger, 'use the new keyword')
  constructor.Button.call(this, { text: 'trigger', ...opts, })
  return this
}
constructor.Trigger.prototype = Object.create(constructor.Button.prototype)
constructor.Trigger.prototype.constructor = constructor.Trigger


constructor.Toggler = function TogglerButton (opts = {}) {
  assert(this instanceof constructor.Toggler, 'use the new keyword')

  constructor.Button.call(this, { text: 'toggler', ...opts, })

  let enabled = !! opts.initial
  Object.defineProperty(this, 'enabled', {
    get: () => enabled,
    set: bool => {
      assert('boolean' == typeof bool)
      throw new Error('missing implementation')
    }
  })
  console.log('fuck',this)

  return this

}
constructor.Toggler.prototype = Object.create(constructor.Button.prototype)
constructor.Toggler.prototype.constructor = constructor.Toggler


/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
