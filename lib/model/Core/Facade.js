var oop = require('iai-oop');

module.exports = oop.builder(function(){
  return Object.create(this);
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
