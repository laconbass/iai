var oop = require('iai-oop')
  , iai = require( '../../../..')
;

module.exports = oop.builder(function(opts){
  opts = opts || {};
  opts.system = opts.system || 'undefined';
  try {
    var path = opts.system.toLowerCase()+'/'+opts.system+'DAO'
    return iai('plugins/model/'+path)(opts);
  } catch(err) {
    if( !/cannot find module/i.test(err.message) ){
      throw err;
    }
    throw Error( "Unsupported database management system: "+opts.system );
  }
}, {
  create: function(){
    throw "DAO is a convenience super-prototype";
  },
  retrieve: function(){
    throw "DAO is a convenience super-prototype";
  },
  update: function(){
    throw "DAO is a convenience super-prototype";
  },
  destroy: function(){
    throw "DAO is a convenience super-prototype";
  }
});
