var assert = require('chai').assert
  , iai = require('../..')
  , test = iai('test')
  , Field = iai('data/Field')
  , Schema = iai('data/Schema')
;

describe( 'Schema', function(){
  it( 'should be a builder', function(){
    test.builder( Schema, [] );
  })
  it( 'should have the following chainable api', function(){
    test.chainableApi( Schema(), {
      'field': [ 'some_name', Field() ], // composite 'add'
      'fields': [ {} ], // multiple composite 'add'
    })
  })
  it( 'should validate as expected', function(done){
    var schema = Schema()
    .name( 'testing-schema' )
    .description( 'this schema is meant for testing' )
    .fields({
      id: Field({ unique: true }),
      name: Field.Text({ required: true, max_length: 30 }),
      email: Field.Email({ required: true }),
      password: Field.Text({ encrypt: "sha1" })
    })
    ;
    schema.validate( {}, done );
  })
})
