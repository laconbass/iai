var oop = require('iai-oop')
  , requireDbBuilder = require( './requireDbBuilder' )
;

var exports = module.exports = oop.builder(function(opts){
  opts = opts || {};
  return requireDbBuilder( opts.system, 'Connection' )(opts);
}, {
  open: function(){
    throw Error( this + "should define a 'open' method" );
  },
  close: function(){
    throw Error( this + "should define a 'close' method" );
  },
  toString: function(){
    return "[object Connection]";
  }
});

exports.version = "0";
exports.stability = 1;
