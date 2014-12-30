// IMPORTANT NOTE: do not depend on iai as it depends on this module
var resolve = require( 'path' ).resolve;
var f = require('util').format;
var fail = require('../lib/util/fail');

module.exports = execute;

/**
 * execute the operation described by command
 *
 * @param {String} command the operation to be executed
 * @returns {*} the value returned by the operation
 */

function execute( command ){
  var argv = command.split(/\s/)
    , refs = argv[0].split('.')
    , path = resolve( __dirname, '../operation', refs.shift() );
  ;
  try {
    path = require.resolve( path );
  } catch( err ){
    return fail({
      constructor: ReferenceError,
      message: "can't resolve '%s', require.resolve('%s') throws:\n%s",
      params: [ argv[0], path, err.message || err ]
    });
  }
  try {
    delete require.cache[ path ];
    var operation = require( path );
  } catch( err ){
    return fail({
      message: "can't load '%s', require('%s') throws:\n%s",
      params: [ argv[0], path, err.message || err ]
    });
  }

  var value = operation, ref;
  while( ref = refs.shift() ){
    if( 'undefined' == typeof value[ref] ){
      return fail({
        message: "can't resolve '%s', %s's property '%s' is undefined",
        params: [ argv[0], value, ref ]
      });
    }
    operation = value
    value = value[ ref ];
  }

  if( 'function' !== typeof value ){
    return fail({
      message: "can't run '%s', it isn't a function",
      params: [ argv[0] ]
    });
  }

  try {
    return value.apply( operation, argv.slice(1) );
    // TODO ¿? check operation returns a DuplexStream instance?
    //assert( cmd instanceof stream.Duplex, 'must return a DuplexStream intance' );
  } catch( err ){
    return fail({
      message: "can't run '%s', %s( ... ) throws:\n%s",
      params: [ argv[0], value.name || value, err.message || err ]
    });
  }
}
