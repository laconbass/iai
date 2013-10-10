/**
 * # test utils #
 * @function test: returns a set of pre-defined test cases
 *   @param cases [String]: must be within Object.keys( test.cases );
 */

var exports = module.exports = test;

exports.version = "1";
exports.stability = 1;

function test( cases ){
  if( !~Object.keys( test.cases ).indexOf(cases) ){
    throw Error( "["+cases+"] is not within test.cases");
  }
  return test.cases[ cases ];
}

/**
 * ## Generic test casse ##
 *
 * A collection of generic test cases, meant to be used on unit testing.
 *
 */
test.cases = {};

test.cases[ "integer literals" ] = {
  "a Negative integer string": "-10",
  "Zero string": "0",
  "Positive integer string": "5",
  "Negative integer number": -16,
  "Zero integer number": 0,
  "Positive integer number": 32,
  "Octal integer literal string": "040",
  "Octal integer literal": 0144,
  "Hexadecimal integer literal string": "0xFF",
  "Hexadecimal integer literal": 0xFFF
};

test.cases[ "floating point literals" ] = {
  "Negative floating point string": "-1.6",
  "Positive floating point string": "4.536",
  "Negative floating point string with comma": "-4,536",
  "Positive floating point string with comma": "4,536",
  "Negative floating point number": -2.6,
  "Positive floating point number": 3.1415,
  "Exponential notation": 8e5,
  "Exponential notation string": "123e-2"
}

test.cases[ "string literals" ] = {
  "Empty string": "",
  "Whitespace characters string": "        ",
  "Tab characters string": "\t\t",
  "Alphanumeric character string": "abcdefghijklm1234567890",
  "Non-numeric character string": "xabcdefx",
  "Number with preceding non-numeric characters": "bcfed5.2",
  "Number with trailling non-numeric characters": "7.2acdgs",
};

test.cases[ "boolean literals" ] = {
  "Boolean true literal": true,
  "Boolean false literal": false
}

test.cases[ "infinity values" ] = {
  "Infinity primitive": Infinity,
  "Positive Infinity": Number.POSITIVE_INFINITY,
  "Negative Infinity": Number.NEGATIVE_INFINITY
}
test.cases[ "mixed values" ] = {
  "Undefined value": undefined,
  "Null value": null,
  "NaN value": NaN,
  "Array object": [ 1, 2, 3, 4 ],
  "Date object": new Date(2009,1,1),
  "Empty object": new Object(),
  "Instance of a function": function(){}
}

var assert = require( 'assert' )
  , isFn = require( './is' )( 'Function' )
;
/**
 * ## Object property testers ##
 *
 * @function defined: Asserts `o` has a property named `pname`.
 *   @param o [Any]: The object to be tested
 *   @param pname [String]: The property name
 *   @returns: the property descriptor
 *
 * see [Object.getOwnPropertyDescriptor reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
 *
 */

test.defined = function( o, pname ){
  var descriptor = Object.getOwnPropertyDescriptor( o, pname );
  assert( descriptor, o + "#" + pname + " is not defined" );
  return descriptor;
};

/**
 * @function methods: Asserts `o` has defined methods named by arg 2 and onwards.
 *   @param o [Any]: The object to be tested
 *   @param name1 [String]: A method name
 *   @param name2 [String]: A method name
 *   @param nameN [String]: A method name
 *
 */
test.methods = function( o ){
  Array.prototype.slice.call( arguments, 1 )
  .forEach(function(value){
    test.defined( o, value );
    assert( isFn( o[value] ), o+"#"+value+" is not a function" );
  })
}

/**
 * @function chainableApi: Asserts api implements methods, and methods return api
 *   @param api [Object]: the object to be tested
 *   @param methods [Hash]: keys are method names, values arrays with valid arguments
 *
 * Ex:
 *     test.chainableApi( foo, {
 *       "bar": [ "each", "item", "is", "an", "argument" ],
 *       "baz": [ "arg1", "arg2", "..." ]
 *     })
 *
 * This snipnet asserts:
 *   - foo implements the properties "bar" and "baz" as functions.
 *   - bar and baz, when applied foo and its argument array, return foo.
 */
test.chainableApi = function( api, methods ){
  for( var name in methods ){
    assert( isFn( api[name] ), api+'#'+name+' is not a function' );
    assert.deepEqual( api[ name ].apply( api, methods[name] ), api,
                      api+'#'+name+' does not return current context'
    );
  }
};

/**
 * @function notifierApi: Asserts api implements the notifier interface
 *   @param api [Object]: the object to be tested
 *
 *
 * The notifier interface is usually added to objects through oop( o ).notifier
 */
test.notifierApi = function( api ){
  // api should implement the following methods
  test.chainableApi( api, {
    emit: [ 'event name' ],
    on: [ 'on event', function(){} ],
    once: [ 'once event', function(){} ]
  });
};
