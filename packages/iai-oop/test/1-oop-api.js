var assert = require( "chai" ).assert
  , test = require( "iai-test" )
  , oop
;

describe( "oop", function(){
  it( "should be required without throwing errors", function(){
    assert.doesNotThrow(function(){
      oop = require( '..' );
    })
  })

  it( "should expose a function", function(){
    assert.isFunction( oop );
  })

  it( "should return an standard oop api", function(){
    test.chainableApi( oop({}), {
      visible: [ 'visible name', 'visible value' ],
      hidden: [ 'hidden name', 'hidden value' ],
      set: [ 'set name', 'set value' ],
      accessor: [ 'accessor name', function(){}, function(){} ],
      extend: [ {} ],
      delegate: [ { method1: function(){} }, 'method1' ]
    });
  });
});

describe( "OopStandardApi instances", function(){
  it( "should store the staged object on an 'o' property", function(){
    var crazy = { 1: 'secret', other: { null: undefined, a: Array(5) } };
    assert.deepEqual( oop( crazy ).o, crazy );
  })
  describe( "#visible", function(){
    it( "should define an enumerable, non-writable value", function(){
      var foo = foo = oop({}).visible( 'visible name', 'some value' ).o
      , descriptor = test.defined( foo, "visible name" )
      ;
      assert.isTrue( descriptor.enumerable, 'enumerable' )
      assert.isFalse( descriptor.writable, 'writable' );
      assert.equal( descriptor.value, "some value", 'value' );
    })
  })
  describe( "#hidden", function(){
    it( "should define a non-enumerable, non-writable value", function(){
      var foo = oop({}).hidden( 'hidden name', 'other value' ).o
      , descriptor = test.defined( foo, "hidden name" )
      ;
      assert.isFalse( descriptor.enumerable, 'enumerable' )
      assert.isFalse( descriptor.writable, 'writable' )
      assert.equal( descriptor.value, 'other value' )
    })
  })
  describe( "#internal", function(){
    it( "should define a non-enumerable, writable value", function(){
      var foo = oop({}).internal( 'some name', 'go internal' ).o
      , descriptor = test.defined( foo, "some name" )
      ;
      assert.isFalse( descriptor.enumerable, 'enumerable' )
      assert.isTrue( descriptor.writable, 'writable' )
      assert.equal( descriptor.value, 'go internal' )
    })
  })
  describe( "#set", function(){
    it( "should define a enumerable, configurable, writable value", function(){
      var foo = oop({}).set( 'bar', 'baz' ).o
      , descriptor = test.defined( foo, "bar" )
      ;
      assert.isTrue( descriptor.writable, 'writable' )
      assert.isTrue( descriptor.enumerable, 'enumerable' )
      assert.isTrue( descriptor.configurable, 'configurable' )
      assert.equal( descriptor.value, 'baz' )
    })
  })
  describe( "#accessor", function(){
    it( "should define a getter and a setter for value", function(){
      var someValue = "something";
      var otherValue = "triggering setter"
      var object = oop({})
      .accessor( 'value', function(){ return someValue; }, function(val){
        assert.equal( val, otherValue, "setter should receive new value" );
      })
        .o
      ;
      var descriptor = test.defined( object, "value" );
      assert.isTrue( descriptor.enumerable, "accesor should be enumerable" )
      assert.isFalse( descriptor.configurable, "accesor should be configurable" )

      assert.equal( object.value, someValue, "value should be returned from getter" )

      someValue = false;
      assert.isFalse( object.value, "value should be false now" )

      object.value = otherValue;
      assert.notEqual( object.value, otherValue, "value should be assigned by getter" );
    })
  })
  describe( "#provider", function(){
    it( "should define a getter and a setter for value", function(){
      var someValue = "something";
      var otherValue = "triggering setter"
      var object = oop({})
      .provider( 'value', function(){ return someValue; }, function(val){
        assert.equal( val, otherValue, "setter should receive new value" );
      })
        .o
      ;
      var descriptor = test.defined( object, "value" );
      assert.isFalse( descriptor.enumerable, "provider should be non-enumerable" )
      assert.isFalse( descriptor.configurable, "provider should be non-configurable" )

      assert.equal( object.value, someValue, "value should be returned from getter" )

      someValue = false;
      assert.isFalse( object.value, "value should be false now" )

      object.value = otherValue;
      assert.notEqual( object.value, otherValue, "value should be assigned by getter" );
    })
  })
  describe( "#flag", function(){
    it( "should define a property defaulting to boolean value", function(){
      assert.isTrue(  oop({}).flag('test', true).o.test, "should be true"  );
      assert.isFalse(  oop({}).flag('test', false).o.test, "should be false"  );
      assert.isTrue(  oop({}).flag('test', 1).o.test, "1 should equal true"  );
      assert.isFalse(  oop({}).flag('test', 0).o.test, "0 should equal false"  );
    });
    describe( 'the property #flag defines', function(){
      it( "should be able to be set to false", function(){
        var foo = oop({}).flag('bar', true).o;
        foo.bar = false;
        assert.isFalse( foo.bar );
      });
      it( "should throw when it's set to non-boolean", function(){
        var foo = oop({}).flag('bar', true).o;
        assert.throws(function(){
          foo.bar = null;
        })
      });
    });
  })
  describe( "#extend", function(){
    it( "should define each property given on staged object", function(){
      var foo = oop({}).extend({
        method: function(){ return "bar"; },
        property: "baz"
      }).o
      assert.equal( foo.method(), "bar" );
      assert.equal( foo.property, "baz" );
    })
  })
  describe( "#delegate", function(){
     it( "should delegate on given object methods preserving the args", function(){
       var secret1 = "tshhh", secret2 = "robots", secret3 = "humans";
       var object = {
         all: function( a1, a2, a3 ){
           assert.equal( a1, secret1, "argument 1 should be preserved" )
           assert.equal( a2, secret2, "argument 2 should be preserved" )
           assert.equal( a3, secret3, "argument 3 should be preserved" )
         },
         other: function(){}
       }
       var object2 = oop({}).delegate( object, "all", "other" ).o;
       assert.isTrue( object2.hasOwnProperty("all"), "should set 'all'")
       assert.isTrue( object2.hasOwnProperty("other"), "should set 'other'")
       assert.isFunction( object2.all, "'all' should be a function" )
       assert.isFunction( object2.other, "'other' should be a function" )
       // test argument preserving
       object2.all( secret1, secret2, secret3 );
     })
  })
})
