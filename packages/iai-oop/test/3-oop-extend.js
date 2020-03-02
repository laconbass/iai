var assert = require( 'chai' ).assert
  , oop = require( '..' )
;

describe( "#extend", function(){
  it( "should behave as expected", function(){
    var prototype = { bar: "bar" };
    var foo = oop.extend( prototype, { baz: "baz" } );
    assert.deepEqual( foo, { bar: "bar", baz: "baz" }, "equivalence ok");
    assert.isTrue( foo.hasOwnProperty("bar"), "bar should be owned" )
    assert.isTrue( foo.hasOwnProperty("baz"), "baz should be owned" )
  })
})

describe( "an object returned by #extend( ... )", function(){
  // TODO recursiveness
  before(function(){
    this.case = oop.extend({
      parentMethod: function(){ return "check check"; },
      property: "property value",
      property2: "override me"
    }, {
      method: function(){
        return "method returned value";
      },
      property2: "overrided!"
    });
  })
  // TODO cleanup this mess
  it( "should maintain its properties", function(){
    assert.isFunction( this.case.parentMethod, 'parentMethod exists' )
    assert.isTrue( this.case.hasOwnProperty('parentMethod') )
    assert.equal( this.case.parentMethod(), "check check" )
  })
  // TODO and this too
  it( "should have the properties given as own properties", function(){
    assert.isTrue( this.case.hasOwnProperty( 'method' ),
                  "method should be owned" );
    assert.equal( this.case.method(), "method returned value" );
    assert.isTrue( this.case.hasOwnProperty( 'property' ),
                  "property should be owned" );
    assert.equal( this.case.property, "property value" );
    assert.isTrue( this.case.hasOwnProperty( 'property2' ),
                  "property2 should be owned" );
    assert.equal( this.case.property2, "overrided!" );
  })
})
