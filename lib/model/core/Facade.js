var oop = require('iai-oop')
  , Connection = require('./Connection')
  , DAO = require('./DAO')
;

var exports = module.exports = oop.builder(function(opts){
  return oop.create(this)
    .visible( 'connection', Connection(opts) )
    .visible( 'dao', DAO(opts) )
    .o
  ;
}, {
  find: function(){
    throw "Facade is a convenience super-prototype";
  },
  findOne: function(){
    throw "Facade is a convenience super-prototype";
  },
  create: function(){
    throw "Facade is a convenience super-prototype";
  },
  update: function(){
    throw "Facade is a convenience super-prototype";
  },
  destroy: function(){
    throw "Facade is a convenience super-prototype";
  }
});

exports.version = "0";
exports.stability = 1;
