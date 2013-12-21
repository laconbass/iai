var iai = require('iai')
  , oop = iai('oop')
  , is = iai('is')
  , sequence = iai('async/sequence')
  , ValidationError = require('./ValidationError')
  , ValidationErrorList = require('./ValidationErrorList')
  , SchemaValidationError = require('./SchemaValidationError')
  , Field = require( './Field' )
  , Parent = iai('data/Data')
;

var exports = module.exports = oop.builder(function(name, fields){
  if( 'string' != typeof name ){
    fields = name;
    name = null;
  }
  return oop( Parent.call(this) )
    .internal( '_fields', {} )
    .o
    .setName( name )
    .addFields( fields )
  ;
  return oop( Parent.call(this) )
    .internal( '_type', name || 'Schema' )
    //.internal( '_desc', '' )
    .internal( '_fields', {} )
    .o
  ;
}, Parent.prototype, {
  setName: function( name ){
    oop(this).internal( '_type', name || 'Schema' )
    return this;
  },
  /*setDescription: function( description ){
    oop(this).internal( '_desc', description || '' )
    return this;
  },*/
  addField: function( name, field ){
    if( !(field instanceof Field) ){
      throw TypeError( this+" field '"+name+"' must be a Field instance" );
    } else if( !!this[name] ){
      throw Error( this+" already has a field called '"+name+"'" );
    }
    this[name] = field;
    return this;
  },
  addFields: function( fields ){
    for( var name in fields ){
      this.addField( name, fields[name] )
    }
    return this;
  },
  validate: function( data, callback ){
    console.log( "validate schema", this+"" )
    var error = null
      , clean = {}
      , keys = Object.keys(this).filter(function(n){ return 'function' !== typeof this[n]; }, this)
      , self = this
    ;
    sequence( keys, function step( index, name, next ){
      self[name].validate( data[name], function( err, cleaned ){
        if( err ){
          var isList = err instanceof ValidationErrorList;
          if( !(err instanceof ValidationError) && !isList ){
            throw err;
          }
          error = error || SchemaValidationError();
          if( isList ){
            err.each(function(err){ error.add( name, err); });
          } else {
            error.add( name, err );
          }
        } else {
          clean[name] = cleaned
        }
        next();
      });
    }, function complete(){
      callback( error, error? null:clean );
    }), this;
    return this;
  }
})

exports.version = "0";
exports.stability = 1;
