var assert = require('chai').assert
  , iai = require('../..')
  , test = iai('test')
  , Field = iai('data/Field')
;

describe( 'Field', function(){
  it( 'should be a builder', function(){
    test.builder( Field, [] );
  })
  it( 'should have the following methods', function(){
    test.methods( Field(), "validate", "clean" )
  })
})
