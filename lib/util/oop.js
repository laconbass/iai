/**
 * oop utilities are functional tools to perform common tasks on OOP.
 * The filosofy is to type less while being more expressive.
 */

exports = module.exports = oop;

exports.version = '1';
exports.stability = 1;

function oop( o ) {
  return new Oop(o);
}

/**
 * @constructor Oop: provides the standard oop api
 *
 * The standard oop api is designed to provide a chainable way for defining
 * object properties and its atributes. On creation, an object is put on stage,
 * and each api call will perform its action over the staged object.
 */

function Oop( o ){
  this.o = o;
}

var OopStandardApi = Oop.prototype = {
  /** @function hidden: defines a non-enumerable, non-writable, data descriptor
   * on the staged object.
   *   @param pname [String]: the property name
   *   @param value [String]: the property value
   */
  hidden: function( pname, value ){
    Object.defineProperty( this.o, pname, { value: value } );
    return this;
  },
  /**
   * @function visible: defines a enumerable, non-writable, data descriptor on
   * the staged object.
   *   @param pname [String]: the property name
   *   @param value [String]: the property value
   */
  visible: function( pname, value ){
    Object.defineProperty( this.o, pname, { value: value, enumerable: true } );
    return this;
  },
  /**
   * @function set: defines a new property through direct assign on the staged
   * object.
   *   @param pname [String]: the property name
   *   @param value [String]: the property value
   *
   * see ECMA 5.1 spec ["DefineOwnProperty" algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.9)
   */
  set: function( pname, value ){
    this.o[pname] = value;
    return this;
  },
  /**
   * @function extend: defines on the staged object as many properties as the
   * own enumerable properties of the given object, through direct assign.
   *
   * As aditional reference, see on the ECMA 5.1 spec...
   * - ["property" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.23)
   * - ["own property" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.30)
   * - ["attribute" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.29)
   * - [property attributes](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6.1)
   * - [Object.prototype.hasOwnProperty algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.4.5)
   */
  extend: function( object ){
    if( !isObject( object ) ){
      throw TypeError( "Expecting extension object to be an Object" );
    }
    for( var property in object ){
      if( object.hasOwnProperty(property) ){
        this.o[property] = object[property]; // should i use this.set here???
      }
    }
    return this;
  },
  /**
   * @function delegate: delegate on object the methods named from argument 2 onwards.
   * For each argument from 2 onwards, defines an enumerable, non-writable, data
   * descriptor on the staged object whose value will be a function. Each new method is
   * a decorator that applies to the `object`'s method whose name is the same and
   * returns the current context.
   */
  delegate: function( object, method1, methodN ){
    var methods = Array.prototype.slice.call( arguments, 1 );
    methods.forEach(function( name ){
      this.visible( name, use( object, name ) )
    }, this )
    return this;
  }
};

var isObject = require( './is' )( 'Object' );

// DRY helper. creates a method delegator (internal use)
var isFn = require( './is' )( 'Function' );
function use( object, method ){
  if( !isFn(object[ method ]) ) {
    throw Error( "object does not have a method named " + method );
  }
  return function delegate(){
    object[ method ].apply( object, arguments );
    return this;
  };
}

/**
 * @function create: creates a new object with the specified prototype
 * and returns a new standard oop api with the new object staged.
 *   @param prototype [object]: the object to be used as prototype
 *
 * As aditional reference, see on the ECMA 5.1 spec...
 * - [Object.create alghoritm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.3.5)
 * - ["prototype" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.5)
 */

oop.create = function( prototype ){
  return oop( Object.create(prototype) );
}

/**
 * @function extend: creates a new object with the specified `prototype` and
 * defines on it as many properties as the own enumerable properties that the
 * `extension` object has.
 *   @param prototype [Object|null]: the object to be used as prototype
 *   @param extension [Object]: the object to be used as extension
 *
 * As aditional reference, see...
 * - oop.create reference
 * - OopStandardApi.extend reference
 */

oop.extend = function( prototype, extension ){
  return oop.create( prototype ).extend( extension ).o;
}

/**
 * @function object: define constructor's prototype. If extension is given,
 * use as prototype the result of extending prototype with extension.
 */

oop.object = function( constructor, prototype, extension ){
  if( extension ){
    prototype = oop.extend( prototype, extension );
  }
  return oop.define( constructor, prototype );
}

/**
 * @function oop.define: fixes instanceof checks
 *   @param contructor: the named function to be used as constructor
 *   @param prototype: the object to be used as prototype
 *   @returns: `prototype`
 *
 * given a `constructor` function, any object instance who has `prototype`
 * on its prototype chain will pass an `instanceof` check against it.
 * Ex:
 *     function foo(){
 *       return bar.create.apply( bar, arguments );
 *     }
 *     var bar = oop.define( foo, {
 *       create: function(){
 *         return Object.create( this );
 *       }
 *     })
 *
 *     assert( Object.create(bar) instanceof foo )
 *     assert( bar.create() instanceof foo )
 *     assert( foo() instanceof foo )
 *
 * This is because
 *     Object.getPrototypeOf( Object.create(bar) ) === foo.prototype
 *     Object.getPrototypeOf( bar.create() ) === foo.prototype
 *     Object.getPrototypeOf( foo() ) === foo.prototype
 *
 * see [`instanceof` reference on mozilla developer network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
 *
 * The define function also adds a descriptive `toString` method, if `prototype`
 * does not define one. This generic toString method will return:
 *     "[object" + constructor.name + "]"
 *
 */

var isNamedFn = function(o){
  return ('function' == typeof(o)) && !!o.name;
}

oop.define = function( constructor, prototype ) {
  if( !isNamedFn(constructor) ){
    throw TypeError( "constructor must be a named function");
  }
  if( !prototype.hasOwnProperty('toString') ) {
    prototype.toString = function(){
      return "[object "+constructor.name+"]";
    }
  }
  // fix instanceof checks
  return constructor.prototype = prototype;
};

/**
 * @function factory: shorcut to define a object factory
 *   @param constructor: the named function to be returned
 *   @param prototype: the prototype to be used
 *   @returns constructor
 *
 * This function does the same as oop.define, but returns the constructor.
 *
 * The following example:
 *     var foo = function MyFactory(){
 *       return Object.create( MyFactory.prototype );
 *     }
 *     oop.define( foo, {
 *       // My custom prototype
 *     })
 *
 * Does the same as the following code:
 *     var foo = oop.factory(function MyFactory(){
 *       return Object.create( MyFactory.prototype );
 *     }, {
 *        // My custom prototype
 *     })
 */

oop.factory = function( constructor, prototype ){
  oop.define( constructor, prototype );
  return constructor;
}
