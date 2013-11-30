var assert = require("chai").assert
  , iai = require("../..")
  , test = iai( "test" )
  , validators = iai( "data/validators" )
  , ValidationError = validators
;

describe( "ValidationError", function(){
  it( "should be a function", function(){
    assert.isFunction( ValidationError );
  })
  it( "should return Error instances", function(){
    assert.instanceOf( ValidationError("other check"), Error )
  })
  it( "should return ValidationError instances", function(){
    assert.instanceOf( ValidationError("testing"), ValidationError );
  })
  it( "should have a message property", function(){
    var msg = "something went wrong :S";
    assert.equal( ValidationError(msg).message, msg );
  })
  it( "should have a stack property", function(){
    assert.isDefined( ValidationError("check").stack );
  })
  it( "should have a name property being 'ValidationError'", function(){
    var err = ValidationError("something");
    assert.equal( err.name, "ValidationError" );
  })
  it( "should have a proper string representation", function(){
    var err = ValidationError("Oops! Something went wrong :(");
    assert.equal( err.toString(), "ValidationError: Oops! Something went wrong :(" )
  })
})

describe( "RegExpValidator", function(){
  it( "should be a function that returns a function", function(){
    assert.isFunction( validators.RegExp, "should be a function" );
    assert.isFunction( validators.RegExp(), "should return a function" );
  })
  describe( "returned function", function(){

    var validator = validators.RegExp({ re: /RegularExpresion/ });

    it( "should pass the following cases", function(){
      validator( "RegularExpresion" )
    })
    it( "should throw on the following cases", function(){
      var cases = test( /.*/ );
      for( var caseName in cases ){
        testFail( validator, cases[caseName] );
      }
    })
  })
})

function testOk( validator, value ){
  return function(){
    validator(value)
  }
}

function testFail( validator, value ){
  return function(){
    assert.throws(function(){
      validator( value );
    }, ValidationError);
  }
}

function autoTest( name, validator, regexp ){
  describe( name, function(){
    it( "should be a function", function(){
      assert.isFunction( validator );
    })
    var cases = test( regexp );
    for( var caseName in cases ){
    it( "should pass given "+caseName, testOk(validator, cases[caseName]) );
    }
    cases = test( regexp, "reverse" );
    for( var caseName in cases ){
      it( "should throw given "+caseName, testFail(validator, cases[caseName]) );
    }
  })
}

describe( "builtin rexep validators", function(){
  autoTest( "CamelCase validator", validators.CamelCase, /CamelCase/ );
  autoTest( "camelCase validator", validators.camelCase, /camelCase/ );
  autoTest( "slug validator", validators.slug, /slug/ );
})

describe("Number validator", function(){
  autoTest( "is.Number feature", validators.Number(), /number/ );
  describe( "match_value feature", function(){
    var validator = validators.Number({ match_value: 1988 });
    var cases = test(/.*/);
    for( var caseName in cases ){
      it( "should throw given "+caseName, testFail(validator, cases[caseName]) );
    }
    it( "should pass given the correct match_value", function(){
      validator( 1988 );
    })
    it( "should fail with a descriptive error given not a number", function(){
      try {
        validator( NaN );
      } catch(err) {
        assert.equal( err.code, 'invalid_number' )
      }
    })
    it( "should fail with a descriptive error given a number != match_value", function(){
      try {
        validator( 123456 );
      } catch(err) {
        assert.equal( err.code, 'match_value' )
      }
    })
  })
  describe( "max_value feature", function(){
    var validator = validators.Number({ max_value: 9 });
    function throws( value, message, err_match ){
      assert.throws(function(){
        validator( value );
      }, ValidationError, err_match || /Garanta que este valor sexa menor ou igual a/, message );
    }
    it( "should fail given a number greater than max_value", function(){
      throws( "10", "string '10'" );
      throws( 10, "number 10" );
      throws( 1955, "4 digit number" )
      throws( 10e2, "exponential notation" )
    })
    it( "should pass given a number less than or equal to max_value", function(){
      validator(9);
      validator(6);
      validator(3);
      validator(-15);
      validator("9");
      validator("5");
      validator("-1235");
      validator( 10e-2 )
    })
  })
  describe( "min_value feature", function(){
    var validator = validators.Number({ min_value: 2 });
    function throws( value, message, err_match ){
      assert.throws(function(){
        validator( value );
      }, ValidationError, err_match || /Garanta que este valor sexa maior ou igual a/, message );
    }
    it( "should fail given a number smaller than min_value", function(){
      throws( 1, "number 1" );
      throws( "1", "string '1'" );
      throws( "-1", "string '-1'" );
      throws( "-16", "string '-16'" );
      throws( -16, "number -16" );
      throws( 10e-2, "exponential notation" )
    })
    it( "should pass given a number greater than or equal to min_value", function(){
      validator(2);
      validator(25);
      validator(255006);
      validator("2");
      validator("46");
      validator("50e13");
      validator( 50e13 );
    })
  })
})

describe( "Length validator", function(){
  describe( "max_value feature", function(){
    var validator = validators.Length({ max_value: 9 });
    function throws( value, message, err_match ){
      assert.throws(function(){
        validator( value );
      }, ValidationError, err_match || /Garanta que a lonxitude deste valor sexa menor ou igual a/, message );
    }
    it( "should fail given anything with length greater than limit", function(){
      throws( "1234567890", "10 characters" );
      throws( "abcdefghijklmnñopqrstuvwxyz", "25 characters" );
      throws( Array(10), "Array(10)" )
      throws( Array(123), "Array(123)" )
      throws( { length: 99 }, "fake 99 length object" );
    })
    it( "should pass given anything with length less or equal than limit", function(){
      validator( "123456789", "9 characters" );
      validator( "", "empty string" );
      validator( Array(9), "Array(10)" )
      validator( Array(0), "Array(123)" )
      validator( { length: 3 }, "fake 3 length object" );
    })
  })
  describe( "min_value feature", function(){
    var validator = validators.Length({ min_value: 4 });
    function throws( value, message, err_match ){
      assert.throws(function(){
        validator( value );
      }, ValidationError, err_match || /Garanta que a lonxitude deste valor sexa maior ou igual a/, message );
    }
    it( "should fail given somthing with length smaller than min_value", function(){
      throws( "0", "1 character" );
      throws( "abc", "3 characters" );
      throws( Array(1), "Array(1)" )
      throws( Array(2), "Array(2)" )
      throws( { length: 3 }, "fake 99 length object" );
    })
    it( "should pass given a something with length greater than or equal to min_value", function(){
      validator( "123456789", "9 characters" );
      validator( Array(10), "Array(10)" )
      validator( Array(123), "Array(123)" )
      validator( { length: 4 }, "fake 3 length object" );
    })
  })
})
