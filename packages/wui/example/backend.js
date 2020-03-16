
const GUI = require('@iaigz/gui-electron')
const os = require('os')
const fs = require('fs')

// default layout: 2 horizontal windows, only the first (left)
let layout = { horizontal: 2, only: 0 }
try {
  layout = require(process.env.HOME +'/.iai-layout.json')
} catch (e) {
  // just use default layout
  // TODO is error MODULE_NOT_FOUND? throw instead
}

let gui = new GUI()

let assets = [
  'bundle.js',
  'bundle.js.map',
].map(file => `/assets/${file}`)

let sections = {
  '/tab1': 'content/example.html',
  '/tab2': 'content/example2.html',
  '/tab3': 'content/example.html',
}

gui
  .on('client:created', client => client.layout(layout))
  .on('request', (req, res) => {
    // this logic implements a basic assets server
    switch (req.url) {
      case '/':
        fs.createReadStream(`${__dirname}/index.html`)
          .pipe(res)
        break;
      default:
        if (assets.indexOf(req.url) > -1) {
          fs.createReadStream(`${__dirname}${req.url}`)
            .pipe(res)
          return
        }
        if (sections[req.url]) {
          fs.createReadStream(`${__dirname}/${sections[req.url]}`)
            .pipe(res)
          return
        }
        if (/^\/node_modules\//.test(req.url)) {
          fs.createReadStream(`${__dirname}${req.url}`)
            .pipe(res)
          return
        }
        res.statusCode = 404
        res.end('Not Found')
    }
  })
  .bootstrap()

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
