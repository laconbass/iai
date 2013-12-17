var oop = require('iai-oop')
  , iai = require('../..')
  , sequence = iai('async/sequence')
  , ValidationError = require('./ValidationError')
  , ValidationErrorList = require('./ValidationErrorList')
  , SchemaValidationError = require('./SchemaValidationError')
  , Field = require( './Field' )
  , Parent = Field
;

var exports = module.exports = oop.builder(function(){
  return oop( Parent.call(this) )
    .visible( 'data', {
      name: null,
      description: null,
      fields: {}
    })
    .o
  ;
}, Parent.prototype, {
  name: function( name ){
    this.data.name = name;
    return this;
  },
  description: function( description ){
    this.data.description = description;
    return this;
  },
  field: function( name, field ){
    if( !(field instanceof Field) ){
      throw TypeError( this+" field '"+name+"' must be a Field instance" );
    } else if( !!this.data.fields[name] ){
      throw Error( this+" already has a field called '"+name+"'" );
    }
    this.data.fields[name] = field;
    return this;
  },
  fields: function( fields ){
    for( var name in fields ){
      this.field( name, fields[name] )
    }
    return this;
  },
  validate: function( data, callback ){
    console.log( "validate schema", this.data.fields )
    var error = null
      , clean = {}
    ;
    sequence( this.data.fields, function step( name, field, next ){
      field.validate( data[name], function( err, cleaned ){
        if( err ){
          var isList = err instanceof ValidationErrorList;
          if( !(err instanceof ValidationError) && !isList ){
            throw err;
          }
          error = error || SchemaValidationError();
          if( isList ){
            err.each(function(err){ error.set( name, err); });
          } else {
            error.set( name, err );
          }
        } else {
          clean[name] = cleaned
        }
        next();
      });
    }, function complete(){
      callback( error, error? null:clean );
    });
    return this;
  },
  toString: function(){
    return "["+( "object"||this.name )+" Schema]";
  }
})

exports.version = "0";
exports.stability = 1;
