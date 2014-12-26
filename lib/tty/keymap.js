var terminal = require('./terminal')
  , ansi = require( './ansi' )
  , readn = require( './readn' )
;

module.exports = keymap;

function keymap( ui, keymap, callback ){
  ui = ui || terminal( process.stdout );
  ui
    .log( )
    .log( 'Hit a key to execute operation:' )
    .log( )
    .log( Object.keys( keymap )
      .map(function( key ){
        return '  ' + ansi.blue + key + ansi.reset + ') ' + keymap[ key ];
      })
      .join( '\n' )
    )
    .raw( '> ' )
    .save()
  ;
  ask();
  function ask( ){
    ui.restore().raw( ansi.clearEnd );
    readn( 1, answer );
  }

  function answer( key ){
    var command = keymap[ key ];
    if( !command ){
      return ask();
    }
    callback( keymap[ key ] );
  }
}
