
/**
 * Strongly inspired by [django's core validators](https://github.com/django/django/blob/master/django/core/validators.py)
 */

function BaseValidator(){
  var validator = Object.create(this);
  return function(value){

  }
}

function MaxValueValidator(){
  BaseValidator.call(this)
}

//exports.slug = RegexpValidator( /^[-a-zA-Z0-9_]+$/, "Enter a valid 'slug' consisting of letters, numbers, underscores or hyphens." )
