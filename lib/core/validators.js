/**
 * Strongly inspired by [django's core validators](https://github.com/django/django/blob/master/django/core/validators.py)
 */

var iai = require( '../..' )
  , oop = iai( 'oop' )
  , is = iai( 'is' )
  , isRegExp = is( 'RegExp' )
  , format = iai( 'utils/replaceTags' );
;

var exports = module.exports = VError;

exports.version = '1';
exports.stability = 2;

/**
 * @function ValidationError: Builds a ValidationError
 *
 */

function VError( message, code, params ){
  var instance = Object.create( VError.prototype );
  instance.message = format( message || "Unknown error", params || {} );
  instance.code = code;
  Error.captureStackTrace( instance, VError )
  return instance;
}

VError.prototype = Object.create( Error.prototype );
VError.prototype.name = "ValidationError";

var ValidationError = VError;

/**
 * @builder BaseValidator
 *
 */

var EMPTY_VALUES = [ null, undefined, '', [], {} ]

var BaseValidator = oop.builder(function(opts){
  var instance = Object.create(this);

  opts = opts || {};
  if( !!opts.msg ){
    instance.message = opts.msg;
  }
  if( opts.code ){
    instance.code = opts.code;
  }

  return instance;
}, {
  message: "Introduza un valor válido.",
  code: "empty",
  clean: function( value ){
    return value;
  },
  validate: function( value ){
    if( !!~EMPTY_VALUES.indexOf(value) ){
      throw ValidationError( this.message, this.code );
    }
    return this.clean( value );
  }
});

exports.NotEmpty = BaseValidator.prototype.validate.bind( BaseValidator() );

/**
 * @builder RegExpValidator
 *
 * a validator that validates any value through a regular expresion
 */

var RegExpValidator = oop.builder(function(opts){
  var instance = BaseValidator.call(this, opts);

  opts = opts || {};
  if( isRegExp(opts.re) ){
    instance.re = opts.re;
  }
  /*var h = instance.validate.bind(instance);
  h.testObj = instance;
  return h;*/
  return instance.validate.bind(instance);
}, BaseValidator.prototype, {
  re: /.^/, // this regexp never will match
  message: "Introduza un valor válido.",
  code: "invalid",
  clean: function( value ){
    return "string" == typeof value? value : (
      isNaN(value)
      || !isFinite(value)
      || value === null
      || value === undefined
    )? "" : value.toString();
  },
  validate: function( value ){
    value = this.clean(value);
    if( !this.re.test(value) ){
      throw ValidationError( this.message, this.code );
    }
    return value;
  }
})

exports.RegExp = RegExpValidator;

/**
 * some handy RegExp validators:
 *   - CamelCase
 *   - camelCase
 *   - slug
 *
 */

exports.CamelCase = RegExpValidator({
  re: /^([A-Z][a-z]+)+$/,
  msg: "Introduza unha cadea de caracteres en formato 'CamelCase'."
})

exports.camelCase = RegExpValidator({
  re: /^[a-z]+([A-Z][a-z]+)*$/,
  msg: "Introduza unha cadea de caracteres en formato 'camelCase'."
})

exports.slug = RegExpValidator({
  re: /^[-a-zA-Z0-9_]+$/,
  msg: "Introduza un 'slug' válido formado por letras, números, guións ou guións baixos."
})

/**
 * @builder NumericValidator
 *
 * A validator that validates given values are valid numbers within optional limits
 *
 */

var NumberValidator = oop.builder(function(opts){
  var instance = BaseValidator.call(this, opts);

  opts = opts || {};
  Object.keys(instance.features).forEach(function(code){
    instance[code] = is.Number(opts[code])? opts[code] : null;
  });

  return instance.validate.bind(instance);
}, BaseValidator.prototype, {
  message: 'Introduza un número válido.',
  code: 'invalid_number',
  features: {
    match_value: function( value, limit ){ return value != limit; },
    max_value: function( value, limit ){ return value > limit; },
    min_value: function( value, limit ){ return value < limit; }
  },
  messages: {
    match_value: 'Garanta que este valor sexa %(match_value)s (agora é %(clean_value)s).',
    max_value: 'Garanta que este valor sexa menor ou igual a %(max_value)s.',
    min_value: 'Garanta que este valor sexa maior ou igual a %(min_value)s.'
  },
  clean: function( value ){
    return value;
  },
  validate: function( value ){
    value = this.clean(value);
    if( !is.Number(value) ){
      throw ValidationError( this.message, this.code );
    }
    Object.keys(this.features).forEach(function(code){
      if( this[code] !== null && this.features[code](value, this[code]) ){
        var params = { clean_value: value };
        params[code] = this[code];
        throw ValidationError( this.messages[code], code, params );
      }
    }, this);
    return Number( value.toString().replace(',', '.') );
  }
});

exports.Number = NumberValidator;

/**
 * @builder LengthValidator
 *
 * A numeric validator for value's length
 *
 */

var LengthValidator = oop.builder(function(opts){
  return NumberValidator.call( this, opts );
}, NumberValidator.prototype, {
  //message: 'A lonxitude deste valor debe ser un número válido.',
  messages: {
    match_value:  'Garanta que a lonxitude deste valor sexa %(match_value)s (agora é %(clean_value)s).',
    max_value: 'Garanta que a lonxitude deste valor sexa menor ou igual a %(max_value)s.',
    min_value: 'Garanta que a lonxitude deste valor sexa maior ou igual a %(min_value)s.'
  },
  clean: function( value ){
    return value && value.length || 0;
  }
})

exports.Length = LengthValidator;
