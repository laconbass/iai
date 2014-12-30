#!/usr/bin/env node

// TEST DEPENDENCIES
var PassThrough = require('stream').PassThrough;
var format = require('util').format;
var iai = require('iai');
var vim = require('../operation/vim');

var modes = module.exports = {};
var codes = {};

/// vvv TEST RUNNER CODE vvv
var spawn = require('child_process').spawn;
var sequence = require('../lib/util/sequence')

function log( msg ){
  msg = format.apply(0, arguments);
  console.log( '- %s - TEST "%s"', __filename, mode, msg );
  return { log: log };
}

/// ^^^ TEST RUNNER CODE ^^^

modes.all = function runAllTheModes(){
  sequence( modes, function step( mode, fn, next ){
    // do not run 'all' mode, it would produce an infinite loop
    if( mode === 'all' ) return next( null );
    var child = spawn( 'node', [__filename, mode], { stdio: 'inherit' })
    .on('exit', function( code, SIG ){
      var err = null;
      console.log( child.pid, mode, 'exit', code, SIG );
      console.log( child.pid, mode, 'exit', codes[code] );
      if( codes[code] || code !== 0 ){
        err = new Error( codes[code] || 'no description provided' );
        err.code = code;
      }
      console.log( err );
      next( err );
    });
  }, function complete( err ){
    if( err ){
      console.error( 'Some test did not pass. See above.' );
      console.error( err.stack );
      process.exit( err.code );
    }
    process.exit( 0 );
  });
};

// creates a io stream desirable to be tested
function subject(){
  codes[0] = 'premature vim exit with code 0';
  return vim()
    // write a quit command after vim is spawned
    // avoids needed user interaction when reading from process.stdin
    .on('io', function( input, output ){ input.push(':q\r'); })
    // once vim finished, exiting with code 0 is a success
    .on( 'finish', function(){ delete codes[0]; })
  ;
}

modes.basic = function veryBasicUsage(){
  // flow should be written as a pipeline of streams
  // process should exit gracefully when last stream 'finish'es
  process.stdin
    .pipe( subject() )
    // be explicit specifying when process should exit
    .on( 'finish', process.exit.bind(process) )
    // TODO above should be implicit when piping to stdout
    .pipe( process.stdout )
    .write( 'vim should spawn and exit after this message..\n' )
  ;
};

modes.stdinThrough = function(){
  // on this case stdin must be manually set to raw mode
  process.stdin.setRawMode(true);
  process.stdin
    .pipe( new PassThrough() )
    .pipe( subject() )
    // be explicit specifying when process should exit
    .on( 'finish', process.exit.bind(process) )
    .pipe( process.stdout )
  ;
}

modes.outThrough = function outThrough(){
  // on this case stdin must be manually set to raw mode
  process.stdin.setRawMode(true);
  process.stdin
    .pipe( subject() )
    .pipe( new PassThrough() )
    // be explicit if a process.exit() is need
    .on( 'finish', process.exit.bind(process) )
    .pipe( process.stdout )
  ;
}


  // GETTING INFO ABOUT PRESSED KEYS
  /*var keys = [];
  process.stdin.setEncoding('utf8');
  process.stdin.on( 'data', keys.push.bind(keys) );
  process.on('exit', function(){ console.log( 'keys are', keys ); });
  //*/


// TEST BOOTSTRAP
if( require.main === module ){
  var argv = process.argv.slice(0);
  if( process.argv[0] === 'node' ){
    argv = process.argv.slice(2);
  }
  var mode = argv[0] || '';
  var timeout = argv[1] || 5;

  codes[1] = 'launching the test should not throw';
  switch( typeof modes[mode] ){
    case 'function':
      codes[1] = format( 'bootstraping should not throw' );
      codes[2] = format( 'should run on less than %ds', timeout );
      var timer = setTimeout( process.exit.bind(process, 2), timeout*1000 );
      var started = new Date();
      log( 'STARTED @', started.toLocaleTimeString() );
      console.log( 'v*v*v %s v*v*v', mode );
      process.on('exit', function( code ){
        console.log( '^*^*^ %s ^*^*^', mode );
        clearTimeout( timer );
        if( code !== 2 ) delete codes[2];
        var end = new Date();
        if( code !== 0 || codes[0] ){
          log( 'CRASHED CODE=%s', code );
          log( 'CODE IS', codes[code] || 'no code description available' );
        } else {
          log( 'SUCCEED' );
        }
        log( 'END @ %s (%dms)', end.toLocaleTimeString(), end - started );
      });
      codes[1] = format( 'runing mode "%s" should not throw', mode );
      modes[mode]();
      break;
    case 'undefined':
      mode && console.error( 'Fatal: invalid mode: %s', mode );
      console.log( '# USAGE:' );
      console.log( '> node %s [mode]', __filename );
      console.log( '#' );
      console.log( '# if [mode] is ommited, this info is displayed' );
      console.log( '#' );
      var split = '\n#  ';
      console.log( '# [mode] can be:\n#' + split + Object.keys(modes).join(split) );
      process.exit(1);
      break;
    default:
      console.error( 'Fatal: invalid mode (%s)', mode || 'none given' );
      process.exit(1);
      break;
  }
}


