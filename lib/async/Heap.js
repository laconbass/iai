var oop = require( 'iai-oop' )
  , isFn = require( 'iai-is' )( 'Function' )
  , Parent = require( './Notifier' )
  , Queue = require( './Queue' )
;
/**
 * @builder Heap: wraps a Queue object
 * @inherits: Notifier
 * @pattern: Proxy
 */

var exports = module.exports = oop.builder(function Heap(){
  console.log( "parent", Parent( this ) )
  console.log( "prototype", Object.create(this) instanceof Heap )
  var instance = oop( Parent( this ) )
    .visible( 'heap', Queue(function worker( task, done ){
      task.call( o, done );
    }) )
    .o
  ;
  // notify heap errors
  instance.heap.on( 'error', function( err ){
    instance.emit( 'error', err );
  });
  return instance;
}, Parent.prototype, {
  /*
   * @function then: Pushes a sync task on the heap.
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
  toString: function(){
    return "[Heap <"+this.heap+">]";
  }
})

exports.version = "1";
exports.stability = 2;
