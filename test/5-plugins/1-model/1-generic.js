var assert = require('chai').assert
  , iai = require('../../..')
  , test = iai('test')
;

describe.only( 'generic model interface', function(){
  describe( 'Connection', function(){
    var Connection;
    it( 'should be required without errors', function(){
      Connection = iai('plugins/model/core/Connection.js');
    })
    it( 'should have the following api', function(){
      test.methods( Connection(), 'open', 'close' );
    })
  })
  describe( 'DAO', function(){
    var DAO;
    it( 'should be required without errors', function(){
      DAO = iai('plugins/model/core/DAO.js');
    })
    it( 'should have the following api', function(){
      test.methods( DAO(), 'create', 'retrieve', 'update', 'destroy' );
    })
  })
  describe( 'Facade', function(){
    var Facade;
    it( 'should be required without errors', function(){
      Facade = iai('plugins/model/core/Facade.js');
    })
    it( 'should have the following api', function(){
      test.methods( Facade(), 'find', 'findOne', 'create', 'update', 'destroy' );
    })
  })

  describe( 'Schema', function(){})
  describe( 'Field', function(){})
})
