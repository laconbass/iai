
const EGUI = require('./ElectronGUI')

let gui = new EGUI()

gui
  .on('client:created', client => {
    client.layout()
      .then(() => console.log('DONE'))
  })
  .bootstrap()
