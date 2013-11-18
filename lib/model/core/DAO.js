var oop = require('iai-oop')
  , requireDbBuilder = require( './requireDbBuilder' )
;

var exports = module.exports = oop.builder(function(opts){
  opts = opts || {};
  return requireDbBuilder( opts.system, 'DAO' )(opts);
}, {
  create: function( connection, vo, callback ){
    throw Error( this + "should define a 'create' method" );
  },
  retrieve: function( connection, id, callback ){
    throw Error( this + "should define a 'retrieve' method" );
  },
  update: function( connection, id, vo, callback ){
    throw Error( this + "should define a 'update' method" );
  },
  destroy: function( connection, id, callback ){
    throw Error( this + "should define a 'destroy' method" );
  }
});

exports.version = "0";
exports.stability = 1;
