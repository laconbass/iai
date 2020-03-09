const assert = require('assert')

// TODO use Parent for future-proof
const View = require('@iaigz/wui/View')
const pkgname = require('./package').name
const ObjectViewer = require('./ObjectViewer')

exports = module.exports = ObjectEditor

function ObjectEditor (url = '', opts = {}) {
  assert(this instanceof ObjectEditor, 'use new keyword')
  View.call(this, 'div', {
    styles: [`/node_modules/${pkgname}/${exports.name}.css`],
    ...opts
  })
  this.url = url

  this.$menu = this.inject('menu')
  this.$menu.inject('button').addClass('theme').render('darki3')
    .addClass('selected')
    .export()
  this.$menu.inject('button').addClass('theme').render('sourcy').export()
  this.$form = this.$menu.inject('form').attr('action', '#')
  this.$urn = this.$form.inject('input').attr({
    name: 'url',
    //value: this.url,
    placeholder: this.url
  })
  this.$form.inject('button').addClass('action', 'get').render('GET').export()
  this.$form.inject('button').addClass('action', 'post').render('POST').export()
  //this.theme = this.$form.inject('button').render('GET')
  //this.theme = this.$form.inject('button').render('PUT')
  //this.theme = this.$form.inject('button').render('POST')
  //this.theme = this.$form.inject('button').render('PATCH')
  //this.theme = this.$form.inject('button').render('DELETE')

  this.$viewer = new ObjectViewer().addClass('darki3')
  this.append(this.$viewer)
  this.styles = this.styles.concat(this.$viewer.styles)

  return this
}

ObjectEditor.prototype = Object.create(View.prototype)
ObjectEditor.prototype.constructor = ObjectEditor

ObjectEditor.prototype.render = function (data) {
  this.$viewer.render(data)
  return this
}

ObjectEditor.prototype.ready = function (ui) {
  // it finally seems that ObjectEditor should NOT extend ObjectViewer
  console.debug(`${this} will deploy event listeners`)
  // deploy viewer's events
  this.$viewer.ready(ui)
  ui.observe(this.$form).on('submit', event => {
    console.log( 'prevent submit')
  })
  ui.observe(this.$menu).on('click', event => {
    if (event.target.classList.contains('theme')) {
      event.target.classList.toggle('selected')
      this.$viewer.toggleClass(event.target.innerText)
      return
    }
    if (event.target.classList.contains('action')) {
      let urn = this.$urn.$.value || this.url
      console.log(event.target.innerText, urn)
      switch (event.target.innerText) {
        case 'GET':
          ui.get(urn)
            .then(data => this.render(data))
            .catch(ui.notify.warn)
          break
        case 'POST':
          ui.request('POST', urn)
            .then(data => this.render(data))
            .catch(ui.notify.warn)
          break
        default:
          ui.notify.error(`unexpected "${event.target.innerText}"`)
          return false
      }
      return false
    }
  })
  let filter_scope = 'dt, dd'
  ui.observe(this.$viewer)
    .on('focus', filter_scope, event => {
      if (this.allowsEditing(event.target)) {
        return this.enableEditing(event.target)
      }
    })//*/
    .on('blur', filter_scope, event => {
      if (this.allowsEditing(event.target)) {
        return this.disableEditing(event.target)
      }
    })//*/
    /*.on('click', filter_scope, event => {
    })//*/
    .on('keydown', filter_scope, event => {
      // ignored cases should allow bubbling
      if (! this.allowsEditing(event.target) ) return
      switch (event.key) {
        case 'Escape':
          if (event.target.isContentEditable) {
            this.disableEditing(event.target)
          }
          return
        case 'Enter':
          if (event.target.isContentEditable) {
            let next = this.whoisNext(event.target)
            next.focus()
          } else {
            this.enableEditing(event.target)
          }
          return false // prevent Enter (as inserts <BR>)
        //default: console.log(event.key); return /* research
       default: return // ignore but allow propagation */
      }
      console.log(`${this} prevent ${event.key} on`, event.target)
      return false // prevent propagation
    })//*/ keydown end
  return ui.get(this.url).then(data => this.render(data))
    //.then(() => console.log('could bind events here after-render instead')
}

ObjectEditor.prototype.allowsEditing = function (target) {
  // TODO assert target is HTMLElement
  switch (target.tagName) {
    case 'DT': return true
    case 'DD':
      if (target.classList.contains('object')) {
        return false // ignore DD having .object class
      }
      return true
    default: return false // allow bubbling others
  }
}

ObjectEditor.prototype.enableEditing = function (target) {
  if (! this.allowsEditing(target)) {
    console.error(target)
    throw new ReferenceError(`${this} does not allow editing of ${target}`)
  }
  if (target.isContentEditable) return 
  // enable editing and store current value
  target.setAttribute('data-previous-value', target.textContent)
  target.contentEditable = true
  console.debug(`${this}.enableEdit <${target.tagName} ${target.className}>`)

  // aditionally select all editable content for better UX
  // see https://developer.mozilla.org/en-US/docs/Web/API/Range
  // see https://stackoverflow.com/a/39890687
  let range = target.ownerDocument.createRange()
  range.setStartBefore(target.firstChild)
  range.setEndAfter(target.lastChild)
  let selection = getSelection()
  selection.removeAllRanges()
  selection.addRange(range)

  return
}

ObjectEditor.prototype.disableEditing = function (target) {
  if (! this.allowsEditing(target)) {
    console.error(target)
    throw new ReferenceError(`${this} does not allow editing of ${target}`)
  }
  if (! event.target.isContentEditable) return
  // disable editing and retrieve current/previous values
  target.contentEditable = 'inherit'
  let current = target.textContent
  let previous = target.getAttribute('data-previous-value')
  console.debug(`${this}.disableEdit <${target.tagName} ${target.className}>`)

  // TODO if removing here, breaks behaviour of enableEditing
  // TODO actually this attemp does not clear selection
  //getSelection().removeAllRanges()

  if (current !== previous) {
    console.warn(target, 'new value is', current, 'previously', previous)
    // TODO this.POST(target)
  } else {
    target.removeAttribute('data-previous-value')
  }

  return
}

ObjectEditor.prototype.whoisNext = function (target) {
  assert.inherits(target, HTMLElement)
  let next = null
  switch (target.tagName) {
    case 'DT':
      next = target.nextSibling // each <DD> is right after <DT>
      if ( next.classList.contains('object') ) {
        target = next
        next = next.querySelector('dt')
      }
      break
    case 'DD':
      next = target.nextSibling.nextSibling // to step over <HR>
      break
    default:
      console.error(target)
      throw new ReferenceError('algorithm expects <DT> or <DD> HTMLElement')
  }
  if (next) {
    return next
  }
  // ancestors: (DT|DD) < DL < FIGURE.ObjectViewer < (this.$|DD.object)
  let parent = target.parentElement.parentElement.parentElement
  if (parent !== this.$) {
    return this.whoisNext(parent)
  }
  next = this.$viewer.$.querySelector('dt')
  if (next === null) {
    throw new Error('algorithm leads to an unexpected null value')
  }
  return next
}

ObjectEditor.prototype.modifyData = function (target) {
  let text = target.textContent
  console.log(`${this} should modify data for`, target, 'whose text is', text)
}
