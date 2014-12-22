var assert = require('assert');
var trace = require('stack-trace');
var relative = require('path').relative;
var format = require('util').format;

/**
 * # tracer
 *
 * provides a simple string representation of a call site on the stack
 *
 * @stability: 2
 *
 * ## options
 *
 * - *from* {function} [tracer]: passed to `stack-trace.get` as `belowFn`
 * - *indx* {integer} [0]: callsite to pick from stack, defaults to first
 * - *deep* {integer} [3]: reserved spaces for line number digits
 * - *file* {boolean} [false]: returns only filename if enabled
 */

module.exports = tracer;

function tracer( opts ){
  opts = opts || {};
  var stack = trace.get( opts.from || tracer );
  if( ! (opts instanceof Object) ) throw format(
      "TypeError: arg 1 must be instanceof Object\n  %s", stack[0]
  );
  var site = stack[ opts.indx || 0 ]
    , file = relative( process.cwd(), site.getFileName() )
  ;
  if( opts.file ){
    return file;
  }
  // coerce line to string to use .length
  var line = site.getLineNumber() + ''
    , spaces = (opts.deep || 3) - line.length + 1
  ;
  // care with negative results as they are invalid Array lengths
  spaces = spaces > 0? spaces : 1;
  return format( '%s:%s', file, line + Array(spaces).join(' ') );
}

if( process.env.NODE_ENV == 'test' && require.main == module ){
  var assert = require('assert');
  console.log( 'tests started for', __filename );

  var rname = relative( process.cwd(), __filename );
  assert.equal( tracer({ file: 1 }), rname );
  assert.equal( tracer({ indx: 1 }), 'module.js:456' );
  assert.equal( tracer({ file: 1, indx: 1 }), 'module.js' );
  assert.equal( tracer({ indx: 1, deep: 4 }), 'module.js:456 ' );
  assert.equal( tracer({ indx: 1, deep: 0 }), 'module.js:456' );
  assert.equal( tracer({ indx: 1, deep: 1 }), 'module.js:456' );
  assert.equal( tracer({ indx: 1, deep: 2 }), 'module.js:456' );

  // TODO test `from` option

  console.log( 'tests succeed for', __filename );
}
