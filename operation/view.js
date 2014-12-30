var iai = require( 'iai' )
  , resolve = require('path').resolve
  , terminal = require('../lib/tty/terminal')
  , ansi = require('../lib/tty/ansi')
//  , read = require('../lib/tty/read')
  , readn = require('../lib/tty/readn')
  , keymap = require('../lib/tty/keymap')
  , execute = require('./execute')
  , stream = require('stream')
  , assert = require('assert')
;

module.exports = view;

/**
 * display a view and wait user interaction
 *
 * @param {string} ref path reference to the view, inside the view dir
 * @returns {} ¿stream? to communicate with the caller
 */

var count = 0;

function view( ref ){
  count ++;
  var name = ref + ' (' + count + ')';
  var meta = view.read( ref )
    , io = iai.flow()
    , ui = terminal( io )
  ;
  view.render( meta, ui );
  meta.operation && execute( meta.operation )
  return io.once('pipe', function( input ){
    if( !meta.keymap ){
      throw Error('received a pipe for a view without keymap');
    }
    if( input === process.stdin ){
      keymap( ui, meta.keymap, function next( command ){
        io.once('unpipe', function( src ){
          assert( src === input );
          console.log('pipe broken to delegate on', command);
          input.pipe( execute(command) ).pipe( io );
        });
        input.unpipe( io );
      });
    } else {
      throw Error( "what to do if input is not process.stdin?" );
    }
  });
}

/**
 * resolves a view referente to its meta info
 *
 * @param {string} ref path reference to the view, inside the view dir
 * @returns {object} the view meta info
 */

view.read = function( ref ){
  ref = resolve( __dirname, '../view', ref );
  try {
    ref = require.resolve( ref );
    delete require.cache[ ref ];
    return require( ref );
  } catch( err ){
    throw err;
    throw new ReferenceError("I can't find the view " + ref);
  }
};

/**
 *
 * @param {object} meta the meta information of the view
 * @param {UserInterface} ui
 */

view.render = function( meta, ui ){
  ui//.clear( )
    .ps3( )
    .log( '/**' )
    .ps3( ' * ' )
    .raw( ' * ' + ansi.blue + '# iai-ide' )
  ;
  meta.title && ui.raw( ' - ' + meta.title );
  ui
    .raw( ' #\n' + ansi.reset )
    .log( )
    .log( ansi.blue + process.cwd() + ansi.reset )
    .log( )
  ;
  meta.message
    && ui.log( meta.message )
    && ui.log( )
  ;
  ui.ps3( ).log( ' */' );
}
