const assert = require('assert')
const abc = require('iai-abc');
const log = abc.log;

log.level = log.VERB

const ServiceClient = require('@iaigz/service-ws/ServiceClient')
const { app, screen, dialog, BrowserWindow } = require('electron')

// wm will hold the communication service
log.info('connecting to window manager', process.env.IAI_WM_SERVICE)
let wm = new ServiceClient(process.env.IAI_WM_SERVICE)

// display a loading screen while connecting to IAI_WM_SERVICE
log.info('starting the electron based gui')
// see https://www.electronjs.org/docs/api/app#app
app.allowRendererProcessReuse = true
app
  .on('will-quit', event => {
    if (wm.connected) {
      log.warn('all windows were closed but manager still connected.')
      return event.preventDefault()
    } 
  })
/*.whenReady().then(() => new Promise((resolve, reject) => {
    // see https://www.electronjs.org/docs/api/screen#screen
    let current = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
    let { x, y, width, height } = current.workArea
    // see https://www.electronjs.org/docs/api/browser-window#class-browserwindow
    let win = new BrowserWindow({
      ...geometry,
      //x: x + width - (geometry.width), // borde dereito
      x: x + Math.floor(width / 3) * 2, // no último terzo
      y: y + Math.floor((height - geometry.height) / 2), // centro vertical
      focusable: false, kiosk: true,
    })
    win.loadFile('backend.html')
    return wm//.once('connected' => win.close())
  })) */

// setup event bindings to control application and contact IAI_WM_SERVICE accordingly
wm
  .on('disconnect', event => {
    log.warn('window manager disconnect. will quit')
    app.quit()
  })
  .on('ask:confirm', event => {
    log.verb('ask user confirmation (%s)', event.message)
    let args = [{
      type: 'question',
      title: 'Confirm',
      message: event.message,
      buttons: [ 'SI', 'NON' ],
      cancelId: 1
    }]
    if (event.window) {
      args.unshift(BrowserWindow.fromId(event.window))
    }
    // see https://www.electronjs.org/docs/api/dialog#dialogshowmessageboxbrowserwindow-options
    // use sync version, there is a bug: https://github.com/electron/electron/issues/20533#
    let res = dialog.showMessageBoxSync.apply(dialog, args)
    log.info('confirm (%s) response is %s', event.message, res)
    wm.send({ event: event.answer, result: res === 0 })
  })
  .on('layout', event => {
    assert.ok(Array.isArray(event.windows), 'layout event#windows must be array')
    let wins = BrowserWindow.getAllWindows()
    if (wins.length) {
      log.warn('closing all windows to set up a new layout...')
      return Promise.all(wins.map(win => new Promise(resolve => {
        win.once('closed', resolve).close()
      }))).then(() => wm.emit('layout', event))
    }
    log.info('dispose layout (%j), %s windows', event.layout, event.windows.length)
    colors = ['#222', '#777']
    Promise.all(event.windows.map((winopts, idx) => new Promise(resolve => {
      // see https://www.electronjs.org/docs/api/browser-window#class-browserwindow
      let win = new BrowserWindow({
        ...winopts,
        maxWidth: winopts.width,
        maxHeight: winopts.height,
        frame: false,
        resizable: false,
        movable: false,
        backgroundColor: colors[idx % 2],
        title: `window ${idx}`,
      })
        .on('closed', () => {
          log.warn('window %s (%s) closed', idx)
          win = null
        })
        //lots of events doesn't work :(
      ;
      log.verb('new window %s (id %s) %j', idx, win.id, winopts)
      // setTimeout hack is need to maintain correct positioning
      // tryed to prevent 'move' event, but it doesn't work and fires lots of times
      setTimeout(() => {
        win.setBounds(winopts)
        win.loadURL('http://' + process.env.IAI_WM_SERVICE + '/')
        resolve(win)
      }, 20 * event.windows.length)
    })))
    .then(() => {
      let windows = BrowserWindow.getAllWindows()
        .reverse()
        .map((win, n) => { return { n: n, id: win.id } })
      wm.send({ event: event.answer, wins: windows })
    })
  })
    //let win = new BrowserWindow({ type: 'desktop', fullscreen: true, webPreferences: { nodeIntegration: true }})

// bootstrap routine
wm.connect()
  // see https://www.electronjs.org/docs/api/app#event-ready
  .then(() => app.whenReady())
  .then(() => {
    log.info('application is ready and connected to window manager')
    //process.stdin.resume()
    process.on('exit', code => log.info('will exit with code', code))
    wm.send({ event: 'screen:init',
      displays: screen.getAllDisplays(),
      cursor: screen.getCursorScreenPoint(),
      current: screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).id
    })
    // see https://www.electronjs.org/docs/api/screen#events
    screen
      .on('display-added', () => log.warn('added a display'))
      .on('display-removed', () => log.warn('removed a display'))
      .on('display-metrics-changed', () => log.warn('some display changed metrics'))
    // TODO notify window manager about display changes
  })
  .then(() => {
    // retrieve available screens, dimensions, etc
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    // Create the browser window.
    /*let win = new BrowserWindow({
	//   type: 'desktop',
	  // fullscreen: true,
      width: width,
      height: height,
      webPreferences: {
        nodeIntegration: true
      }
    })
    // Open the DevTools.
    //win.webContents.openDevTools()
    return win*/
  })

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
