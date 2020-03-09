const ui = require('@iaigz/wui')
//const { ObjectEditor, ObjectViewer } = require('iai-ui-json')
const ObjectEditor = require('./ObjectEditor')
const ObjectViewer = require('./ObjectViewer')

// TODO if ! window, do nothing (but load dependencies to introspect)

window.iai = ui

document.body.classList.add('loading')

ui
  .bootstrap(document)
  .then( ui => {
    console.log('deploying components')
    // as plugin registration is done synchronously,
    // ui[component_id] will be available inmediately
    // but ui.plugin() fulfills when View's assets are loaded
    ui.plugin('viewer', new ObjectViewer())
    ui.plugin('editor', new ObjectEditor('/package.json'))
    .then(ui => {
       // deploying multiple components asynchronously
       // may lead to indeterminable deploy order
       ui.deploy(ui.editor)
         .then( editor => editor.focus() )
       ui.deploy(ui.viewer)
    })
    return ui
  })
  .then(ui => {
    console.log('rendering object representation of ui')
    ui.viewer.render(ui)
    return ui
  })//*/
  .then( ui => {
    console.log('DONE', typeof ui)
  })
  .catch(reason => {
    console.error(reason)
    ui.notify.error(`fallou unha promesa por ${reason}`)
  })
/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
