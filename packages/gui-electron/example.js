
const GUI = require('./ElectronGUI')
const fs = require('fs')

let gui = new GUI()

gui
  .on('client:created', client => client.layout({ horizontal: 3, only: 2 }))
  .on('request', (req, res) => {
    console.warn('received request')
    fs.createReadStream(__dirname + '/backend.html')
      .pipe(res)
  })
  .bootstrap()
