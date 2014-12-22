/**
 * logger: provides a wrapper for console.log that colors the output
 *
 * @stability: 2
 */

var format = require('util').format;
var relative = require('path').relative;
var tracer = require('./tracer');
var ansi = require('./ansi');

function logger( opts ){
  opts = ('string' == typeof opts)? { color: opts } : ( opts || {} );
  // TODO options..
  var color = reset = '';
  if( opts.color ){
    color = ansi[ opts.color ];
    reset = ansi.reset;
  }
  opts.clean = opts.clean || false;

  return function log( args ){
    var message = color + format.apply( 0, arguments ) + reset;
    if( opts.clean ){ // TODO option to disable callsite
      return console.log( message );
    }
    var caller = tracer({ from: log }) // TODO option to configure tracer
    console.log( caller, message.replace( /\n/g,
          '\n' + reset + Array( caller.length + 1 ).join(' ') + ' ' + color
    ) );
    return this;
  }
}

module.exports = logger;

if( process.env.NODE_ENV == 'test' && require.main == module ){
  console.log('tests started for', __filename);
  var log = logger('magenta');
  log('testing log with a magenta message\nwith multiple\nlines');
  console.log('tests succeed for', __filename);
}

