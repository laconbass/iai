var oop = require('iai-oop')
  , iai = require( '../../../..')
;

module.exports = oop.builder(function(opts){
  opts = opts || {};
  opts.system = opts.system || 'undefined';
  try {
    var path = opts.system.toLowerCase()+'/'+opts.system+'Connection'
    return iai('plugins/model/'+path)(opts);
  } catch(err) {
    if( !/cannot find module/i.test(err.message) ){
      throw err;
    }
    throw Error( "Unsupported database management system: "+opts.system );
  }
}, {
  open: function(){
    throw Error( this + "should define a open method" );
  },
  close: function(){
    throw Error( this + "should define a close method" );
  },
  toString: function(){
    return "[object Connection]";
  }
});
