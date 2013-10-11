/**
 * @function is: create a type validator for given type.
 *   @param type [String]: "Function", "Object", "Array", "RegExp", "Date", ...
 *
 * returned validators are based on Object.prototype.toString type checking.
 * Also provides access to some special type check functions.
 */

module.exports = is;

function is( type ){
  if( is[ type ] ){
    return is[ type ];
  }
  return is[ type ] = function( o ){
    return Object.prototype.toString.call(o) == "[object " + type + "]";
  };
}

/**
 * Tells whatever `path` is absolute
 *
 * Taken from https://github.com/visionmedia/express/commit/cbf330c3db48e2a3e93c34a2e1e32c56a31bea7a
 * See also http://dailyjs.com/2012/05/24/windows-and-node-4/
 *
 * @function isAbsolute( {string} path )
 * @param path: the path to be checked
 */

is.AbsolutePath = function isAbsolute( path ) {
  if ( '/' == path[0] ) {
    return true;
  }
  if ( ':' == path[1] && '\\' == path[2] ) {
    return true;
  }
  return false;
};

/**
 * Tells whatever given object represents a number
 *
 * sighly modified from [an answer found at stackoverflow](http://stackoverflow.com/a/1830844/1894803)
 */

is.Number = function isNumber( o ) {
    o = ( String( o ) ).replace( /,/g, '.' );
    return !isNaN( parseFloat( o ) ) && isFinite( o );
};
