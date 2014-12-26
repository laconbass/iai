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
  io.on('error', function( err ){
    console.log( 'view %s io stream notified an error:\n%s', ref, err.stack );
    process.exit(1);
  })
  view.render( meta, ui );
  meta.operation && execute( meta.operation )
  meta.keymap && io.once('pipe', function( input ){
    if( input === process.stdin ){
      keymap( ui, meta.keymap, function viewoption( command ){
        input.unpipe( io );
        input.pipe( execute(command) )
      });
    } else {
      throw Error( "what to do if input is not process.stdin?" );
    }
  });
  return io;
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
    if( err.code != 'MODULE_NOT_FOUND' ){
      throw err;
    }
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
