var oop = require('iai-oop')
  , iai = require('../../..')
  , validators = iai('core/validators')
  , ValidationError = validators
;

/**
 * @builder Field: The leaf for Schema-Field composite pair.
 */

var Field = oop.builder(function(opts){
  opts = opts || {};
  opts.required = !!opts.required;

  var instance = oop.create(this)
    .hidden( 'validators', [] )
    .hidden( 'opts', opts )
    .o
  ;
  if( !!opts.required ){
    instance.validator( validators.NotEmpty );
  }
  return instance;
}, {
  validate: function( data, callback ){
    var error = null;
    this.validators.forEach(function(fn){
      try {
        fn( data );
      } catch(err) {
        if( !(err instanceof ValidationError) ){
          throw err;
        }
        error = error || ValidationErrorList();
        error.push(err);
      }
    })
    if( !callback && error ){
      throw error;
    } else if( callback ){
      process.nextTick( callback.bind( this, error, this.clean(data) ) );
    }
    return this.clean(data);
  },
  // registers a validator function for this field
  validator: function( fn ){
    if( "function" != typeof fn ){
      throw TypeError( "field validator must be a function" );
    }
    this.validators.push(fn);
    return this;
  },
  clean: function( data ){
    return data;
  },
  toString: function(){
    return "[object Field]";
  }
})

var exports = module.exports = Field;

exports.version = "0";
exports.stability = 1;

/**
 * @builder ValidationErrorList: Error wrapper for an array of ValidationError instances
 */

var ValidationErrorList = exports.ErrorList = oop.builder(function(){
  return oop( ValidationError(this.message, this.code) )
    .visible( 'errors', [] )
    .visible( 'push', this.push )
    .o
  ;
}, ValidationError.prototype, {
  message: "There are some validation errors.",
  code: "error_list",
  push: function( error ){
    if( !(error instanceof ValidationError) ){
      throw error;
      throw TypeError( "ErrorList expects errors to be instances of ValidationError" );
    }
    this.errors.push( error );
    return this;
  }
})

/**
 * @builder TextField
 */

var TextField = oop.builder(function(){
  return Field.call(this)
}, Field.prototype, {
})

exports.Text = TextField;

/**
 * @builder Email
 */

var EmailField = oop.builder(function(opts){
  var instance = Field.call(this, opts);
  instance.validator( validators.email );
  return instance;
}, Field.prototype, {
})

exports.Email = EmailField;

