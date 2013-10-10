/*
 * Tells whatever `path` is absolute
 *
 * Taken from https://github.com/visionmedia/express/commit/cbf330c3db48e2a3e93c34a2e1e32c56a31bea7a
 * See also http://dailyjs.com/2012/05/24/windows-and-node-4/
 *
 * @function isAbsolute( {string} path )
 *     @param path: the path to be checked
 */

exports = module.exports = isAbsolute;

exports.version = '1';
exports.stability = 1;

function isAbsolute( path ) {
  if ( '/' == path[0] ) {
    return true;
  }
  if ( ':' == path[1] && '\\' == path[2] ) {
    return true;
  }
}