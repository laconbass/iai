const assert = require('assert')

// HeaderMenu builder

const parent = require('./View')
const Section = require('./Section')

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
    assert(section instanceof Section, `value at position ${idx} is not a Section instance`)
    let item = this.template(
      `<li>`,
      `  <a href="/${section.slug}">`,
      section.icon ? `<i class="icofont-${section.icon}"></i>` : '',
      section.text ? `${section.text}` : '',
      `  </a>`,
      `</li>`
    )
    this.$menu.appendChild(item)
  })
  this.$.appendChild(fragment)
 
  return this
}

prototype.ready = function (ui) {
  ui.query(this.$menu)
    .on('click', event => {
      let target = event.originalEvent.target
      if (target.tagName === 'I') target = target.parentNode
      if (target.tagName !== 'A') return
      for (let li of this.$menu.childNodes) {
        let action = li.firstElementChild === target ? 'add' : 'remove'
        li.classList[action]('selected')
      }
      event.preventDefault()
      event.stopPropagation()
      ui.navigate(target)
    })
}

prototype.render = function (ui) {
  console.log(this + 'must render')
}

module.exports = prototype.constructor
module.exports.prototype = prototype


/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
