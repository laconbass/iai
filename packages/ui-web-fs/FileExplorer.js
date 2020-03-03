const assert = require('iai-assert')
const path = require('path')

// TODO use Parent for future-proof
const View = require('iai-ui/View')

exports = module.exports = FileExplorer

function FileExplorer (data = null, opts = {}) {
  assert.inherits(this, FileExplorer)
  View.call(this, 'figure', {
    styles: __filename.replace(/js$/, 'css'),
    ...opts
  })

  Object.defineProperty(this, '_data', { value: data, writable: true })

  this.$head = this.inject('figcaption').attr('tabindex', 0)
  this.$list = this.inject('nav')
  return this
    //.addClass('darki3') // for default color theme
    //.addClass('sourcy') // for json-syntax decoration
}


FileExplorer.prototype = Object.create(View.prototype)
FileExplorer.prototype.constructor = FileExplorer

FileExplorer.prototype.render = function(data = this._data) {
  if (data === null) {
    throw new TypeError(`cannot render null, specify an object`)
  }
  if ('object' !== typeof data) {
    throw new TypeError(`cannot render typeof===${typeof data}`)
  }
  if (this._data !== data) this._data = Object.create(data)
  this.$list.render(null)
  if (!Array.isArray(data.list)) {
    throw new TypeError('data.list must be an array')
  }
  this.$head.render(data.cwd)
  
  let fragment = this.createFragment()
  // https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment/DocumentFragment
  // fragment should be a more eficient way to build-before-render as
  // fragment allows an "insert-DOM-at-once" flow

  for (const [key, value] of Object.entries(data.list)) {
    let type = ['BlockDevice', 'CharacterDevice',
      'Directory', 'FIFO', 'File',
      'Socket', 'SymbolicLink'
    ].filter( type => value['is'+type]() )
    type = type[0]
    fragment.appendChild( new View('li')
      .attr('tabindex', 0) // allows navigating via keyboard
      .addClass(type)
      .attr('data-fs-parent', data.cwd)
      .render(value.name)
      .export()
    )
  }
  this.$list
    .toggleClass('void', fragment.childElementCount < 1)
    .render(fragment)
  return this
}

FileExplorer.prototype.ready = function (ui) {
  ui.observe(this.$head.$)
    .on('click', () => {
      let cwd = this.$head.$.innerHTML
      if (cwd == '/') {
        ui.notify.info('Xa estás na raíz')
	return
      }
      this.list(path.resolve(cwd+'/..'))
    })
    .on('keydown', event => {
      if (event.key !== ' ') return
      console.log(this.toString(), 'space')
      this.toggleClass('collapsed')
      return false // prevent default behaviour (page scroll)
    })
  ui.observe(this.$list.$)
    .on('click', event => {
      let target = event.target
      if (! target.classList.contains('Directory')) {
        return
      }
      console.log(event.target, 'click')
      let dest = event.target.dataset.fsParent
      this.list(path.resolve(dest, target.innerHTML))
    })
  return ui
}
