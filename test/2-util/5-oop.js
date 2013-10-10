var assert = require( "chai" ).assert
  , iai = require( "../.." )
  , oop = iai( "util/oop" )
  , test = iai( "util/test" )
;

function testChainableApi( api, methods ){
  for( var name in methods ){
    assert.isFunction( api[ name ], name + ' exists' );
    assert.deepEqual(
      api[ name ].apply( api, methods[name] ), api, name + ' chains'
    );
  }
}

describe( "util/oop", function(){

  it( "should return an standard oop api", function(){
    testChainableApi( oop({}), {
      visible: [ 'visible name', 'visible value' ],
      hidden: [ 'hidden name', 'hidden value' ],
      set: [ 'set name', 'set value' ],
      extend: [ {} ],
      notifier: []
    });
  });

  describe( "standard oop api", function(){
    it( "should store the subject on an 'o' property", function(){
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

    describe( "#notifier", function(){
      beforeEach(function(){
        this.case = oop( {} ).notifier().o;
      })
      it( "should define a notifier api", function(){
        test.notifierApi( this.case );
      })
      describe( "#emit", function(){
        it( "should call 'on' listeners preserving the args", function(done){
          this.case.on( 'test', function( a1, a2 ){
            assert.equal( a1, 1, "argument 1 preserved" )
            assert.equal( a2, "something", "argument 2 preserved" )
            done()
          }).emit( 'test', 1, 'something' );
        })
        it( "should call 'on' listeners multiple times", function(done){
          var count = 0;
          this.case.on( 'test', function(){
              if( count > 5 ) return done();
              count++;
              this.emit( 'test' )
          }).emit( 'test' );
        })
        it( "should call 'once' listeners only once", function(done){
          this.case.once( 'test', function(){
            // will call done 2 times if not ok
            done()
          }).emit( 'test' ).emit( 'test' )
        })
        it( "should throw an emitted error if no error listerners bound", function(){
          var q = this.case;
          assert.throws(function(){
            q.emit( 'error', Error("something happened") )
          }, /something happened/)
        })
        it( "should not throw errors when catched by listeners", function(done){
          this.case
          .on( 'error', function(err){
            if( err.message=="secret" ){
              return done();
            }
            done( Error( "this was not expected") )
          })
          .emit( 'error', Error("secret") )
        })
      })
      describe( "#on", function(){
        it( "should delegate on #notifier.on preserving the args", function(done){
          this.case
            .on( 'test', done )
            .emit( 'test' )
          ;
        })
      })
      describe( "#once", function(){
        it( "should delegate on #notifier.once preserving the args", function(done){
          this.case
            .once( 'test', done )
            .emit( 'test' )
          ;
        })
      })
    })
  })

  describe( "#create", function(){
    it( "should return a new oop standard api staged with "
       +"a new object with specified prototype", function(){
         var prototype = { bar: "baz" };
         var foo = oop.create(prototype);

         assert.deepEqual( foo, oop(Object.create(prototype)), "Api ok" );
         assert.deepEqual( foo.o, Object.create(prototype), "staged correctly" );

         foo.o.bar = "other";
         assert.notDeepEqual( prototype, foo.o, "independency ok" );
    })
  })

  describe( "#extend", function(){
    it( "should behave as expected", function(){
      var prototype = { bar: "bar" };
      var foo = oop.extend( prototype, { baz: "baz" } );
      assert.deepEqual( foo, { bar: "bar", baz: "baz" }, "equivalence ok");
      assert.isFalse( foo.hasOwnProperty("bar"), "bar should be inherited" )
      assert.isTrue( foo.hasOwnProperty("baz"), "baz should be owned" )
    })
  })

  describe( "an object created by .extend( null, prototype )", function(){
    beforeEach(function(){
      this.prototype1 = {
        method: function(){
          return "method returned value";
        },
        property: "property value"
      };
      this.case = oop.extend( null, this.prototype1 );
    })
    it( "should have null as prototype", function(){
      assert.isNull( Object.getPrototypeOf(this.case) )
    })
    it( "should have the properties given as own properties", function(){
      assert.isTrue( Object.prototype.hasOwnProperty.call( this.case, 'method' ),
                    "method should be owned" );
      assert.equal( this.case.method(), "method returned value" );
      assert.isTrue( Object.prototype.hasOwnProperty.call( this.case, 'property' ),
                    "property should be owned" );
      assert.equal( this.case.property, "property value" );
    })
  })

  describe( "#define", function(){
    beforeEach(function(){
      function foo(){
        return bar.create.apply( bar, arguments );
      };
      var bar = oop.define( foo, {
        create: function(){
          return Object.create(this);
        }
      });
      this.fn = foo;
      this.proto = bar;
      this.cases = {
        'Object.create': Object.create(bar),
        'bar.create': bar.create(),
        'call foo': foo()
      }
    })
    it( "should throw a TypeError if first arg is not a named function", function(){
      var cases = {
        'null': null,
        'undefined': ''.notDefined,
        'string': 'str',
        'number': 123,
        'array': [ 1, 2, 3 ],
        'object': { a:1, b:2 },
        'anonymous fn': function(){}
      };
      for( var name in cases ){
        assert.throws(function(cases, name){
          oop.define( cases[name], { test: 'value' } )
        }.bind({}, cases, name), TypeError, /.*/, name )
      }
    })
    it( "should return the second argument given", function(){
      var returns = oop.define( function foo(){}, 'bar' )
      assert.equal( returns, 'bar' );
    })
    it( "should fix the instanceof checks as expected", function(){
      for( var name in this.cases ){
        assert.instanceOf( this.cases[name], this.fn, name );
      }
    })
    it( "should add toString as expected", function(){
      for( var name in this.cases ){
        assert.equal( this.cases[name].toString(), '[object foo]', name );
        var realType = Object.prototype.toString.call( this.cases[name] );
        assert.equal( realType, '[object Object]', name+' real type' );
      }
      var baz = oop.define(function Test(){}, {
        toString: function(){
          return 'do not override toString';
        }
      });
      assert.equal( Object.create(baz).toString(), 'do not override toString' )
    });
    it( "should add toString as expected", function(){
      for( var name in this.cases ){
        assert.equal( this.cases[name].toString(), '[object foo]', name );
      }
    });
    it( "should not depend on constructor return values", function(){
      function Test(){}
      var baz = oop.define(Test, {})
      assert.instanceOf(Object.create(baz), Test);
    })

  })
});
