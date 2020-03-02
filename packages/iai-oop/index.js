//
// hardcoded utilities to avoid depending on the whole iai-is module

function isFn( o ){
  return Object.prototype.toString.call(o) == "[object Function]";
}
function isObject( o ){
  return Object.prototype.toString.call(o) == "[object Object]";
}

//
// Export the standard OOP API constructor bound to itself
// The OOPAPi function is the constructor and the prototype

var exports = module.exports = OOPAPI.bind( OOPAPI );

exports.constructor = OOPAPI;
exports.constructor.prototype = OOPAPI;

/**
 * @function create: creates a new object with the specified prototype
 * and returns a new standard oop api with the new object staged.
 *   @param prototype [object]: the object to be used as prototype
 *
 * This is a shortcut for `oop( Object.create(prototype) )`
 *
 * As aditional reference, see on the ECMA 5.1 spec...
 * - [Object.create alghoritm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.3.5)
 * - ["prototype" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.5)
 */

exports.create = function( prototype ){
  return exports( Object.create(prototype) );
};

/**
 * @function build: Asserts that `context` is `prototype`, or inherits from
 * it, and returns a new object with the specified `context` as prototype.
 */

exports.build = function( prototype, context ){
  // TODO decide if assert( arguments.length == 2 );
  if( context === global ){
    context = prototype;
  }
  else if( prototype !== context && ! prototype.isPrototypeOf(context) ){
    var error = new Error('expected context to inherit prototype');
    error.code = 'OOP_BUILD_CONTEXT';
    throw error;
  } else if( prototype !== context ){
    return context;
  }
  return Object.create( context );
};

/**
 * @function extend: shortcut for `oop(subject).extend(overrides).o`
 */

exports.extend = function( subject, overrides ){
  return exports( subject ).extend( overrides ).o;
};

/**
 * @builder OOPAPI: provides the standard oop api
 *
 * The standard oop api is designed to provide a chainable way for defining
 * object properties and its atributes. On creation, an object is put on stage,
 * and each api call will perform its action over the staged object. The staged
 * object is accesible through the "o" property of the api instance.
 */

function OOPAPI(o){
  // TODO OOPAPI.isPrototypeOf(this)?
  var instance = Object.create(this);
  instance.o = o;
  return instance;
}

/**
 * @function set: defines a enumerable, writable, configurable, data descriptor
 * on the staged object.
 *   @param pname [String]: the property name
 *   @param value [String]: the property value
 *
 * see ECMA 5.1 spec ["DefineOwnProperty" algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.9)
 */

OOPAPI.set = function( pname, value ){
  this.o[pname] = value;
  return this;
};

/** @function hidden: defines a non-enumerable, non-writable data descriptor
 * on the staged object.
 *   @param pname [String]: the property name
 *   @param value [String]: the property value
 */

OOPAPI.hidden = function( pname, value ){
  Object.defineProperty( this.o, pname, { value: value } );
  return this;
};

/** @function internal: defines a non-enumerable, writable data descriptor
 * on the staged object.
 *   @param pname [String]: the property name
 *   @param value [String]: the property value
 */

OOPAPI.internal = function( pname, value ){
  Object.defineProperty( this.o, pname, { value: value, writable: true } );
  return this;
};

/**
 * @function visible: defines a enumerable, non-writable data descriptor on
 * the staged object.
 *   @param pname [String]: the property name
 *   @param value [String]: the property value
 */

OOPAPI.visible = function( pname, value ){
  Object.defineProperty( this.o, pname, { value: value, enumerable: true } );
  return this;
};

/**
 * @function accesor: defines a enumerable, non-configurable accesor descriptor
 * on the staged object.
 *   @param pname [String]: the property name
 *   @param value [String]: the default property value
 *   @param getter [Function|string]: the getter function
 *   @param setter [Function]: the setter function
 *
 * see ECMA 5.1 spec ["DefineOwnProperty" algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.9)
 */

OOPAPI.accessor = function( pname, getter, setter ){
  Object.defineProperty( this.o, pname, {
    enumerable: true, get: getter, set: setter
  })
  return this;
};

/**
 * @function provider defines a non-enumerable, non-configurable accesor descriptor
 * on the staged object.
 *   @param pname [String]: the property name
 *   @param value [String]: the default property value
 *   @param getter [Function|undefined]: the getter function
 *   @param setter [Function|undefined]: the setter function
 *
 * see ECMA 5.1 spec ["DefineOwnProperty" algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.9)
 */

OOPAPI.provider = function( pname, getter, setter ){
  Object.defineProperty( this.o, pname, {
    enumerable: false, get: getter, set: setter
  })
  return this;
};

// TODO describe it
OOPAPI.lazyLoad = function( pname, loader, args ){
  args = args || [];
  args = Array.isArray(args)? args : [args];
  var cache;
  return this.accessor( pname, function lazyLoader(){
    return cache ||(  cache = loader.apply(loader, args)  );
  });
};
OOPAPI.lazyload = OOPAPI.lazyLoad;

/**
 * @function flag defines a non-enumerable, non-configurable accesor descriptor
 * on the staged object.
 *   @param pname [String]: the property name
 *   @param value [String]: the default property value
 *   @param getter [Function|undefined]: the getter function
 *   @param setter [Function|undefined]: the setter function
 *
 * see ECMA 5.1 spec ["DefineOwnProperty" algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.9)
 */

OOPAPI.flag = function( pname, defaulting, mode ){
  defaulting = !!defaulting;
  this[ mode || 'accessor' ]( pname, function get(){
    return defaulting;
  }, function set( value ){
    // TODO benchmark
    // use 'defaulting' and '!defaulting' instead true and false
    if( value !== true && value !== false ){
      throw new TypeError( pname + ' must be set to a boolean' );
    }
    defaulting = value;
  });
  return this;
};

/**
 * @function extend: defines through direct assign as many properties as the own
 * enumerable properties of the given object, on the staged object.
 *
 * As aditional reference, see on the ECMA 5.1 spec...
 * - ["property" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.23)
 * - ["own property" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.30)
 * - ["attribute" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.29)
 * - [property attributes](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6.1)
 * - [Object.prototype.hasOwnProperty algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.4.5)
 */
OOPAPI.extend = function( object ){
  if( !isObject( object ) ){
    throw TypeError( "Expecting extension object to be an Object" );
  }
  for( var property in object ){
    if( object.hasOwnProperty(property) ){
      this.o[property] = object[property]; // should i use this.set here???
    }
  }
  return this;
};

/**
 * @function delegate: delegate on object the methods named from argument 2 onwards.
 * For each argument from 2 onwards, defines an enumerable, non-writable, data
 * descriptor on the staged object whose value will be a function. Each new method is
 * a decorator that applies to the `object`'s method whose name is the same and
 * returns the current context.
 */
OOPAPI.delegate = function( object, method1, methodN ){
  var methods = Array.prototype.slice.call( arguments, 1 );
  methods.forEach(function( name ){
    this.visible( name, use( object, name ) )
  }, this )
  return this;
};

// DRY helper. creates a method delegator (internal use)
function use( object, method ){
  if( !isFn(object[ method ]) ) {
    throw Error( "object does not have a method named " + method );
  }
  return function delegator(){
    object[ method ].apply( object, arguments );
    return this;
  };
}

/**
 * Descriptive toString method to ease debugging
 */

OOPAPI.toString = function(){
  return "[OOPAPI <"+this.o+">]";
};

