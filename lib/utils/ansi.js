/**
 * Taken from https://github.com/creativelive/simple-ansi/blob/master/ansi.js
 */

// see:  http://en.wikipedia.org/wiki/ANSI_escape_code -- '\x1b avoid "use strict"; error.
// exposes codes for commonly implemented ansi formats

// usage console.log( ansi.bold + ansi.red + 'HELLO WORLD' + ansi.reset);

module.exports = {
  esc : '\x1b[',
  // formating
  bold : '\x1b[1m',
  underline : '\x1b[4m',
  blink : '\x1b[5m',
  // foreground colors
  gray : '\x1b[30m',
  red : '\x1b[31m',
  green : '\x1b[32m',
  yellow : '\x1b[33m',
  blue : '\x1b[34m',
  magenta : '\x1b[35m',
  cyan : '\x1b[36m',
  white : '\x1b[37m',
  // background colors
  bgGray : '\x1b[40m',
  bgRed : '\x1b[41m',
  bgGreen : '\x1b[42m',
  bgYellow : '\x1b[43m',
  bgBlue : '\x1b[44m',
  bgMagenta : '\x1b[45m',
  bgCyan : '\x1b[46m',
  reset : '\x1b[0m',
  // erase display
  clear : '\x1b[2J',
  clearEnd : '\x1b[0J',
  clearBegin : '\x1b[1J',
  // cursor move
  save : '\x1b[s',
  restore : '\x1b[u',
  moveTo : '\x1b[%d;%dH'
}