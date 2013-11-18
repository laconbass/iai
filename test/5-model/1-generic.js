var assert = require('chai').assert
  , iai = require('../../..')
  , test = iai('test')
  , testOpts = { system: 'SQLite' };
;

describe.only( 'generic model interface', function(){
  describe( 'Connection', function(){
    var Connection;
    it( 'should be required without errors', function(){
      Connection = iai('plugins/model/Core/Connection.js');
    })
    it( 'should have the following api', function(){
      test.methods( Connection(testOpts), 'open', 'close' );
    })
  })
  describe( 'DAO', function(){
    var DAO;
    it( 'should be required without errors', function(){
      DAO = iai('plugins/model/Core/DAO.js');
    })
    it( 'should have the following api', function(){
      test.methods( DAO(testOpts), 'create', 'retrieve', 'update', 'destroy' );
    })
  })
  describe( 'Facade', function(){
    var Facade;
    it( 'should be required without errors', function(){
      Facade = iai('plugins/model/Core/Facade.js');
    })
    it( 'should have the following api', function(){
      test.methods( Facade(testOpts), 'find', 'findOne', 'create', 'update', 'destroy' );
    })
  })

  describe( 'Schema', function(){})
  describe( 'Field', function(){})
})
