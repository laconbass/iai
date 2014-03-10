var debug = require('debug')('iai:core/conf')
  , is = require('iai-is')
;

/**
 * @builder Conf: Represents a configuration hash
 *
 */

var exports = module.exports = Conf;

function Conf( key ){
  return key? Conf.get(key) : Conf;
}

// stores all the configuration values
var values = {};
// stores all the configuration default values
var defaults = {};
// stores all the validators
var validators = {};

// asserts a Conf key is registered
function exists( key ){
  if( ! Conf.types.fn(validators[key]) ){
    throw ReferenceError('conf key ('+key+') is not registered');
  }
}

/**
 * @function register: Adds a new key-value pair to the configuration.
 *   @param key (String): string to identify the conf value.
 *   @param defaultValue (Mixed): default value to supply for this conf key.
 *   @param validator (Function): function returning true whatever given value
 *                                is valid for this conf key.
 */
Conf.register = function( key, defaultValue, validator ){
  if( typeof validator !== 'function' ){
    throw TypeError('each configuration key must have a validator function')
  }

  try {
    exists( key );
    throw ReferenceError('conf key ('+key+') already registered')
  } catch( err ){}

  if( ! validator(defaultValue) ){
    throw TypeError('defaultValue must pass validator function');
  }

  values[key] = defaults[key] = defaultValue;
  validators[key] = validator;

  return Conf;
};


Conf.get = function( key ){
  exists(key);
  return values[key];
};

Conf.set = function( key, value ){
  exists(key);

  if( ! validators[key](value) ){
    throw TypeError('value for conf key ('+key+') must satisfy validator')
  }

  values[key] = value;

  return Conf;
};

Conf.isSet = function( key ){
  exists(key);

  return values[key] !== defaults[key];
}

Conf.reset = function( key ){
  exists(key);

  values[key] = defaults[key];

  return Conf;
}

Conf.enable = function( key, value ){
  exists(key);

  if( validators[key] !== Conf.types.bool ){
    throw TypeError('only boolean values can be enabled or disabled')
  }

  values[key] = true

  return Conf;
};

Conf.disable = function( key, value ){
  exists(key);

  if( validators[key] !== Conf.types.bool ){
    throw TypeError('only boolean values can be enabled or disabled')
  }

  values[key] = false;

  return Conf;
}

/**
 * # Common config types (validators)
 */

Conf.types = {};

Conf.types.bool = function( val ){
  return val === true || val === false;
};

Conf.types.str = function( val ){
  return typeof val === 'string';
};

Conf.types.fn = function( val ){
  return typeof val === 'function';
};

exports.version = '1';
exports.stability = 1;
