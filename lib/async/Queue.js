var oop = require( 'iai-oop' )
  , Parent = require( './Notifier' )
  , isFn = require( 'iai-is' )( 'Function' )
;

/**
 * @builder queue: Process data according to first in - first out principle.
 *   @param worker[Function]
 *
 * Creates a queue object. Objects pushed the queue will be processed by worker
 * in the order they are given. While an object is being processed, next objects
 * will be queued until worker finishes processing. Each worker process executes
 * on `process.nextTick` to allow better debugging.
 *
 * the worker function receives 2 arguments:
 *   1. the data to be processed. This is the object you push into the queue.
 *   2. a done callback, which optionally accepts an error as argument.
 *
 */

var exports = module.exports = oop.builder(function Queue( worker ){
  if( !isFn(worker) ){
    throw TypeError( "worker must be a function" );
  }
  return oop( Parent.call(this) )
    .visible( 'worker', worker )
    .visible( 'stack', [] )
    .o
  ;
}, Parent.prototype, {
  push: function( object ){
    var q = this
      , drain = q.emit.bind( q, 'drained' )
      , callback = function done( err){
          if( err ) {
            q.stack.length = 0;
            q.emit('error', err);
          }
          // remove the task from the stack and call the next task
          q.stack.shift();
          process.nextTick( q.stack[0] || drain );
        }
      , task = function(){
        try {
          q.worker( object, callback );
        } catch(e) {
          q.emit( "error", e );
        }
      }
    ;
    // push the process on the stack
    q.stack.push( task );
    q.emit( 'queued', q.stack );

    // call task if stack was empty
    if( q.stack.length < 2 ){
      this.emit( 'saturated' );
      process.nextTick( task );
    }
    return this;
  },
  toString: function(){
    return "[Queue #"+this.stack.length+" tasks left]";
  }
});

exports.version = "1";
exports.stability = 1;
