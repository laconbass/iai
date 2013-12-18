var assert = require('chai').assert
  , iai = require('../..')
  , test = iai('test')
  , Field = iai('data/Field')
  , fields = iai('data/fields')
  , ValidationError = iai('data/ValidationError')
;

describe.skip( 'Field', function(){
  it( 'should be a builder', function(){
    test.builder( Field, [] );
  })
  it( 'should have the following methods', function(){
    test.methods( Field(), "validate" )
  })
  describe('blank feature', function(){
    it("should be disabled by default", function(){
      var field = Field();
      assert.isFalse( field.blank )
    })
    it("should be enabled if desired", function(){
      var field = Field({ blank: true });
      assert.isTrue( field.blank )
    })
    var filled = [ "something", { a: 1 }, [1,2], new Date() ]
      , empty = ["", [], {}, undefined, null ]
    ;

    describe("when enabled", function(){
      var field = Field({ blank: true });
      empty.concat(filled).forEach(function(val){
        it("should validate successfully '"+val+"'", function(done){
          field.validate(val, function(err, cleaned){
            assert.isNull(err, "bar error for"+val);
            assert.deepEqual(cleaned, val, "bad data for"+val);
            done()
          })
        })
      })
    })
    describe("when disabled", function(done){
      var field = Field();
      filled.forEach(function(val){
        it("should validate successfully '"+val+"'", function(done){
          field.validate(val, function(err, cleaned){
            assert.isNull(err, "bar error for"+val);
            assert.deepEqual(cleaned, val, "bad data for"+val);
            done()
          })
        })
      })
      empty.forEach(function(val){
        it("should fail validating '"+val+"'", function(done){
          field.validate(val, function(err, cleaned){
            assert.instanceOf(err, ValidationError, "bar error");
            assert.isNull(cleaned, "bad data");
            done();
          })
        })
      })
    })
  })
})
