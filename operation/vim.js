var iai = require('iai');
var path = require( 'path' );
var spawn = require( 'child_process' ).spawn;

module.exports = vim;

function vim( file ){
  file = file? path.resolve( file ) : '';
  return iai.io(function( input, output ){
    // TODO check output resizes? (i.e., from process.stdout)
    // output.on( 'resize', ... );
    output.write('spawning vim...\n');
    // spawn operation (stdio=pipe by default)
    var vim = spawn( 'vim', [ file ], { cwd: process.cwd() });
    vim.on('error', function( err ){
      throw err;
    });
    // notify when action ends
    var io = this;
    vim.on( 'close', function( code, signal ){
      if( code !== null ){
        console.log( 'action exits with code %s and signal %s', code, signal );
        console.log( '  code!=null indicates process terminated normally');
        console.log( '  signal!=null indicates process terminated due to receipt of a signal');
      }
      return io.end();
      // finish the io stream someway
      if( input === process.stdin ){
        // pause input if it's process.stdin so node can exit gracefully
        return input.pause();
      } else if( output === process.stdout ){
        // exit node if output is process.stdout (as it can't be #end)
        output == process.stdout && process.exit();
      } else {
        console.log("DEBUG: i can't handle this situation yet");
        //console.log( input._readableState ); console.log( input._writableState );
        io.end();
        //input.unpipe();
        //input.end && input.end();
        //return io.emit( 'error', new Error("can't handle this situation now") );
        // `input.push( null );`
        // throws "stream.push() after EOF", after a key is pressed once vim exits
//        output.on( 'finish', io.end.bind(io) );
  //      input.on( 'end', output.end.bind(output) ).push( null );
      }
      //io.push(null); io.end();
    });
    // pipe input to action's stdin
    input.pipe( vim.stdin );
    // notify when input is desirable to write data
    this.emit( 'input', input );
    // pipe action's stdout to output
    // end=true avoids
    // end=false ensures we can still write to output after action exits
    vim.stdout.pipe( output, { end: false });
  });
}

// TEST

// run with `NODE_ENV=test node {__filename}`
if( require.main === module && process.env.NODE_ENV == 'test' ){
  console.log( '- - TEST BEGINS FOR %s', __filename );
  process.on('exit', function( code ){
    code && console.log( 'FAIL: TEST EXIT WITH CODE %d', code );
    console.log( '- - TEST ENDS FOR %s', __filename );
  });
  try {
    // EXAMPLE
    var PassThrough = require('stream').PassThrough;

    // components should be written as stream instances
    var v = vim()
      .on('input', function( input ){
        console.log('pushing commands on input stream');
        input.push(':E\r');
      })
    ;
    var before = new PassThrough();
    var after = new PassThrough();

    // GETTING INFO ABOUT PRESSED KEYS
    /*var keys = [];
    process.stdin.setEncoding('utf8');
    process.stdin.on( 'data', keys.push.bind(keys) );
    process.on('exit', function(){ console.log( 'keys are', keys ); });
    //*/

    // flow should be written as a pipeline of streams
    process.stdin
      // it should work even if it's piped through something before
      // on this case stdin must be manually set to raw mode
      .setRawMode( true );process.stdin.pipe( before )
      // at this #pipe() call, the vim process should spawn
      .pipe( v )
      // be explicit if a process.exit() is need when vim exits
      //.on( 'exit', process.exit.bind(process) )
      // it should work even if it's piped through something after
      .pipe( after )
      // be explicit if a process.exit() is need when after finishes
      .on( 'finish', process.exit.bind(process) )
      // it should allow me to write something on the end
      // TODO this will not work
      //.pipe( iai.io(function( i, o ){ o.write('something between'); }) )
      // once flow begins, process must be ended manually
      .pipe( process.stdout )
    ;
  } catch( err ){
    console.log( err.stack || err );
    process.exit(1);
  }
}
