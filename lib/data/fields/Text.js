var oop = require('iai-oop')
  , iai = require('iai')
  , Parent = iai('data/Field')
;

/**
 * @builder TextField
 */

module.exports = oop.builder(function(){
  return Parent.call(this)
}, Parent.prototype, {
});

module.exports.version = "1";
module.exports.stability = 2;
