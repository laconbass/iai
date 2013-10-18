var oop = require( 'iai-oop' )
;

var exports = module.exports = oop.builder(function Application(){
  return Object.create(this);
},{
});
exports.version = "0";
exports.stability = 1;
