var assert = require( "chai" ).assert
  , iai = require( "../.." )
  , loader = iai( "util/loader" )
;

describe( "util/loader", function() {

    it( "should return a function when called passing a string", function(){
        assert.isFunction( loader( "foo" ) );
    })

    var load = loader( __dirname );

    describe( "given a dirname, the returned function", function(){
        it( "should require modules relative to that dirname", function(){
            var basename = require( "path" ).basename( __filename, ".js" );
            assert.deepEqual( require( __filename ), load( basename ) );
        });
        it( "should throw an error if the module does not exist", function(){
            assert.throws(function(){
              load( "this-doesnt-exist" );
            })
        });
    })
});