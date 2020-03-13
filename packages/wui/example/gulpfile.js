
/*
 * Dependencies for all tasks
 */
const gulp = require('gulp')
const Log = require('@iaigz/core-log')
const log = new Log()
log.level = log.VERB


/*
 * DEPENDENCIES for browserify/watchify bundling
 */

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const sourcemaps = require('gulp-sourcemaps')
const browserify = require('browserify')
const watchify = require('watchify')

// setups a pipeline for a given browserify/watchify object
function bundler (b) {
  // b.plugin('factor-bundle', {
  //   outputs: ['bundle/x', 'bundle/y']
  // })
  // save built files to this directory
  let destination = '.'
  return b.bundle()
    // catch out browserify/watchify errors
    .on('error', err => log.fatal(1, err.stack))
    // build name here avoids renaming downstream
    .pipe(source('bundle.js')) // convert to a vinyl-source-stream
    .pipe(buffer()) // buffer is needed by gulp-sourcemaps
    // load maps from browserify bundle TODO may using exorcist be simpler?
    .pipe(sourcemaps.init({ loadMaps: true }))
    // write .map file
    .pipe(sourcemaps.write(destination))
    // write bundle
    .pipe(gulp.dest(destination))
}

bundler.options = {
  // TODO here magic should happen => MAGIC SEEMS BAD IDEA
  entries: ['./browser'],
  debug: true, // enable sourcemaps
  noParse: ['jquery'] // faster parsing for jquery
}

/*
 * DEPENDENCIES for build task
 */


exports.build = function () {
  return bundler(browserify(bundler.options))
}

exports.default = exports.build

// this should be the same as browserify task, but with watchify
// TODO actually error handling is not working as it should
exports.watchify = function () {
  var opts = { ...bundler.options, ...watchify.args }
  const b = watchify(browserify(opts))
    // log watchify messages
    .on('log', msg => log.info('watchify:', msg))
    // catch out watchify uptates to re-bundle
    .on('update', () => log.warn('re-bundling...') + bundler(b))

  return bundler(b).on('finish', function () {
    log.info('watchify bundler will re-bundle on updates')
    Log.bindings.ignoreSIGINT()
    log.warn('Use Ctrl+C to stop watchify')
    process.once('SIGINT', () => {
      log.warn('stoping watchify...')
      b.close()
    })
  })
}




















//exports.serve = require('./task/server.js')
//exports.watchify = require('./task/watchify.js')

//exports.watch = gulp.parallel(exports.watchify, exports.serve)

//exports.default = exports.watch

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
