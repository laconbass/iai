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

var PassThrough = require('stream').PassThrough;
var MuteStream = require('mute-stream');
var highland = require('highland');

iai.flow = highland;
function startFlow( src ){
  if( !arguments.length ){
    return new PassThrough();
  }
  return highland.apply( null, arguments );
}

iai.io = function createio( routine ){
  var io = new PassThrough(), input;
  // routine input is registered when a stream is piped to io
  io.once('pipe', function( readable ){
    // break the pipe to avoid "moving" data through
    readable.unpipe( this );
    // ensure no more pipes are received until io is piped to an output
    this.on( 'pipe', function(){ throw new Error("piped twice"); });
    // remember the input for later use
    input = readable;
  });
  // routine output is the destination stream io is piped to
  io.pipe = function outputTo( writable, opts ){
    if( !input ){
      // TODO decide if this error should be emitted instead
      throw new Error("can't work without an input stream");
    }
    function handleErrorAs( name ){
      return function handleError( err ){
        console.log( '%s error: %s', name, err.stack || err );
        process.exit( 777 );
      };
    };
    input.on( 'error', handleErrorAs('input') );
    writable.on( 'error', handleErrorAs('output') );
    // routine execution is deferred until io is piped the output
    process.nextTick( routine.bind(this, input, writable) );
    // apply the built-in pipe behaviour to manage back-pressure
    return PassThrough.prototype.pipe.apply( this, arguments );
    // TODO allow io to be reused: this.removeListener('pipe', pipeError);
  };
  return io;
};

iai.operation = require('../operation/execute');
