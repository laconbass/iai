var assert = require("chai").assert
  , iai = require("../..")
  , test = iai( "test" )
  , BaseError = iai( "core/BaseError" )
  , ErrorList = iai( "core/BaseErrorList" )
;

describe( "BaseError", function(){
  it( "should be a function", function(){
    assert.isFunction( BaseError );
  })
  it( "should return Error instances", function(){
    assert.instanceOf( BaseError("check check"), Error )
  })
  it( "should return BaseError instances", function(){
    assert.instanceOf( BaseError("testing"), BaseError );
  })
  it( "should have a message property", function(){
    var msg = "something went wrong :S";
    assert.equal( BaseError(msg).message, msg );
  })
  it( "should have a stack property", function(){
    assert.isDefined( BaseError("check").stack );
  })
  it( "should have a name property being 'BaseError'", function(){
    assert.equal( BaseError("something").name, "BaseError" );
  })
  it( "should have a proper string representation", function(){
    var err = BaseError("Oops! Something went wrong :(");
    assert.equal( err.toString(), "BaseError: Oops! Something went wrong :(" )
  })
})

describe( "ErrorList", function(){
  it( "should be a function", function(){
    assert.isFunction( ErrorList );
  })
  it( "should return Error instances", function(){
    assert.instanceOf( ErrorList( BaseError ), Error )
  })
  it( "should return ErrorList instances", function(){
    assert.instanceOf( ErrorList( BaseError ), ErrorList );
  })
  it( "should have a message property being an empty string", function(){
    assert.equal( ErrorList(BaseError).message, "" );
  })
  it( "should have a stack property", function(){
    assert.isDefined( ErrorList(BaseError).stack );
  })
  it( "should have a name property being '*ErrorList'", function(){
    assert.equal( ErrorList(BaseError).name, "BaseErrorList" );
  })
  it( "should have a length property", function(){
    assert.equal( ErrorList(BaseError).length, 0 );
  })

  describe('#toArray', function(){
    it( "should be a function", function(){
      assert.isFunction( ErrorList(BaseError).toArray );
    })
    it( "should return an array", function(){
      assert.isArray( ErrorList(BaseError).toArray() );
    })
  })

  describe('#push', function(){
    it( "should be a function", function(){
      assert.isFunction( ErrorList(BaseError).push );
    })
    it( "should add a new errors", function(){
      var messages = [ "something happened", "foo", "bar" ]
        , copy = messages.slice(0)
        , list = ErrorList(BaseError)
        , n = 0
      ;
      while( copy.length ){
        list.push( BaseError(copy.shift()) )
        assert.equal( list[n].message, messages[n], "check"+n )
        n++;
      }
      assert.equal( list.length, messages.length, "lengths should match")
    })
    it( "should properly increment list.length", function(){

    })
  })

  describe('#pop', function(){
    it( "should be a function", function(){
      assert.isFunction( ErrorList(BaseError).pop );
    })
  })

  describe('#shift', function(){
    it( "should be a function", function(){
      assert.isFunction( ErrorList(BaseError).shift );
    })
  })

  describe('#unshift', function(){
    it( "should be a function", function(){
      assert.isFunction( ErrorList(BaseError).unshift );
    })
  })

  describe('#join', function(){
    it( "should be a function", function(){
      assert.isFunction( ErrorList(BaseError).join );
    })
  })

  describe('#map', function(){
    it( "should be a function", function(){
      assert.isFunction( ErrorList(BaseError).map );
    })
  })

  describe("#toString", function(){
    it("should return '<name> (empty)' if list is empty", function(){
      var str = ErrorList(BaseError).toString();
      assert.equal( str, "BaseErrorList (empty)" )
    })
    it("should return '<name>' plus errors line by line", function(){
      var messages = [ "something happened", "foo", "bar", "yeah!" ]
        , list = ErrorList(BaseError)

      ;
      while( messages.length ){
        var msg = messages.shift();
        list.push( BaseError(msg) )
      }
      assert.equal( list.toString(),
"\
BaseErrorList\n\
  something happened\n\
  foo\n\
  bar\n\
  yeah!\n\
" )
    })
  })
})
