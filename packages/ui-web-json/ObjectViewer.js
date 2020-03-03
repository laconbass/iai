const assert = require('iai-assert')

// TODO use Parent for future-proof
const View = require('iai-ui/View')

exports = module.exports = ObjectViewer

function ObjectViewer (data = null, opts = {}) {
  assert.inherits(this, ObjectViewer)
  View.call(this, 'figure', {
    styles: __filename.replace(/js$/, 'css'),
    ...opts
  })

  Object.defineProperty(this, '_data', { value: data, writable: true })

  this.$head = this.inject('figcaption').attr('tabindex', 0)
  this.$list = this.inject('dl')
  return this
    //.addClass('darki3') // for default color theme
    //.addClass('sourcy') // for json-syntax decoration
}


ObjectViewer.prototype = Object.create(View.prototype)
ObjectViewer.prototype.constructor = ObjectViewer

ObjectViewer.prototype.render = function(data = this._data) {
  if (data === null) {
    throw new TypeError(`cannot render null, specify an object`)
  }
  if ('object' !== typeof data) {
    throw new TypeError(`cannot render typeof===${typeof data}`)
  }
  if (this._data !== data) this._data = Object.create(data)
  this.$list.render(null)
  this.$head.render(Array.isArray(data)? 'Array' : data.toString())

  this.addClass(Array.isArray(data)? 'array':'object')
 
  let fragment = this.createFragment()
  // https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment/DocumentFragment
  // fragment should be a more eficient way to build-before-render as
  // fragment allows an "insert-DOM-at-once" flow

  for (const [key, value] of Object.entries(data)) {
    let type = typeof value
    let display = '//' + value
    switch(type) {
      case 'string':
      case 'number':
      case 'boolean':
        display = value.toString()
        break
      case 'function':
        display = '(function code)'
        break;
      case 'object':
        if (value === null) {
          type = display = 'null'
          break
        }
        display = new ObjectViewer()
        display.render(value)
        break
      default:
        throw new TypeError(`Unexpected value type ${type} for key ${key}`)
        break
    }
    let isArray = Array.isArray(value)
    fragment.appendChild( new View('dt')
      .addClass(type).toggleClass('array', isArray)
      .attr('tabindex', 0) // allows navigating via keyboard
      .render(key)
      .export()
    )
    fragment.appendChild( new View('dd')
      .addClass(type).toggleClass('array', isArray)
      .attr('tabindex', -1) // allows focusing, but no keyboard navigation
      .render(display)
      .export()
    )
    fragment.appendChild( new View('hr')
      .addClass('chrome-page-break-fix').removeClass('View')
      .export()
    )
  }
  this.$list
    .toggleClass('void', fragment.childElementCount < 1)
    .render(fragment)
  return this
}

ObjectViewer.prototype.ready = function (ui) {
  ui.observe(this.$head.$)
    .on('click', () => {
      console.log(this.toString(), 'click')
      this.toggleClass('collapsed')
    })
    .on('keydown', event => {
      if (event.key !== ' ') return
      console.log(this.toString(), 'space')
      this.toggleClass('collapsed')
      return false // prevent default behaviour (page scroll)
    })
  return ui
}
