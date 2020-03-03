
//
// external dependencies
//

const path = require('path')
const { spawn } = require('child_process')
const { EventEmitter } = require('events')

const iai = require('iai-abc')
const log = iai.log

//
// packaged dependencies
//

const ElectronGUI = require('./ElectronGUI')
const BrowserWindowRemote = require('./BrowserWindowRemote')

//
// exports: an EventEmitter instance
//
module.exports = new ElectronGUI()
/*
exports = iai.oop(module.exports)

// internal reference to the electron binary
let electron = 'electron'
// allow usage of electron-prebuilt
try {
  electron = require('electron-prebuilt')
}
catch (err) {
  if (err.code != 'MODULE_NOT_FOUND') {
    throw err
  }
}

// internal reference to the electron child process
let cp = null

exports.visible('start', function (url = '', bin = electron) {
})

// sends a message to the electron child process (through ipc)
exports.visible('send', function (msg) {
  if (!cp) {
    throw new Error('START IT FIRST MOTHERFUCKER')
  }
  console.warn(this + 'send not implemented')
  return this
})

/*
var win = {}; // the Array machinery is not need to store windows by id
exports.visible('createWindow', function( options, callback ){
  return this.send({ window: options }).once('new-window', function( id ){
    win[id] = BrowserWindowRemote(id, cp);
    this.once('window:'+id+':closed', function(){
      win[id].emit('closed');
      delete win[id];
    });
    // shitty solution to emit the BrowserWindowRemote directly
    this.emit('window-created', win[id]);
  });
});
exports.visible('window', function( id ){
  return win[id];
});

function parseChildMessage( msg ){
  if( msg.emit ){
    log.verb( 'will emit "%s" %j', msg.emit, msg.data );
    return 'undefined' != typeof msg.data
      ? gui.emit(msg.emit, msg.data)
      : gui.emit(msg.emit)
    ;
  }
  log.warnf('cannot understand message %j', msg);
}
*/

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
