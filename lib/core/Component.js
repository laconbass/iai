var is = require( 'iai-is' )
  , oop = require( 'iai-oop' )
  , iai = require( '../..' )
  , path = require( 'path' )
  , resolve = path.resolve
  , dirname = path.dirname
  , Parent = iai( 'async/Notifier' )
;

var exports = module.exports = oop.builder(function(module){
  if( !is.Module(module) ){
    throw TypeError( "Application components must reference a module" )
  }
  return oop( Parent.call(this) )
    .visible( 'resolve', function(path){
      return resolve( dirname(module.filename), path )
    })
    .o
  ;
}, Parent.prototype, {
  toString: function(){
    return "[object ApplicationComponent]";
  }
});

exports.version = "0";
exports.stability = 1;
