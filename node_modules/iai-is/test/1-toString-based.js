var assert = require( "chai" ).assert
  , is = require( ".." )
;

describe( "is", function(){
  it( "should be exposed as a function", function(){
    assert.isFunction( is );
  })
  it( "should return a function when called", function(){
    assert.isFunction( is('something') );
  })
  it( "should cache the created functions", function(){
    assert.equal( is('something').toString(), is.something );
    assert.equal( is('Function').toString(), is.Function );
    assert.equal( is('Object').toString(), is.Object );
  })
})
