const assert = require('assert')
const { basename, relative } = require('path')
const spawn = require('child_process').spawn

const oop = require('iai-oop')
const Log = require('@iaigz/core-log')
const log = new Log()
log.level = log.VERB

/**
 * @builder Service: builds a wrap to run a child_process spawned process
 */
const parent = require('@iaigz/abc-events')

let prototype = Object.create(parent.prototype)
let constructor = function Service (cmd, argv, opts) {
  assert(this instanceof constructor, 'use the new keyword')
  parent.call(this)

  argv = argv || []
  opts = opts || {}

  oop(this)
    .internal('cp', null)
    .internal('cmd', cmd)
    .internal('argv', Array.isArray(argv) ? argv : [argv])
    .internal('stdio', opts.stdio || 'inherit')
    .internal('stdin', opts.stdin || null)

  process.on('beforeExit', (code) => {
    if (this.cp === null) return
    log.error('%s is still running before exit %s!', this, code)
    this.stop()
  })
  process.on('exit', (code) => {
    if (this.cp === null) return
    log.error('%s is still running on exit %s! killing...', this, code)
    this.cp.kill()
  })
  // when this process exits or receives the following signals,
  // ensure child process has already exited, or stop/kill it
  process.on('SIGINT', () => {
    if (this.cp === null) return
    log.warn('%s should receive SIGINT through inherited stdin', this)
    // TODO should only apply above to stdin is 'inherit' or 'pipe'?
    // log.warn('caught SIGINT, will stop %s...', this)
    // this.stop('SIGINT')
  })
  process.on('SIGUSR2', () => {
    if (this.cp === null) return
    log.warn('caught SIGSUSR2, will stop %s ...', this)
    this.stop('SIGUSR2')
  })

  return this
}

prototype.toString = function () {
  return this.cp
    ? (basename(this.cmd) + '@' + this.cp.pid)
    : ('Job#' + basename(this.cmd))
}

function trunc (str, n, dots) {
  dots = dots || '...'
  return str.length > n ? str.substr(0, n - dots.length) + dots : str
}

prototype.start = function start () {
  if (this.cp) return this.restart()

  log.warn('%s %s spawning now...', this, trunc(this.argv.join(' '), 16))
  log.verb('> %s %s', this.cmd, this.argv.join(' '))

  this.cp = spawn(this.cmd, this.argv, { stdio: this.stdio })
    .on('close', (code, signal) => {
      log[code || signal ? 'error' : 'info'](
        '%s closed with code %s and signal %s', this, code, signal
      ) // when code is 0 and there is no signal, this is just informational
      this.emit('close', code, signal)
    })
    .on('exit', (code, signal) => {
      log[code || signal ? 'error' : 'info'](
        '%s exited with code %s and signal %s', this, code, signal
      ) // when code is 0 and there is no signal, this is just informational
      this.cp = null
      this.emit('exit', code, signal)
    })
    .on('error', (err) => {
      log.error('%s child process error', this, err.message)
      log.error(err.stack)
    })

  if (this.stdio === 'pipe') {
    // TODO pipe into log api?
    var writer = (stream, foo) => {
      var bol = true // begin of line
      var format = (msg) => iai.f('%s%s %s', this, foo, msg || '')
      return (data) => {
        data = data.toString('utf8')
        var lines = data.split('\n')
        // 1 line means no newline character found
        if (lines.length < 2) {
          stream.write(bol ? format(data) : data)
        } else {
          data = lines.map(
            (line, i) => (
              (i < 1 && !bol) || (i === lines.length - 1 && line === '')
            ) ? line
              : format(line)
          ).join('\n')
          stream.write(data)
        }
        // it's begin of line when last character is a newline char
        bol = data[data.length - 1] === '\n'
      }
    }
    log.info('> will display child process outputs on this process outputs')
    this.cp.stdout.on('data', writer(process.stdout, '|'))
    this.cp.stderr.on('data', writer(process.stderr, '#'))
    if (this.stdin) {
      var unpipe = (why) => log.info("%s's stdin %s, unpiped input", this, why)
      log.warn('> will pipe given stdin stream to child process stdin')
      var pid = this.cp.pid
      this.stdin
        .pipe(this.cp.stdin)
        .on('close', () => unpipe('has closed pid=' + pid))
        .on('error', (err) => {
          if (err.code === 'ECONNRESET') return unpipe('disconnected')
          log.error('%s stdin pipe error %s', this, err.stack)
          throw err
        })
    }
  }
  return this
}

prototype.stop = function stop (signal, callback) {
  signal = signal || 'SIGUSR2'
  let signals = [signal, 'SIGTERM']

  let attempt = () => {
    var t = 2 + signals.length // seconds
    signal = signals.shift()
    log.info('stopping %s with %s (timeout in %ss)...', this, signal, t)
    var timeout = setTimeout(() => {
      log.error('%s did not handle %s after %ss', this, signal, t)
      timeout = null
      if (signals.length) return attempt()
      throw new Error('could not kill child process')
    }, t * 1000)
    this.cp.once('exit', () => {
      if (timeout) {
        clearTimeout(timeout)
        log.verb('> %s handled %s after %sms', this, signal, Date.now() - init)
        typeof callback === 'function' && process.nextTick(callback)
        return
      }
      throw new Error('what the fuck happened here?')
    })
    var init = Date.now()
    this.cp.kill(signal)
  }
  attempt()
  // TODO if child process does not handle SIGUSR2 and exit? => timeout
  return this
}

prototype.restart = function restart () {
  if (!this.cp) {
    log.warn('%s is stoped but is going to start...', this)
    return this.start()
  }
  log.verb('stopping %s to restart...', this)
  return this.stop('SIGUSR2', () => {
    log.verb('> restarting %s...', this)
    this.start()
  })
}

module.exports = constructor
prototype.constructor = constructor
module.exports.prototype = prototype

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
