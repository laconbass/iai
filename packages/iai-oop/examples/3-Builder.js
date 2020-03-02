var oop = require( '../' );

/**
 * For defining "constructors" for prototypes, vanilla javascript is enought
 * descriptive and not verbose. It doesn't make sense to use a helper function
 * for defining them:
 *
 * - Use the function hoisting to demonstrate at first what is exported here
 * - Explicitly export the prototype to keep inheritance chain visible on top
 * - Set the prototype's `constructor` property (for instanceof checks)
 *
 * Set the prototype's constructor ONLY HERE:
 * - When inheriting (with Object.create), to avoid circular dependencies
 * - When starting over (`exports.prototype = {}`), it expresses crystal clear
 *
 * DO NOT Set the prototype's constructor property HERE:
 * - When not inheriting (no `Object.create`), to avoid circular dependencies.
 *
 * Prefer inheriting so construction process is decoupled from the prototype.
 */

var exports = module.exports = MyConstructor;

exports.prototype = Object.create(  require('./1-prototype.js')  );
exports.prototype.constructor = exports;

/**
 * My constructor could be applied within a variety of contexts:
 * `MyConstructor()`, `new MyConstructor()`, `MyConstructor.apply( whatever )`,
 * `MyPrototype.constructor()`...
 *
 * Use the `oop.build` utility to avoid the verbosity generated when we want
 * to support multiple contexts and call styles. Use the `instance` word.
 *
 * Always return `instance`. Do not return on a chainable-fashion style, as it 
 * will easily lead to misstypes, even when they are one-liners. Exceptions to
 * this rule may apply when the code is battle-tested and it looks way better,
 * avoiding verbosity: `return oop(instance).visible('foo', 'bar').o`);`.
 *
 * Use the oop description api (aka. OOP Standard API) to avoid verbosity when
 * defining property descriptors, Use vanilla js for simple initializations.
 */
function MyConstructor(){
  // get the instance (create it or return `this` if it should be used instead)
  var instance = oop.build( MyConstructor.prototype, this );

  // initialize the instance...
  instance.foo = 'bar';
  instance.baz = 'etc';

  return instance;
}

// Static properties, if there are any, are defined now.
MyConstructor.CONS_VAL = 1;
MyConstructor.CONS_KEY = 2;

MyConstructor.staticAction = function( ){
};

/**
 * Prototype could be defined hereafter instead being imported from other file.
 * Prefer importing specially on complex building processes
 *
 * When defining the prototype here, aliase it to avoid verbosity. This also
 * eases spliting or joining prototypes with construction processes.
 */
var MyPrototype = MyConstructor.prototype;

MyPrototype.SOME_ATTRIBUTE = "SOME VALUE";

