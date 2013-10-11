var assert = require( "chai" ).assert
  , isAbsolute = require( "../.." )( "util/isAbsolute" )
;

describe( "util/isAbsolute", function() {
    var true_cases = {
        "unix absolute path": "/foo/bar",
        "windows absolute path": "c:\\foo\\bar"
    };
    for ( key in true_cases ) {
        it( "should return true given: "+key, function(){
            assert.isTrue( isAbsolute( true_cases[key] ) );
        });
    }
});