/**
 * Author: Lorenzo García Rivera
 * License: MIT
 */

var agnostic = require('./agnostic')

// the iai object for backend inherits everything from iai agnostic object
var iai = module.exports = Object.create(agnostic)

//
// This file is the main entry point for backend api
// Define here only the namespace aliases or accessors
//

// there is no need to use the oop api to override things as needed

// override path.__dirname so paths resolve as they should
iai.path.__dirname = __dirname
// override the iai-abc toString data descriptor
iai.toString = function () { return '|iai|' }

// will use iai-oop api to expose the augmented api
var exports = iai.oop(iai)

// read and readkeys are related to the node stream api
exports.lazyload('read', require, './read')
exports.lazyload('readkeys', require, './hardware/keyboard/readkeys')

// the gui api controls an electron process to manage the OS GUI
exports.lazyload('gui', require, './hardware/gui')

// Service is a server prototype with built-in WebSocket integration
exports.lazyload('Server', require, './server')
exports.lazyload('answer', require, './server/answer')
// TODO omg this dummy router should be an answer too? SURE
exports.lazyload('Router', require, './server/Router')

// View implementation
exports.lazyload('View', require, './view')
