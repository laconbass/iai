var assert = require( "chai" ).assert
  , is = require( ".." )
;

describe( "isNumber", function() {
  it( "should be exposed", function(){
    assert.isFunction( is.Number );
  })
  it( "should be be returned by is('Number')", function(){
    assert.isFunction( is('Number') );
    assert.deepEqual( is('Number'), is.Number );
    assert.equal( is('Number').toString(), is.Number.toString() );
  })
  it( "should return true given", function(){
    for( var name in true_cases ){
      assert.isTrue( is.Number( true_cases[name] ), name );
    }
  })
  it( "should return false given", function(){
    for( var name in false_cases ){
      assert.isFalse( is.Number( true_cases[name] ), name );
    }
  })
});

var true_cases = {
  // Integer Literals
  "a Negative integer string": "-10",
  "Zero string": "0",
  "Positive integer string": "5",
  "Negative integer number": -16,
  "Zero integer number": 0,
  "Positive integer number": 32,
  "Octal integer literal string": "040",
  "Octal integer literal": 0144,
  "Hexadecimal integer literal string": "0xFF",
  "Hexadecimal integer literal": 0xFFF,

  // Floating-Point Literals
  "Negative floating point string": "-1.6",
  "Positive floating point string": "4.536",
  "Negative floating point string with comma": "-4,536",
  "Positive floating point string with comma": "4,536",
  "Negative floating point number": -2.6,
  "Positive floating point number": 3.1415,
  "Exponential notation": 8e5,
  "Exponential notation string": "123e-2",
};

// Non-numeric values
var false_cases = {
  "Empty string": "",
  "Whitespace characters string": "        ",
  "Tab characters string": "\t\t",
  "Alphanumeric character string": "abcdefghijklm1234567890",
  "Non-numeric character string": "xabcdefx",
  "Boolean true literal": true,
  "Boolean false literal": false,
  "Number with preceding non-numeric characters": "bcfed5.2",
  "Number with trailling non-numeric characters": "7.2acdgs",
  "Undefined value": undefined,
  "Null value": null,
  "NaN value": NaN,
  "Infinity primitive": Infinity,
  "Positive Infinity": Number.POSITIVE_INFINITY,
  "Negative Infinity": Number.NEGATIVE_INFINITY,
  "Date object": new Date(2009,1,1),
  "Empty object": new Object(),
  "Instance of a function": function(){}
};



