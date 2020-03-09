
const GUI = require('@iaigz/gui-electron')
const os = require('os')

let gui = new GUI()

gui
  .on('client:created', client => client.layout({
    horizontal: 2, only: 0
  }))
  .on('request', (req, res) => {
    console.warn('received request')
    res.writeHead(301, { Location: 'https://127.0.0.1:9966' })
    res.end()
  })
  .bootstrap()

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
