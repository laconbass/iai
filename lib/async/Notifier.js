/**
   * @function notifier: create a new notifier.
   * @pattern: Proxy
   *
   * Each notifier wraps a new event emitter which can only be accesed
   * through some methods [emit, on, once].
   */

var exports = module.exports = Notifier;

exports.version = "1";
exports.stability = 1;

function Notifier(){
  var notifier = new EventEmitter();

  return oop.create( this.prototype )
    .delegate( notifier, 'on', 'once', 'emit' )
    .o
  ;
}

var EventEmitter = require( 'events' ).EventEmitter
  , oop = require( '../oop' )
;

oop.define( Notifier, {} );
