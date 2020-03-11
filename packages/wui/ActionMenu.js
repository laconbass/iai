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
    styles: [
      'node_modules/@iaigz/wui/ActionMenu.css',
      'node_modules/@iaigz/wui/icofont/icofont-search/icofont.min.css',
      'node_modules/@iaigz/wui/icofont/icofont-webapp/icofont.min.css',
    ],
    ...opts
  })

  this.buttons = opts.buttons
  let fragment = this.createFragment()
  this.buttons.forEach((button, idx) => {
    assert(button instanceof constructor.Button, 
      `value at position ${idx} is not a Button instance`)
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

  opts = {
    text: null,
    icon: null,
    action: () => null,
    ...opts
  }

  parent.call(this, 'button', opts)

  Object.defineProperties(this, {
    options: { value: opts },
    action: { get: () => opts.action }
  })

  return this
}
constructor.Button.prototype = Object.create(parent.prototype)
constructor.Button.prototype.constructor = constructor.Button

constructor.Button.prototype.ready = function (ui) {
  console.log(this + ' is ready')
  ui.observe(this)
    .on('click', event => this.action())

  this.render()
}

constructor.Button.prototype.render = function (opts = this.options) {
  let fragment = this.template(
    opts.icon ? `<i class="icofont-${opts.icon}"></i>`: '',
    opts.text ? opts.text : ''
  )
  return parent.prototype.render.call(this, fragment)
}

// Trigger Button builder

constructor.Trigger = function TriggerButton (opts) {
  assert(this instanceof constructor.Trigger, 'use the new keyword')
  constructor.Button.call(this, {
    icon: 'verification-check',
    ...opts,
  })
  return this
}
constructor.Trigger.prototype = Object.create(constructor.Button.prototype)
constructor.Trigger.prototype.constructor = constructor.Trigger


constructor.Toggler = function TogglerButton (opts = {}) {
  assert(this instanceof constructor.Toggler, 'use the new keyword')

  let enabled = !! opts.selected
  Object.defineProperty(this, 'selected', {
    get: () => enabled,
    set: bool => {
      assert('boolean' == typeof bool)
      if (bool !== enabled) this.$.classList.toggle('selected')
    }
  })

  constructor.Button.call(this, {
    ...opts,
    action: () => {
      this.selected = !this.selected
      opts.action(this.selected)
    }
  })

  return this

}
constructor.Toggler.prototype = Object.create(constructor.Button.prototype)
constructor.Toggler.prototype.constructor = constructor.Toggler


/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
