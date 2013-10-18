var EventEmitter = require( 'events' ).EventEmitter
  , oop = require( 'iai-oop' )
;

/**
   * @builder Notifier: creates a new notifier object.
   * @pattern: Proxy
   *
   * Each notifier wraps a new event emitter which can only be accesed
   * through some methods [emit, on, once].
   */

var exports = module.exports = oop.builder(function Notifier(){
  return oop.create( this )
    .delegate( new EventEmitter(), 'on', 'once', 'emit' )
    .o
  ;
}, {
  toString: function(){
    return "[object Notifier]";
  }
});

exports.version = "1";
exports.stability = 1;

