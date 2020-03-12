const ui = require('@iaigz/wui')

const ActionMenu = require('@iaigz/wui/ActionMenu')
const HeaderMenu = require('@iaigz/wui/HeaderMenu')

window.iai = ui

ui
  .bootstrap(document)
  .then(() => {
    // mostrar notificacións ao usuario
    ui.notify.info('Notificación informativa')
    ui.notify.warn('Notificación de aviso importante')
    ui.notify.error('Información sobre un erro')

    //ui.actions.main = () => ui.toggle()
    ui.toggle = () => ui.body.classList.toggle('loading')
    let timer = null
    ui.start = (t = 2000) => timer = setInterval(ui.toggle, t)
    ui.stop = () => clearInterval(timer)

    // uso de plugins (componentes)
    return ui.plugins({
      'tablist':  new HeaderMenu([
        new ui.Section({
          slug: 'tab1',
          text: "datos",
          icon: 'sign-in',
        }),
        new ui.Section({
          slug: 'tab2',
          icon: 'paperclip',
        }),
        new ui.Section({
          slug: 'tab3',
          icon: 'penguin-linux',
        }),
      ]),
      'actions': new ActionMenu([
        new ActionMenu.Trigger({
          icon: 'search-user',
          action: () => ui.notify.info('este botón non fai nada'),
        }),
        new ActionMenu.Trigger({
          icon: 'plus',
          action: () => ui.notify.info('este botón tampouco fai nada'),
        }),
        new ActionMenu.Toggler({
          icon: 'map-pins',
          action: () => ui.notify.info('este botón tampouco fai nada'),
        }),
      ])
    })
  })
/*  .catch(reason => {
    console.error(reason)
    ui.notify.error(`fallou unha promesa por ${reason}`)
  })
/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
