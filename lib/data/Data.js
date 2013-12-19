var iai = require('iai')
  , oop = iai('oop')
  , is = iai('is')
  , ValidationError = iai('data/ValidationError')
;
/**
 * @builder Data: The interface for Schema-Field composite pair.
 * @pattern Composite
 */

var exports = module.exports = oop.builder(function(opts){
  return Object.create(this);
}, {
  error: ValidationError,
  validate: function( data, callback ){
    if( "function" !== typeof callback ){
      throw new TypeError("callback should be a function");
    }
    throw new Error("Objects inheriting Data must implement #validate")
  },
  toString: function(){
    return "<"+(this._fieldType||"Data")+" ["
      + Object.keys(this)
        // remove properties being false
        .filter(function(n){ return this[n] !== false; }, this)
        // display only name for values being true
        .map(function(n){ return this[n] === true? n : n+'='+this[n]; }, this)
        .join(', ')
      + "]>"
    ;
  }
})

exports.version = "0";
exports.stability = 1;
