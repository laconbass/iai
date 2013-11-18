var oop = require('iai-oop')
  , Parent = require( '../core/Connection' )
;

var exports = module.exports = oop.builder(function(){
  return Object.create(this);
}, Parent.prototype, {
  toString: function(){
    return "[object DummyConnection]";
  }
})

exports.version = "0";
exports.stability = 1;
