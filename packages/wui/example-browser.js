const ui = require('./')

const Menu = require('./ActionMenu')

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
    console.log(new Menu.Button())
    console.log(new Menu.Toggler())
    console.log(new Menu.Trigger())
    return ui
      .plugin('menu', new Menu([
        new Menu.Toggler({
          text: 'toggle',
          action: () => ui.toggle(),
        }),
        new Menu.Trigger({
          text: 'start',
          action: () => ui.start(),
        }),
        new Menu.Trigger({
          text: 'stop',
          action: () => ui.stop(),
        }),
      ]))
      .then(() => ui.deploy(ui.menu))
  })
/*  .catch(reason => {
    console.error(reason)
    ui.notify.error(`fallou unha promesa por ${reason}`)
  })
/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
