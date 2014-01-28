var is = require( 'iai-is' )
  , oop = require( 'iai-oop' )
  , iai = require( '../..' )
  , path = require( 'path' )
  , resolve = path.resolve
  , dirname = path.dirname
  , Parent = iai( 'async/Notifier' )
;

/**
 * @builder Component: Represents an application component
 *   @param abspath (String): the absolute path of the directory where
 *                            the component's source code lives.
 *
 * if extra parameters are given, abspath will be resolved applying the
 * entire argument list to node's built-in path.resolve
 *
 */

var exports = module.exports = oop.builder(function( abspath ){
  if( arguments.length > 1 ){
    abspath = resolve.apply( null, arguments );
  }

  if( ! is.AbsolutePath(abspath) ){
    throw TypeError( "Application components must reference an absolute path" )
  }

  if( exports.components[abspath] ){
    return exports.components[ abspath ];
  }

  return exports.components[ abspath ] = oop( Parent.call(this) )
    .visible( 'resolve', resolve.bind(null, abspath) )
    .o
  ;
}, Parent.prototype, {
  toString: function( ){
    return "[object ApplicationComponent]";
  },
  require: function( path ){
    return require( this.resolve.apply(null, arguments) );
  }
});

// stores the component index per process
exports.components = {};

exports.version = "0";
exports.stability = 1;
