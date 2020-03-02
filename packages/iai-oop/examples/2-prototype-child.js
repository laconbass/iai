/**
 * For creating "child" prototypes, vanilla javascript is enought descriptive
 * and not verbose. It doesn't make sense to use a helper function here.
 */

var Parent = require( "./1-prototype" );

var MyPrototype = module.exports = Object.create( Parent );

MyPrototype.doThree = function(){
  return "doThree from MyExtendedPrototype";
};

MyPrototype.doTwo = function(){
  return "doTwo from MyExtendedPrototype\n"
       + "parent says: " + Parent.doTwo.call(this);
};
