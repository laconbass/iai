const ui = require('./')

const ActionMenu = require('./ActionMenu')
const HeaderMenu = require('./HeaderMenu')

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
        new HeaderMenu.Section({
          slug: 'tab1',
          text: 'Primeira',
        }),
        new HeaderMenu.Section({
          slug: 'tab2',
          text: 'Segunda'
        }),
        new HeaderMenu.Section({
          slug: 'tab3',
          text: 'Terceira'
        }),
      ]),
      'actions': new ActionMenu([
        new ActionMenu.Trigger({
          text: 'pral',
          action: () => ui.notify.info('este botón non fai nada'),
        }),
        new ActionMenu.Trigger({
          text: 'sec',
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
