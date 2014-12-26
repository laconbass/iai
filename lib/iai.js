// TODO LICENSE comment here

// DEPENDENCIES
var trace = require( './util/tracer' );

// EXPOSE

var exports = module.exports = iai;

/**
 * @function iai( {String|ModuleObject} subject ): The iai function is a
 * convenience accessor so has several funcionalities. The function does
 * something or another depending on the first argument value, aka `subject`.
 *
 * This feature is not defined yet
 */

function iai( subject ) {
  console.error( 'check', trace({ from: iai }) );
  throw new Error( 'Unable to identify subject: ' + subject );
}

// provide a string respresentation to ease debugging
iai.toString = function(){
  return "[iai module]";
}

iai.fail = require('./util/fail');

// TODO ¿? feature to ease working with process.env.NODE_ENV

// TODO ¿? synchronously load every property on __dirname

iai.flow = require('highland');
iai.operation = require('../operation/execute');
