var assert = require('chai').assert;
var oop = require('..');

describe('lazyLoad', function(){
  it('should be a function', function(){
    assert.isFunction( oop(null).lazyLoad );
  })
  it('should be aliased as lazyload to prevent misstypes', function(){
    assert.strictEqual( oop(null).lazyLoad, oop(null).lazyload );
  })
  it('should return the value returned by loader always', function(){
    function loader(){ return 'foo'; };
    var lazy = oop({}).lazyload( 'bar', loader ).o;

    for( var i = 0; i < 10; i++ ) assert.equal( lazy.bar, 'foo' );
  });
  it('should call loader only once', function(){
    var count = 0;
    function loader(){ count++; return 'foo'; };
    var lazy = oop({}).lazyload( 'bar', loader ).o;

    for( var i = 0; i < 10; i++ ) assert.equal( lazy.bar, 'foo' );
    assert.equal( count, 1 );
  });
  it('should apply third argument to loader as arguments', function(){
    function loader( a ){ assert.equal(a, 'a' ); return 'foo'; };
    var lazy = oop({}).lazyload( 'bar', loader, ['a'] ).o;

    for( var i = 0; i < 10; i++ ) assert.equal( lazy.bar, 'foo' );
  })
  it('should coerce non-arrays if neccessary', function(){
    function loader( a ){ assert.equal(a, 'a' ); return 'foo'; };
    var lazy = oop({}).lazyload( 'bar', loader, 'a' ).o;

    for( var i = 0; i < 10; i++ ) assert.equal( lazy.bar, 'foo' );
  })
  it('should work with require', function(){
    var target = '../examples/1-prototype';
    var t = require( target );
    var lazy = oop({}).lazyload( 'bar', require, target ).o;

    for( var i = 0; i < 10; i++ ) assert.strictEqual( lazy.bar, t );
  })
})
