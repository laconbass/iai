
module.exports = exit;

/**
 * exits the current process, intentionally simple
 */

function exit( ){
  // TODO this should return a flow
  console.log('Bye.');
  process.exit();
}

