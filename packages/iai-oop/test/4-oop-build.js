var assert = require( 'chai' ).assert
  , oop = require( '..' )
;

describe( "#build", function(){
  it( "should be exposed as function", function(){
    assert.isFunction( oop.build );
  })
})

describe( "being Ancestor a constructor using #build, it", function(){
  function Ancestor(){
    var instance = oop.build( Ancestor.prototype, this );
    instance.foo = "bar";
    return instance;
  }
  Ancestor.prototype.constructor = Ancestor;
  var ancestor = Ancestor.prototype;

  describe( "should return a new object inheriting it", function(){
    it( "when Ancestor.prototype was specified as context", function(){
      var obj = Ancestor.call( ancestor );
      // ineritance tests
      assert( ancestor.isPrototypeOf(obj) );
      assert.instanceOf( obj, Ancestor );
      // do not return the prototype
      assert.notStrictEqual( obj, ancestor );
    });
    it( "when Ancestor was called within its prototype", function(){
      var obj = ancestor.constructor();
      assert( ancestor.isPrototypeOf(obj) );
      assert.instanceOf( obj, Ancestor );
      assert.notStrictEqual( obj, ancestor );
    });
    it( "when no context was specified (global context)", function(){
      var obj = Ancestor();
      assert( ancestor.isPrototypeOf(obj) )
      assert.instanceOf( obj, Ancestor );
      assert.notStrictEqual( obj, ancestor );
    });
    it( "when context was set to null (null cant apply)", function(){
      var obj = Ancestor.call(null);
      assert( ancestor.isPrototypeOf(obj) )
      assert.instanceOf( obj, Ancestor );
      assert.notStrictEqual( obj, ancestor );
    });
    it( "when context was set to undefined (it cant apply", function(){
      var obj = Ancestor.call(undefined);
      assert( ancestor.isPrototypeOf(obj) )
      assert.instanceOf( obj, Ancestor );
      assert.notStrictEqual( obj, ancestor );
    });
  });
  describe( "should return the given context when it", function(){
    it( "was set to an object inheriting Ancestor", function(){
      var ctx = Object.create( Ancestor.prototype );
      ctx.baz = "other";
      var obj = Ancestor.call( ctx );
      assert( ancestor.isPrototypeOf(obj) )
      assert.instanceOf( obj, Ancestor );
      assert.notStrictEqual( obj, ancestor );
      // it should return the context given
      assert.equal( ctx.foo, "bar" );
      assert.equal( ctx.baz, "other" );
      assert.equal( obj.foo, ctx.foo );
      assert.equal( obj.baz, ctx.baz );
      assert.strictEqual( obj, ctx, 'obj should be a reference to ctx' );
    })
  })

  describe( "should throw an error", function(){
    function testItFailsWith( context ){
      try {
        Ancestor.call( context );
        throw 'NOT_DETECTED'
      } catch( error ){
        if( error == 'NOT_DETECTED' ){
          throw new Error('Bad context not detected');
        } else if( error.code !== 'OOP_BUILD_CONTEXT' ) {
          throw error;
        }
      }
    }
    it( "when context was set to a non-descendant (empty)", function(){
      testItFailsWith( {} );
    });
  });
})
