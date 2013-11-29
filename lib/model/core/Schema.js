var oop = require('iai-oop')
  , iai = require('../../..')
  , Field = iai( 'model/core/Field' )
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
    console.log( this.data );
    this.data.fields[name] = field;
    return this;
  },
  fields: function( fields ){
    for( var name in fields ){
      this.field( name, fields[name] )
    }
    return this;
  },
  validate: function( data ){
    console.log( "validate schema", this.data.fields )
    for( var name in this.data.fields ){
      console.log( "validate", name )
      this.data.fields[name].validate();
    }
  },
  toString: function(){
    return "["+( "object"||this.name )+" Schema]";
  }
})

exports.version = "0";
exports.stability = 1;
