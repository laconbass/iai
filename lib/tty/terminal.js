var format = require('util').format
  , ansi = require('./ansi')
;

//
// chainable api to control writable streams as ANSI ttys

module.exports = terminal;

var streams = [];
var instances = [];

function terminal( stream ){
/*  if ( !stream.isTTY ){
    throw Error("terminal' stream should be a TTY");
  }
  if( !!~streams.indexOf(stream) ){
    console.log( "stream in streams!!" )
    process.exit();
  }*/
  var instance = Object.create(terminal.prototype);
  instance.out = stream;
  instance._ps3 = '';
  return instance;
}

terminal.ansi = ansi;

terminal.prototype = {
  out: null,
  ps3: function( str ){
    str = format.apply( format, arguments );
    this._ps3 = str || '';
    return this;
  },
  raw: function( str ){
    this.out.write.apply( this.out, arguments );
    return this;
  },
  log: function( ){
    var str = format.apply( format, arguments )
      .replace( /\n/mg, '\n' + this._ps3 );
    this.raw( this._ps3 + str );
    this.out.write( '\n', 'utf8' )
    return this;
  },
  clear: function( ){
    debugger;
    return this
      .raw( ansi.clear )
      .raw( format(ansi.moveTo, 1, 1) )
    ;
  },
  clearEnd: function( ){
    return this.raw( ansi.clearEnd );
  },
  save: function( ){
    return this.raw( ansi.save );
  },
  restore: function ( ){
    return this.raw( ansi.restore );
  }
}
