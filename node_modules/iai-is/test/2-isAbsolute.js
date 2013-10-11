var assert = require( "chai" ).assert
  , is = require( ".." )
;

describe( "isAbsolutePath", function() {
  it( "should be exposed", function(){
    assert.isFunction( is.AbsolutePath );
  })
  it( "should be be returned by is()", function(){
    assert.isFunction( is('AbsolutePath') );
    assert.deepEqual( is('AbsolutePath'), is.AbsolutePath );
    assert.equal( is('AbsolutePath').toString(), is.AbsolutePath.toString() );
  })
  it( "should return true given", function(){
    for( var name in true_cases ){
      assert.isTrue( is.AbsolutePath( true_cases[name] ), name );
    }
  })
  it( "should return false given", function(){
    for( var name in false_cases ){
      assert.isFalse( is.AbsolutePath( false_cases[name] ), name );
    }
  })
});

var true_cases = {
  "unix absolute path": "/foo/bar",
  "windows absolute path": "c:\\foo\\bar"
};

var false_cases = {
  "unix relative path": "foo/bar",
  "unix relative path leading dot": "./foo/bar",
  "unix relative path leading dot double": "../foo/bar",
  "windows relative path": "foo\\bar"
};
