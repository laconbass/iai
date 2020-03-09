const Log = require('./log')

// this loading strategy is meant to support old iai-abc log facility
// so load global event bindings and fixes here
const globals = require('./process')

module.exports = function newLog() {
  return Log.constructor(newLog)
}
