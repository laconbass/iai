var oop = require('iai-oop');
var Ap = Array.prototype;
var CustomError = require('./CustomError');

throw new Error('this file has not been rewritten so will fail');

/**
 * @builder ErrorList: An Error instance that wraps some Error instances.
 *
 * ErrorList instances are array-like objects and implement some of
 * the Array.prototype functionalities.
 *
 * [see also](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Methods)
 */

// ErrorList inherits CustomError
module.exports = Object.create( CustomError );

module.exports.constructor = ErrorList;
module.exports.constructor.prototype = module.exports;

function ErrorList( prototype ){
  prototype = prototype || CustomError;
  if( Error.isPrototypeOf(prototype) ){
    throw new TypeError('expecting an error prototype');
  } else {
    builder = this.builder;
  }
  var instance = CustomError.call(this, this.message);
  oop( builder.call(this, this.message) )
    .visible('builder', builder)
    //.visible('name', builder.prototype.name+this.name)
    .set('length', 0)
    .o
  ;
}

, Parent.prototype, {
  name: 'ErrorList',
  builder: Parent,
  message: 'There are some errors.',
  // Adds one error to the end of the list and returns the list.
  push: function( error ){
    if( !(error instanceof this.builder) ){
      throw new TypeError( this.name+' can only contain '
                          +this.builder.prototype.name+' instances' );
    }
    Ap.push.call( this, error );
    return this;
  },
  // Removes the last error from the list and returns that error.
  pop: function(){
    return Ap.pop.call(this);
  },
  // Removes the first error from the list and returns that error.
  shift: function(){
    return Ap.shift.call(this);
  },
  // Adds one error to the front of the list and returns the new length.
  unshift: function(){
    return Ap.unshift.call(this);
  },
  // Joins all errors of the list into a string.
  join: function(){
    return Ap.join.apply(this, arguments)
  },
  // Returns an array with the results of calling a provided function
  // on every error in the list.
  map: function(){
    return Ap.map.apply(this, arguments);
  },
  each: function(){
    Ap.forEach.apply(this, arguments);
    return this;
  },
  // Returns an array consisting of the errors on the list.
  toArray: function(){
    return Ap.slice.call(this, 0);
  },
  // Returns an string representation of the list.
  toString: function(){
    return this.name
      + ' <' + this.builder.prototype.name + '>'
      + ' (' + (this.length||'empty') + ')'
      + ' [' + this.map(function(e){ return e+''; }).join(', ') + ']'
    ;
  }
});
