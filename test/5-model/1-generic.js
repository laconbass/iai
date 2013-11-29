var assert = require('chai').assert
  , iai = require('../..')
  , test = iai('test')
  , testOpts = { system: 'Dummy' }
  , Connection = iai('model/core/Connection')
  , DAO = iai('model/core/DAO')
  , Facade = iai('model/core/Facade')
  , Field = iai('model/core/Field')
  , Schema = iai('model/core/Schema')
;

describe( 'generic model interface', function(){
  describe( 'Connection', function(){
    it( 'should be a builder', function(){
      test.builder( Connection )
    })
    it( 'should have the following chainable api', function(){
      console.log();
      test.chainableApi( Connection(), {
        'open': [],
        'close': []
      });
    })
  })
  describe( 'DAO', function(){
    it( 'should be a builder', function(){
      test.builder( DAO, [testOpts] )
    })
    it( 'should have the following chainable api', function(){
      console.log();
      test.chainableApi( DAO(), {
        'create': [],
        'retrieve': [],
        'update': [],
        'destroy': []
      });
    })
  })
  describe( 'Facade', function(){
    it( 'should be a builder', function(){
      test.builder( Facade, [testOpts] )
    })
    it( 'should have the following chainable api', function(){
      test.chainableApi( Facade(testOpts), {
        'find': [],
        'findOne': [],
        'create': [], // findOrCreate?
        'update': [],
        'destroy': []
      });
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

  describe( 'Field', function(){
    it( 'should be a builder', function(){
      test.builder( Field, [] );
    })
    it( 'should have the following methods', function(){
      test.methods( Field(), "validate", "clean" )
    })
  })

  describe( 'Schema', function(){
    before(function(){

    })
    it( 'should be a builder', function(){
      test.builder( Schema, [] );
    })
    it( 'should have the following chainable api', function(){
      test.chainableApi( Schema(), {
        'field': [ 'some_name', Field() ], // composite 'add'
        'fields': [ {} ], // multiple composite 'add'
      })
    })
    it( 'should validate as expected', function(){
      var schema = Schema()
        .name( 'testing-schema' )
        .description( 'this schema is meant for testing' )
        .fields({
          id: Field({ unique: true }),
          name: Field.Text({ required: true, max_length: 30 }),
          email: Field.Email({ required: true }),
          password: Field.Text({ encrypt: "sha1" })
        })
      ;
      schema.validate( {} );
    })
  })
})
