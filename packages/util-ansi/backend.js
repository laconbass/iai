"use strict";

/**
 * exposes codes for commonly implemented ansi term control sequences
 *
 * Ex: `console.log( ansi.bold + ansi.red + 'HELLO WORLD' + ansi.reset);`
 *
 * Taken primarily from https://github.com/creativelive/simple-ansi/blob/master/ansi.js
 *
 */

var exports = module.exports = {};

// see ['\x1b' to avoid "use strict"; error](http://en.wikipedia.org/wiki/ANSI_escape_code)
// http://www.vt100.net/docs/vt102-ug/table5-2.html
exports.esc = '\x1b[';

// text formating
exports.reset = exports.esc + '0m';
exports.bold = exports.esc + '1m';
exports.underline = exports.esc + '4m';
exports.blink = exports.esc + '5m';

// foreground colors
exports.gray = exports.esc + '30m';
exports.red = exports.esc + '31m';
exports.green = exports.esc + '32m';
exports.yellow = exports.esc + '33m';
exports.blue = exports.esc + '34m';
exports.magenta = exports.esc + '35m';
exports.cyan = exports.esc + '36m';
exports.white = exports.esc + '37m';

// background colors
exports.bgGray = exports.esc + '40m';
exports.bgRed = exports.esc + '41m';
exports.bgGreen = exports.esc + '42m';
exports.bgYellow = exports.esc + '43m';
exports.bgBlue = exports.esc + '44m';
exports.bgMagenta = exports.esc + '45m';
exports.bgCyan = exports.esc + '46m';

// erase display
exports.clear = exports.esc + '2J';
exports.clearEnd = exports.esc + '0J';
exports.clearBegin = exports.esc + '1J';

// cursor control
exports.save = exports.esc + 's';
exports.restore = exports.esc + 'u';
exports.home = exports.esc + 'H';
exports.moveTo = exports.esc + '%d;%dH';

// scroll control
exports.scroll = exports.esc + 'r';

// TODO refactor and add sequences
// http://www.termsys.demon.co.uk/vtansi.htm
