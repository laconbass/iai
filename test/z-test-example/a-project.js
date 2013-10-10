var assert = require( "chai" ).assert
  , iai = require( "../.." )
;

describe.skip( "example project file", function(){

  beforeEach(function(){
    this.project = iai( '../examples/project' );
  })

  it.skip( "should export a loader function and the mount points as Event Emitters", function(){
    assert.isFunction( this.project, 'exports a function' )
    assert.isFunction( this.project.resolve, 'exports a resolve function' )

  })

  var EventEmitter = require( 'events' ).EventEmitter;


})
