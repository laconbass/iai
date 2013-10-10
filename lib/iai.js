/**
 * The iai function is a convenience accessor so has several funcionalities.
 * The function does something or another depending on the `subject`.
 */


var exports = module.exports = iai;

exports.version = '1.2';
exports.stability = 3;

/**
 * @function iai( {string} subject )
 *     @param subject: an absolute or relative path
 *     (relative case) delegates on iai.load
 *     (absolute case) delegates on util/loader
 */

function iai( subject ) {
  if ( 'string' !== typeof subject ) {
    throw Error( 'Unable to identify subject' );
  }
  // given a relative pathname
  if ( !isAbsolute( subject ) ) {
    return iai.load( subject );
  }
  // given an absolute pathname
  return loader( subject );
}

var oop = require( './util/oop' )
  , loader = require( './util/loader' )
  , isAbsolute = require( './util/isAbsolute' )
;

iai.load = loader( __dirname );

/**
 * @function iai.api: Creates a new api instance bound to given path
 *   @param root [String]: absolute path
 *   @returns a new iai api bound to given root.
 * Usually called as as follows: `iai.api( __dirname )`
 */

var resolve = require( 'path' ).resolve
  , queue = iai( 'util/queue' )
  , isFn = iai( 'util/is' )( 'Function' )
  , isNamedFn = function( o ){
      return  isFn(o) && !!o.name;
    }
;

iai.api = oop.factory( function IaiApi( root ){
  if( !isAbsolute(root) ){
    throw TypeError( "IaiApi root must be an absolute path" );
  }
  var o = oop( Object.create( IaiApi.prototype ) )
    .notifier()
    .visible( 'resolve', function( path ){
      return resolve( root, path )
    })
    .visible( 'heap', queue(function worker( task, done ){
      task.call( o, done );
    }) )
    .o
  ;
  // notify heap errors
  o.heap.on( 'error', function( err ){
    o.emit( 'error', err );
  });

  return o;
}, {
  /*
   * @function task: Pushes a sync task on the heap.
   *   @param task [Function()]: the function to be executed
   *   @returns the current context
   *
   * Given task is executed within the context of the current api.
   *
   * Useful for "done" callbacks
   */
  then: function( task ){
    return this.task(function(done){
      task.call( this );
      done();
    })
  },
  /*
   * @function task: Pushes a task on the heap
   *   @param task [Function(done)]: the function to be executed
   *   @returns the current context
   *
   * The task argument...
   *   - is executed as soon as the heap allows
   *   - the context refers the current api instance
   *   - receives 1 argument
   *   - arg1 is a callback function.
   *   - the callback function accepts 1 argument, Error or null
   */
  task: function( task ){
    if( !isFn(task) || !task.length ){
      throw TypeError( "task must be a function and receive a done argument" );
    }
    this.heap.push(task);
    return this;
  },
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

