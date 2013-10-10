/**
 * Provides the simplest posible API (a function)
 * to perform requires relative to `root` without
 * knowing dirname when calling the API.
 *
 * @function loader( {string} root )
 *     @returns function load
 *
 * @function load( {string} path )
 *     @param path: the path to be required, relative to `root`
 *     @returns the required module
 *     @throws Error if the module doesn't exist
 */

exports = module.exports = loader;

exports.version = '1';
exports.stability = 1;

function loader( root ) {
  return function load( path ) {
    if( !path ){
      throw Error( f( "Cannot load '%s'", path ) )
    }
    try {
      return require( require( 'path' ).resolve( root, path ) );
    }
    catch(err) {
      throw Error( f( "Cannot load '%s' because %s", path, err.message ) )
    }
  };
}

var f = require( 'util' ).format;




