var express = require('express')
  , iai = require('iai')
  , ShellServer = iai('modules/shell/BaseServer')
;

var app = express()
      .get('/', function(req, res){
        res.sendfile( __dirname+'/index.html' );
      })
      .get('/WebShellClient.js', ShellServer.static )
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server, {
    'log level': 2,
    'trusted addresses': [ '192.168.1.57' ]
  })
;




/*var Readable = require('stream').Duplex
  , util = require('util');
;

util.inherits(STDIN, Readable);

function STDIN(opt) {
  Duplex.call(this, opt);
}

Counter.prototype._read = function( size ){
  console.log( "read Counter", size );
};
*/






var child_process = require('child_process')
  , exec = child_process.exec
  , spawn = child_process.spawn
 // , PassThrough = require('stream').PassThrough
;


var root = ShellServer( io );

var bash = ShellServer( io, '/bash' );

var child = spawn( 'node', [] );

child.stdout.on('data', function (data) {
  bash.broadcast( "log", 'child stdout: ' + data);
  console.log('child stdout: ' + data);
});

child.stderr.on('data', function (data) {
  bash.broadcast( "log", 'child stderr: ' + data);
  console.log('child stderr: ' + data);
});

child
  .on('close', function( code ){
    bash.broadcast( "log", 'child closed with code', code);
    console.log('child closed with code', code);
  })
  .on('exit', function( code ){
    bash.broadcast( "log", 'child exited with code', code);
    console.log('child exited with code', code);
  })
;


bash.on('execute', function(cmd, callback){
  /*exec(cmd, function(err, stdout, stderr){
    if(err) {
      return callback(err);
    }
    callback( null, stdout );
  })*/
  //child.stdout.on('data', callback.bind(null, null) )
  //child.stderr.on('data', callback.bind(null) )
  child.stdin.write(cmd);

  callback(null, "pepe");
  root.broadcast( "log", "a '/bash' client has executed", cmd);
})

server.listen(8080);
