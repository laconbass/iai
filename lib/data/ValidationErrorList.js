var oop = require('iai-oop')
  , iai = require('iai')
  , ValidationError = require('./ValidationError')
  , Parent = iai('core/BaseErrorList')
;

module.exports = oop.builder(function(){
  return Parent.call(this, ValidationError);
}, Parent.prototype)

module.exports.version = "2";
module.exports.stability = 1;
