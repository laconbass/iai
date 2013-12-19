var iai = require('iai')
  , oop = iai('oop')
  , is = iai('is')
  , Parent = iai('data/Data')
;

/**
 * @builder Field: The leaf for Schema-Field composite pair.
 * @pattern Composite
 */

var Field = oop.builder(function Pepe(opts){
  opts = opts || {};
  return oop( Parent.call(this) )
    .internal( '_fieldType', 'Field' )
    .visible( 'blank', !!opts.blank )
    .visible( 'unique', !!opts.unique )
    .o
  ;
}, Parent.prototype, {
  validate: function( data, callback ){
    if( "function" !== typeof callback ){
      throw new TypeError("callback should be a function");
    }
    callback = callback.bind.bind(callback, null);

    if( !this.blank && is.Empty(data) ){
      process.nextTick( callback(this.error(
        "Este campo debe conter un valor.", "empty"
      ), null) )
    } else {
      process.nextTick( callback(null, data) );
    }

    return this;
  }
})

var exports = module.exports = Field;

exports.version = "0";
exports.stability = 1;

