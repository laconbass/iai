var assert = require('chai').assert
  , iai = require('../..')
  , test = iai('test')
  , testOpts = { system: 'Dummy' }
  , Connection = iai('model/core/Connection')
  , DAO = iai('model/core/DAO')
  , Facade = iai('model/core/Facade')
;

describe( 'generic model interface', function(){
  describe( 'Connection', function(){
    it( 'should be a builder', function(){
      test.builder( Connection, [testOpts] )
    })
    it( 'should be a factory for specific management system connections', function(){
      assert( Connection(testOpts) instanceof iai('model/dummy/DummyConnection') )
    })
    it( 'should have the following api', function(){
      test.methods( Connection(testOpts), 'open', 'close' );
    })
  })
  describe( 'DAO', function(){
    it( 'should be a builder', function(){
      test.builder( DAO, [testOpts] )
    })
    it( 'should be a factory for specific management system DAOs', function(){
      assert( DAO(testOpts) instanceof iai('model/dummy/DummyDAO') )
    })
    it( 'should have the following api', function(){
      test.methods( DAO(testOpts), 'create', 'retrieve', 'update', 'destroy' );
    })
  })
  describe( 'Facade', function(){
    it( 'should be a builder', function(){
      test.builder( Facade, [testOpts] )
    })
    it( 'should have the following api', function(){
      test.methods( Facade(testOpts), 'find', 'findOne', 'create', 'update', 'destroy' );
    })
    describe( '#connection', function(){
      var facade = Facade(testOpts);
      it( 'should be a Connection instance', function(){
        assert( facade.connection instanceof Connection );
      })
    })
    describe( '#dao', function(){
      var facade = Facade(testOpts);
      it( 'should be a DAO instance', function(){
        assert( facade.dao instanceof DAO );
      })
    })
  })

  describe( 'Schema', function(){})
  describe( 'Field', function(){})
})
