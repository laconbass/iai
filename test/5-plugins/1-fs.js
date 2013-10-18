var assert = require('chai').assert
  , iai = require( '../../' )
  , test = require( 'iai-test' )
  //, root = iai( 'plugins/root' )
;

describe.skip( "root api", function(){
  it( "should be exposed as a function",function(){
    assert.isFunction( root );
  })
  it.skip( "should have the following methods", function(){
    test.methods( root, "Directory", "File" );
  })
  it( "should generate a plugin if desired", function(done){
    iai.api( __dirname )
      .mount( root )
      .then(function(){
        assert.isDefined( this.root, "plugin not defined" );
        assert.isObject( this.root, "plugin should be an object" );
        assert.instanceOf( this.root, iai( 'plugin' ), "instanceof should work" )
        done();
      })
    ;
  })
})

describe.skip( "root plugin", function(){
    beforeEach(function(done){
      this.api = iai.api( __dirname )
        .mount( root )
        .then( done )
      ;
    })

    it( "should be exposed as instance of Fsitem => Directory", function(){
      assert.isDefined( this.api.content, 'plugin is not exposed' );
      assert.instanceOf( this.api.content, content.Directory, 'is not instanceof Directory' );
      assert.instanceOf( this.api.content, content.FsItem, 'is not instanceof FsItem' );
    })
    it( "should have the following api", function(){
      var content = this.api.content;
      assert.isFunction( this.api.content.head, '#head function' );
      assert.isFunction( this.api.content.get, '#get function' );
      assert.isFunction( this.api.content.post, '#post function' );
      assert.isFunction( this.api.content.put, '#put function' );
      assert.isFunction( this.api.content.delete, '#delete function' );
    })
    describe( "#head", function(){
      it( "should accept 1 argument as string (the node name)", function(){
        this.api.content.head( 'something' );
      })
      it( "should return true if the given node name is within its data", function(){
        assert.isTrue( this.api.content.head('section1'), 'section1 found' )
        assert.isTrue( this.api.content.head('section2'), 'section2 found' )
        assert.isTrue( this.api.content.head('section3'), 'section3 found' )
        assert.isTrue( this.api.content.head('section1-1'), 'section1-1 found' )
        assert.isTrue( this.api.content.head('section1-2'), 'section1-2 found' )
      })
      it( "should return false if the given node name is not within its data")
    })
    describe( "#post", function(){
      it( "should throw an error if none arguments given")
      it( "should accept 1 argument as string (the node name)")
      it( "should add a child with the name given")
      it( "should throw an error if a child with the given name already exists")
    })
    describe( "#get", function(){
      it( "should throw an error if none arguments given", function(){
        assert.throws(function(){
          this.api.content.get();
        });
      })
      it( "should accept 1 argument as string (the node name)", function(){
        this.api.content.get( 'something' );
      })
      it( "should return all the nodes within its data for the given name")
    })
    describe( "#put", function(){
      it( "should throw an error if none arguments given")
      it( "should accept 2 arguments as strings (the node name and the new name)")
      it( "should throw an error if there isn't a node with the given name")
      it( "should change the child name to the new one")
    })
    describe( "#delete", function(){
      it( "should throw an error if none arguments given")
      it( "should accept 1 argument as string (the node name)")
      it( "should throw an error if there isn't a node with the given name")
      it( "should change the child name to the new one")
    })
  })
