var is = require( 'iai-is' )
  , oop = require( 'iai-oop' )
  , loader = require( 'iai-loader' )
;

/*!
 * Expose iai function, version string and stability flag.
 */

var exports = module.exports = iai;

exports.version = '1.2';
exports.stability = 3;

/**
 * @function iai( {String|ModuleObject} subject ): The iai function is a
 * convenience accessor so has several funcionalities. The function does
 * something or another depending on the first argument value, aka `subject`.
 *   @param subject: one of the following:
 *     relative path: delegates on iai.load
 *     absolute path: delegates on iai.component
 *     module object: delegates on iai-loader
 */

var dotpath = /^([a-z]+\.)+[a-z]+$/i;

function iai( subject ) {
  // given an absolute pathname
  if ( is.AbsolutePath( subject ) ){
    return iai.component.apply( null, arguments );
  }
  // given a dotpath
  else if ( is.String(subject) && dotpath.test(subject) ){
    return iai.component2.apply( null, arguments );
  }
  // given a relative pathname
  else if ( is.String(subject) ){
    return iai.load.apply( null, arguments );
  }
  // given a module
  if( is.Module(subject) ){
    return loader.apply( null, arguments )
  }
  throw Error( 'Unable to identify subject' );
}

/**
 * @function load: requires a module from the iai lib
 */

iai.load = loader( module );

/**
 * @function logger: creates a log function
 * @function conf: accessor for core/Conf
 */

iai.logger = iai.load( 'log' );
iai.conf = iai.load( 'core/Conf' );

iai.conf.register( 'LOG_LEVEL', iai.logger.VERBOSE, iai.conf.types.int );

/**
 * @accessor production: tells whatever enviroment is set to 'production'
 */

oop( iai ).accessor( 'production', function(){
  return process.env.NODE_ENV == 'production';
});

/**
 * @function component: accessor for core/Component
 * @function resource: accessor for core/Resource
 * @function app: accessor for core/Application
 */

iai.component = iai.load( 'core/Component' );
iai.component2 = iai.load( 'core/Component2' );
iai.item = iai.load( 'core/Item' );
iai.collection = iai.load( 'core/Collection' );
iai.app = iai.load( 'core/Application' );

/**
 * @function project: accesor for the root component
 */

oop( iai ).accessor( 'project', function(){
  return iai( process.cwd() );
});

/**
 * @function boot: accesor for boot routine
 */

iai.boot = iai.load( 'boot' );

/**
 * @function toString: provides a proper respresentation to ease debugging
 */

iai.toString = function(){
  return "[iai Function]";
}

/**
 * @function iai.api: Creates a new api instance bound to given path
 *   @param root [String]: absolute path
 *   @returns a new iai api bound to given root.
 * Usually called as as follows: `iai.api( __dirname )`
 */

var resolve = require( 'path' ).resolve
  , isFn = is( 'Function' )
  , isNamedFn = function( o ){
      return  isFn(o) && !!o.name;
    }
;

iai.api = oop.builder( function IaiApi( root ){
  if( !isAbsolute(root) ){
    throw TypeError( "IaiApi root must be an absolute path" );
  }
  var o = oop( Object.create( IaiApi.prototype ) )
    .visible( 'resolve', function( path ){
      return resolve( root, path )
    })
    .o
  ;
  // notify heap errors
  o.heap.on( 'error', function( err ){
    o.emit( 'error', err );
  });

  return o;
}, {

  /**
   * @function mount: extends an api instance with some plugin functionality
   *   @param generator [Function(callback)]: The generator function to be used.
   *   @returns: The current context.
   *
   * generator must be a named function and accept a callback. The function
   * name will be used as the namespace name for the new funcionality.
   *       mount( function sitemap(callback){} ) // this works
   *       mount( function sitemap(){} )         // this doesn't
   *       mount( function (callback){} )        // this doesn't
   *       mount( function (){} )                // this doesn't
   *
   * generator...
   *   - is executed as soon as the heap allows
   *   - the context refers the api instance
   *   - receives a callback argument
   *
   * callback function...
   *   - can receive 1 or 2 arguments
   *   - arg1 is allways an Error instance or null
   *   - arg2 is the new functionality to be stored
   */
  mount: function( generator ){
    if( !isNamedFn(generator) || !generator.length ){
      throw TypeError("generator must be a named function and receive callback");
    }
    var api = this.task(function(done){
      if( !!this[ generator.name] ){
        throw Error( "plugin ["+generator.name+"] already mounted" );
      }
      generator.call( this, function callback( err, plugin ){
        if( err instanceof Error ){
          throw err;
        }
        else if( err ){
          throw TypeError( "callback expects first arg to be an Error" );
        }
        else if( "undefined" == typeof plugin ){
          throw TypeError( "plugin can't be undefined")
        }
        console.log( plugin );
        oop( api ).visible( generator.name, plugin );
        done();
      });
    });
    return this;
  }
})

