var oop = require('iai-oop')
  , iai = require('iai')
  , validators = iai('data/validators')
  , ValidationError = iai('data/ValidationError')
  , ValidationErrorList = iai('data/ValidationErrorList')
;

/**
 * @builder Field: The leaf for Schema-Field composite pair.
 */

var Field = oop.builder(function(opts){
  opts = opts || {};

  return oop.create(this)
    .visible( 'blank', !!opts.blank )
    .o
  ;
}, {
  validate: function( data, callback ){
    if( "function" !== typeof callback ){
      throw new TypeError("callback should be a function");
    }
    callback = callback.bind.bind(callback, null);

    console.log( this.blank, "data", data, validators.empty(data) );
    if( this.blank && validators.empty(data) ){
      return process.nextTick( callback(null, data) );
    }

    console.log("try");

    try {
      process.nextTick( callback(null, validators.NotEmpty(data)) );
    } catch( error ){
      process.nextTick( callback(error, null) );
    }
    /*
    var error = null, cleaned = null;
    try {
      cleaned = validators.NotEmpty(data);
    } catch( err ){
      error = err
    }
    process.nextTick( callback(error, null) );
    */
    return this;
  },
  toString: function(){
    return "[object Field]";
  }
})

var exports = module.exports = Field;

exports.version = "0";
exports.stability = 1;

