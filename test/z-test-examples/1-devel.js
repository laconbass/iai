var assert = require( "chai" ).assert
  , Browser = require( "zombie" )
  , iai = require( "../.." )
  , https = require( "https" )
  , project = null
  , TEST_PORT = 8888
;

describe( "example devel project", function(){

  it( "should export a project api, required without errors", function(){
    project = iai( '../examples/devel' );
  })

  it( "should start an https server on desired port, and stop it", function(done){
    console.log("");
    project
      .on( 'request', function( req, res ){
        res.writeHead( 200, {
          Connection: "close"
        });
        res.end( "ok" );
      })
      .listen( TEST_PORT )
    ;
    https.request({
      hostname: 'localhost',
      port: TEST_PORT,
      rejectUnauthorized: false
    }, project.close.bind( project, done ) )
      .on( 'error', done )
      .end()
    ;
  })
  it.skip( "should connect to a mongodb server", function(){
    require( project.resolve('test-db') );
  })
})

describe( "devel web interface", function(){
  beforeEach(function(done){
    this.visit = function(){
      arguments[0] = "https://localhost:"+TEST_PORT+arguments[0];
      return Browser.visit.apply( Browser, arguments );
    };

    console.log("");
    project
    .on( 'request', function( req, res ){
      res.writeHead( 200, {
        Connection: "close"
      });
      res.end( "ok" );
    })
    .listen( TEST_PORT, done )
    ;
    // fix for zombie self signed cert
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  })

  afterEach(function(done){
    project.close(done);
  })

  describe( "/", function(){
    it( "should display the login form", function( done ){
      this.visit( "/", function( err, browser ){
        if( err ) return done(err);

        console.log( "" );
        assert.isTrue( browser.success, "visit should succeed" );
        assert.isNotNull( browser.query("#user-login"), "form should be on response" )
      })
    })
  })
})
