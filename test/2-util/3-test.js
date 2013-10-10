var assert = require( "chai" ).assert
  , iai = require( "../.." )
  , test = iai( "util/test" )
;

describe( "util/test", function(){

  it( "should return the wanted cases", function(){
    for( var name in test.cases ){
      assert.deepEqual( test( name ), test.cases[name], name+' not ok' );
    }
  })

  describe( "#chainableApi", function(){
    it( "should be a function", function(){
      assert.isFunction( test.chainableApi );
    })

    var interface = {
      // interface used for all tests
      "foo": [ "arg1" ],
      "bar": [ null, 134 ],
      "baz": [ 1, 2, 3, "abcd" ]
    };

    it( "should execute methods applying arguments", function(){
      test.chainableApi( {
        foo: function( a ){
          assert.equal( a, "arg1", "foo argument" )
          return this;
        },
        bar: function( a1, a2 ){
          assert.isNull( a1, "foo argument 1" )
          assert.equal( a2, 134, "foo argument 2" )
          return this;
        },
        baz: function( a1, a2, a3, a4 ){
          assert.equal( a1, 1, "baz argument 1" )
          assert.equal( a2, 2, "baz argument 2" )
          assert.equal( a3, 3, "baz argument 3" )
          assert.equal( a4, "abcd", "baz argument t" )
          return this;
        }
      }, interface );
    })

    function throws( api, description, regexp ){
      assert.throws(function(){
        test.chainableApi( api, interface );
      }, Error, regexp, description );
    }

    function yes(){ return this; }

    function createTestCase( bad, regexp ){
      return function(){
        assert.doesNotThrow(function(){
          test.chainableApi( { foo: yes, bar: yes, baz: yes }, interface );
        }, Error, "given all good" );
        throws( { foo: yes, bar: yes, baz: bad }, "given bad baz", regexp);
        throws( { foo: yes, bar: bad, baz: yes }, "given bad bar", regexp );
        throws( { foo: yes, bar: bad, baz: bad }, "given bad bar and baz", regexp );
        throws( { foo: bad, bar: yes, baz: yes }, "given bad foo", regexp );
        throws( { foo: bad, bar: yes, baz: bad }, "given bad foo and baz", regexp );
        throws( { foo: bad, bar: bad, baz: yes }, "given bad foo, bar", regexp );
        throws( { foo: bad, bar: bad, baz: bad }, "given  all bad", regexp );
      }
    }

    it( "should assert methods to be functions", createTestCase(
      undefined, /is not a function/
    ))

    it( "should assert methods return the current context", createTestCase(
      function(){ }, /does not return current context/
    ))
    it( "should throw an error if any methods throws an error", createTestCase(
      function(){ throw Error( "Oops"); }, /Oops/
    ))
  })
  describe( "#notifierApi", function(){
    it( "should be a function", function(){
      assert.isFunction( test.notifierApi );
    })
  })
})
