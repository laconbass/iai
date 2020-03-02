var assert = require( "chai" ).assert
  , oop = require( ".." )
;

describe( "#create", function(){
  it( "should return a new oop standard api staged with "
     +"a new object with specified prototype", function(){
       var prototype = { bar: "baz" };
       var foo = oop.create(prototype);

       assert.deepEqual( foo, oop(Object.create(prototype)), "Api ok" );
       assert.deepEqual( foo.o, Object.create(prototype), "staged correctly" );

       foo.o.bar = "other";
       assert.notDeepEqual( prototype, foo.o, "independency ok" );
     })
})
