var resolve = require('path').resolve;
var fs = require('fs');
var iai = require('iai');

/**
 * touches a file.
 *
 * The file is created if it does not exist, left not modified it it exists.
 */

exports.touch = function( ref ){
  ref = resolve( ref );
  var io = iai.flow();
  fs.createWriteStream( ref, { flags: 'a+' })
    .on('open', function( fd ){
      fs.close( fd, io.end.bind(io) );
    })
    // on error?
  ;
  return io;
}
