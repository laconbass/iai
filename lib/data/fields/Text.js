var iai = require('iai')
  , oop = iai('oop')
  , is = iai('is')
  , Parent = iai('data/Field')
;

/**
 * @builder TextField
 */

module.exports = oop.builder(function(opts){
  opts = opts || {};

  return oop( Parent.call(this, opts) )
    .internal('_fieldType', 'TextField')
    .visible('max_length', is.Number(opts.max_length)? opts.max_length : false)
    .visible('min_length', is.Number(opts.min_length)? opts.min_length : false)
    .o
  ;
}, Parent.prototype, {
  validate: function( data, callback ){
    if( !is.String(data) ){
      process.nextTick( callback.bind(null, this.error(
        "Este campo debe conter unha cadea de texto.", "string"
      ), null) )
      return this;
    }
    if( this.max_length !== false && data.length > this.max_length ){
        process.nextTick( callback.bind(null, this.error(
          "A lonxitude máxima deste campo é de %(max)s (agora é %(len)s).",
          "too_long", { len: data.length, max: this.max_length }
      ), null) )
      return this;
    }
    return Parent.prototype.validate.apply(this, arguments);
  }
});

module.exports.version = "1";
module.exports.stability = 2;
