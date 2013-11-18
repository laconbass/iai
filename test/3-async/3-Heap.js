var assert = require( "chai" ).assert
  , test = require( "iai-test" )
  , iai = require( "../.." )
  , Heap = iai( "async/Heap" )
;

describe( "async/Heap", function(){
  it( "should be a builder", function(){
    test.builder( Heap )
  })
})

describe( "Heap instances", function(){
  beforeEach(function(){
    this.heap = Heap();
  })

  it( "should inherit from notifier", function(){
    assert.instanceOf( this.heap, iai( "async/Notifier" ) );
  })

  it( "should have the following chainable api", function(){
    test.chainableApi( this.heap, {
      "task": [ function( done ){} ],
      "then": [ function(){} ]
    });
  })

  describe( "#task", function(){
    it( "should execute given task if none tasks added yet", function(done){
      this.heap.task(function(callback){
        done();
      })
    })
    it("should execute the task function as expected", function(done){
      var api = this.heap.task(function(callback){
        assert.deepEqual( this, api, "context is not the current api" )
        assert.isFunction( callback, "callback is not a function" )
        done();
      })
    })
    it( "should emit the error passed to callback", function(done){
      var pass = Error("Oops!");
      this.heap.task(function(callback){
        callback( pass );
      }).on( 'error', function(err){
        assert.deepEqual( err, pass );
        done();
      })
    })
    it( "should skip all tasks if callback receives error", function(done){
      var pass = Error( "something happened" )
      this.heap
        .task(function(callback){
          callback( pass )
        })
        .task(function(callback){
          done( Error( "this should be skiped") );
        })
        .on( 'error', function(err){
          assert.equal( err, pass );
          done();
        })
      ;
    })
    it( "should emit an error thrown on the task", function(done){
      var oops = Error( "Oops" );
      this.heap
      .task(function(callback){
        throw oops;
      })
      .on('error', function(err){
        assert.deepEqual( err, oops );
        done();
      })
    })
  })

});
