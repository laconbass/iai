var view = require( './view' );

var exports = module.exports = boot;

function boot(){
  return process.stdin
    .pipe( view('home') )
    .pipe( process.stdout )
  ;
}

