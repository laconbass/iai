const { resolve, dirname } = require('path')

/**
 * @function packdata: Researches the package information that $CWD belongs to
 * @param path (Optional): The path to a file/directory (relative to $PWD)
 * @returns Object (package.json data from resolved package
 */

function cwdpackage (path) {
  let cwd = resolve(process.cwd(), path || '')
  let pkg = null

  while (cwd.length > 1) {
    try {
      // TODO if verbose log('TRY %s', resolve(cwd, 'package.json'))
      pkg = require(resolve(cwd, 'package.json'))
      break
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') throw err
      cwd = dirname(cwd)
    }
  }

  if (!pkg) throw new Error('$CWD is not within an npm packaje')

  pkg.dir = cwd // TODO deprecate
  pkg.__dirname = cwd
  return pkg
}

module.exports = cwdpackage
