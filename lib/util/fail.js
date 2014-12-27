var assert = require('chai').assert;
var format = require('util').format;
var trace = require('./tracer');

var exports = module.exports = fail;


function fail( details ){
  if( details instanceof Error ){
    // TODO sure???
    var error = details.stack || details;
  } else {
    details = details || {};
    details.params = details.params || [];

    assert.isString( details.message, 'message must be provided' );
    assert.isArray( details.params, 'params must be provided' );

    var message = format.apply( 0, [details.message].concat(details.params) );
    var from = trace({ from: fail, pick: 0, deep: 1 });
    var at = trace({ from: fail, pick: 1, deep: 1 });
    var error = format('%s (from %s, check %s)', message, from, at);
  }
  var error = new Error(error);
  // TODO maybe emit if 'function' === typeof this.emit??
  console.error( error.stack );
  process.exit(1);
}
