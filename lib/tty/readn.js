var readline = require('readline');

/**
 * reads n characters from stdin
 * if !n, it will read until enter is hit
 */

module.exports = readn;

function readn( n, callback ){
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function done( data ){
    rl.close();
    callback( data );
  }

  if( !n ){
    return rl.on( 'line', done )
  }

  var count = 0, sequence = '';
  process.stdin.on( 'keypress', storeKey );

  function storeKey( ch, key ){
    if( key && key.sequence == '\u0003' ){
      rl.write('\n^C\n')
      return process.exit(1)
    }
    sequence += ( key && key.sequence || ch );
    count++;
    if( count == n ){
      this.removeListener( 'keypress', storeKey );
      rl.write('\n');
      done( sequence );
    }
  }
}
