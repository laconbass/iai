/**
 * @function is: create a type validator for given type.
 *   @param type [String]: "Function", "Object", "Array", "RegExp", "Date", ...
 *
 * this validators are based on Object.prototype.toString type checking.
 */

var exports = module.exports = is;

exports.version = "1";
exports.stability = 2;

function is( type ){
  // TODO switch case to avoid wasting memory on common is* functions
  return function( o ){
    return Object.prototype.toString.call(o) == "[object " + type + "]";
  };
}

// TODO isFunction, isObject, isArray, etc; to avoid memory wasting
