const assert = require('assert')

// HeaderMenu builder

const parent = require('./View')

const prototype = Object.create(parent.prototype)
const constructor = prototype.constructor = function HeaderMenu (opts) {
  assert(this instanceof constructor, 'use the new keyword')

  if (Array.isArray(opts)) {
    opts = { sections: opts }
  }

  opts = {
    sections: [],
    ...opts
  }

  parent.call(this, 'header', {
    styles: ['node_modules/@iaigz/wui/HeaderMenu.css'],
    ...opts
  })

  let fragment = this.template(
    `<img class="logo" alt="logo"/>`,
    `<nav class="menu"></nav>`
  )
  // TODO this should automatically get into
  this.$logo = fragment.querySelector('img')
  this.$menu = fragment.querySelector('nav')

  this.sections = opts.sections
  this.sections.forEach((section, idx) => {
    assert(section instanceof constructor.Section, `value at position ${idx} is not a Section instance`)
    let item = this.template(`<li><a href="#/${section.slug}">${section.text}</a></li>`)
    this.$menu.appendChild(item)
  })
  this.$.appendChild(fragment)
 
  return this
}

prototype.ready = function (ui) {
  console.log(this + 'is ready')
  ui.query(this.$menu)
    .on('click', event => {
      event = event.originalEvent
      if (event.target.tagName !== 'A') return
      for (let li of this.$menu.childNodes) {
        let action = li.firstChild === event.target ? 'add' : 'remove'
        li.classList[action]('selected')
      }
    })
}

prototype.render = function (ui) {
  console.log(this + 'must render')
}

module.exports = prototype.constructor
module.exports.prototype = prototype


// Section builder

constructor.Section = function Section (opts = {}) {
  assert(this instanceof Section, 'use the new keyword')

  opts = {
    ...opts,
    text: opts.text || opts.slug
  }

  assert(opts.slug, 'Section instances must specify a slug')
  assert(opts.slug, 'Section instances must specify a text')

  parent.call(this, 'section', opts)

  Object.defineProperties(this, {
    slug: { value: opts.slug, enumerable: true },
    text: { value: opts.text, enumerable: true }
  })

  return this
}

constructor.Section.prototype.ready = function (ui) {
  console.log(this + ' is ready')
}

constructor.Section.prototype = Object.create(parent.prototype)
constructor.Section.prototype.constructor = constructor.Section


/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
