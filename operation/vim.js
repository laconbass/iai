var iai = require('iai');
var path = require( 'path' );
var spawn = require( 'child_process' ).spawn;

module.exports = vim;

function vim( file ){
  file = file? path.resolve( file ) : '';

  return iai.io(function( input, output ){
    // hear every key stroke from input when it's a tty
    // TODO decide if raw mode should be reset back and when
    // see http://nodejs.org/api/tty.html
    // var wasRaw = input.isRaw;
    input.isTTY && !input.isRaw && input.setRawMode(true);
    // input.isTTY && !wasRaw && input.setRawMode(false);

    // TODO check output resizes? (i.e., from process.stdout)
    // output.columns && output.rows may indicate it
    // output.on( 'resize', ... );

    // spawn operation (stdio=pipe by default)
    var argv = [ file ], opts = { cwd: process.cwd() };
    var op = spawn( 'vim', argv, opts ).once('error', function( err ){
      if( err.code == 'ENOENT' ){
        throw "spawn could not resolve 'vim' to a executable file";
      }
      throw err;
    });

    // when action ends, end io
    var end = this.end.bind( this, undefined, undefined, undefined );
    op.on('close', this.emit.bind(this, 'close') );
    op.on('close', this.end.bind(this, undefined, undefined, undefined) );

    // pipe input to operation's stdin
    input.pipe( op.stdin );
    // pipe operation's stdout to output
    // end=false allows writes to output after op.stdout finishes
    // TODO decide if end=false is need
    op.stdout.pipe( output, { end: false });

    // notify input and output are desirable to write data
    this.emit( 'input', input ); // TODO remove
    this.emit( 'io', input, output );
  });
}

