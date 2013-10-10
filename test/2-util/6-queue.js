var assert = require( "chai" ).assert
  , iai = require( "../.." )
  , queue = iai( "util/queue" )
  , test = iai( "util/test" )
;

describe( "util/queue", function(){
  it( "should be a function", function(){
    assert.isFunction( queue );
  })
  it( "should throw a TypeError if argument given is not a function", function(){
    var cases = {
      "empty string": "",
      "string": "foo bar baz",
      "undefined": "".undefined_property,
      "null": null,
      "a Number": 456,
      "an Array": [ 1, 50, 'foo', { a: 2 } ],
      "an Object": { a: 1, b: 2, c: [1, 2, 3] }
    };
    for( var name in cases ){
      assert.throws(function( name ){
        queue( cases[name] )
      }.bind({}, name), TypeError, /must be a function/, name);
    }
  })
  it( "should return a queue instance", function(){
    function worker(){};
    assert.instanceOf( queue(worker), queue );
  })
})

describe( "queue instances", function(){
  it( "should have the following api", function(){
    test.chainableApi( queue(function(){}), {
      "emit": [ "drained" ],
      "once": [ "event", function(){} ],
      "on": [ "event", function(){} ],
      "push": [ "data" ]
    })
  })
  it( "should implement the notifier interface", function(){
    test.notifierApi( queue(function(){}) )
  });
  describe( "#push", function(){
    it( "should execute the worker if queue is empty", function(done){
      var q = queue(function worker( data, callback ){
        done();
      }).push( "something" )
    })
    it( "should pass to the worker the args expected", function(done){
      var something = { o: 0, b: 1 };
      var q = queue(function worker( data, callback ){
        assert.deepEqual( data, something, 'data received' );
        assert.isFunction( callback, 'callback is function' );
        done();
      }).push(something)
    })
    it( "should query datas while working and process them in order", function(done){
      var order = [], count = 1
      function counter(){ return count++; };
      var q = queue(function worker( data, callback ){
        order.push( data() );
        setTimeout(callback, 5);
      })
      .push(counter).push(counter).push(counter).push(counter)
      .push(function(callback){
        assert.deepEqual( order, [1,2,3,4] );
        done();
      })
      ;
    })
  })
  describe( "the worker callback function", function(){
    it( "should emit given error", function(done){
      var pass = Error("Oops");
      queue(function worker( data, callback ){
        setTimeout(function(){
          callback( pass );
        }, 20);
      })
      .on( "error", function( err ){
        assert.deepEqual( err, pass );
        done();
      })
      .push( {} ) // execute worker
    });
     it( "should skip next datas given an error", function(done){
      var pass = Error( "this will be thrown" );
      var q = queue(function worker(data, callback){
        callback( data );
      })
      .push( pass )
      .push( Error( "this should not be thrown") )
      .push( Error( "neither this") )
      .on( 'error', function(err){
          assert.equal( err, pass );
          done();
       })
      ;
    })
    it( "should emit an error thrown on the worker", function(done){
      var pass = Error( "Oh no!" );
      queue(function( data, callback ){
        throw pass;
      })
      .on( "error", function( err ){
        assert.deepEqual( err, pass );
        done();
      })
      .push( "data" )
    })
  })
})
