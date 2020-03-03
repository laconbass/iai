
const abc = require('iai-abc');
const log = abc.log;

log.level = log.VERB

const { app, screen, BrowserWindow } = require('electron')


app.allowRendererProcessReuse = true

console.log(process.env.IAI_DM_SERVICE)

log.info('starting the electron based gui')

// TODO this should setup event bindings and contact IAI_DM_SERVICE accordingly
// see https://www.electronjs.org/docs/api/app#app
app
  // see https://www.electronjs.org/docs/api/app#event-ready
  .on('ready', () => {
    log.info('application is ready')
  })
  .whenReady()
  .then(() => {

    // retrieve desktop dimensions
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    // Create the browser window.
    let win = new BrowserWindow({
	//   type: 'desktop',
	  // fullscreen: true,
      width: width,
      height: height,
      webPreferences: {
        nodeIntegration: true
      }
    })
    // and load the index.html of the app.
    win.loadFile('backend.html')
    /*let win2 = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
    // and load the index.html of the app.
    win2.loadFile('index.html')*/
    // Open the DevTools.
    //win.webContents.openDevTools()
    return win
  })
  .then(win => {
    //console.log()
  })

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
