"use strict";

const assert = require('assert')
const ansi = require('./')

if( process.env.NODE_ENV == 'test' && require.main == module ){

  console.log( "tests started for", __dirname );

  assert.equal( ansi.esc, '\x1b[', "escape sequence" );
  assert.equal( ansi.reset, '\x1b[0m', "white foreground" );
  assert.equal( ansi.bold, '\x1b[1m', "bold text" );
  assert.equal( ansi.underline, '\x1b[4m', "underline text" );
  assert.equal( ansi.blink, '\x1b[5m', "blink text" );

  assert.equal( ansi.gray, '\x1b[30m', "gray foreground" );
  assert.equal( ansi.red, '\x1b[31m', "red foreground" );
  assert.equal( ansi.green, '\x1b[32m', "green foreground" );
  assert.equal( ansi.yellow, '\x1b[33m', "yellow foreground" );
  assert.equal( ansi.blue, '\x1b[34m', "blue foreground" );
  assert.equal( ansi.magenta, '\x1b[35m', "magenta foreground" );
  assert.equal( ansi.cyan, '\x1b[36m', "cyan foreground" );
  assert.equal( ansi.white, '\x1b[37m', "white foreground" );

  assert.equal( ansi.bgGray, '\x1b[40m', "gray foreground" );
  assert.equal( ansi.bgRed, '\x1b[41m', "red foreground" );
  assert.equal( ansi.bgGreen, '\x1b[42m', "green foreground" );
  assert.equal( ansi.bgYellow, '\x1b[43m', "yellow foreground" );
  assert.equal( ansi.bgBlue, '\x1b[44m', "blue foreground" );
  assert.equal( ansi.bgMagenta, '\x1b[45m', "magenta foreground" );
  assert.equal( ansi.bgCyan, '\x1b[46m', "cyan foreground" );

  assert.equal( ansi.clear, '\x1b[2J', "clear screen" );
  assert.equal( ansi.clearEnd, '\x1b[0J', "clear screen to end" );
  assert.equal( ansi.clearBegin, '\x1b[1J', "clear screen to begin" );

  assert.equal( ansi.save, '\x1b[s', "save cursor position" );
  assert.equal( ansi.restore, '\x1b[u', "restore cursor position" );
  assert.equal( ansi.moveTo, '\x1b[%d;%dH', "move cursor to %d, %d" );

  assert.equal( ansi.scroll, '\x1b[r', "enable scrolling" );

  console.log( "tests succeed for", __dirname );
}
else {
  throw new Error('expecting environmet variable $NODE_ENV to have value "test"')
}
