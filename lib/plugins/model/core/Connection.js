var oop = require('iai-oop');

module.exports = oop.builder(function(){
  console.log()
  return Object.create(this);
}, {
  open: function(){
    throw "Connection is a convenience super-prototype";
  },
  close: function(){
    throw "Connection is a convenience super-prototype";
  },
  toString: function(){
    return "[object Connection]";
  }
});
