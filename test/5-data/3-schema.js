var assert = require('chai').assert
  , iai = require('../..')
  , test = iai('test')
  , fields = iai('data/fields')
  , Schema = iai('data/Schema')
  , SchemaValidationError = iai('data/SchemaValidationError')
;

describe( 'Schema', function(){
  it( 'should be a builder', function(){
    test.builder( Schema, [] );
  })
  it( 'should have the following chainable api', function(){
    test.chainableApi( Schema(), {
      'addField': [ 'some_name', iai('data/Field')() ], // composite 'add'
      'addFields': [ {} ], // multiple composite 'add'
    })
  })
  it( 'should validate as expected', function(done){
    var schema = Schema( 'testing-schema', {
      id: iai('data/Field')({ unique: true }),
      name: fields('Text')({ max_length: 30 }),
      email: fields('Text')({ }),
      password: fields('Text')({ encrypt: "sha1", min_length: 6 })
    })
    ;
    schema.validate( {}, function(err, cleaned){
      assert.instanceOf( err, SchemaValidationError, "error should be present" );
      assert.isNull( cleaned, "cleaned data should be null when failed" );
      console.dir( err.map )
    });
  })
})
