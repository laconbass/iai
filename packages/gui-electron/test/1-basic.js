const assert = require('assert')
const WebSocket = require('ws')

console.log('TEST node', require.resolve('../'))

const ElectronGUI = require('../ElectronGUI')

assert.equal(typeof ElectronGUI, 'function', 'should export a function')
assert.equal(typeof ElectronGUI.prototype, 'object', 'should have #prototype')
console.log('PASS it seems to export a builder')

let gui = null

try {
  gui = new ElectronGUI()
}
catch (error) {
  console.log('FAIL should be able to instantiate without arguments')
  throw error
}

// TODO should be instanceof UserInterface¿?¿?¿? => YAGNI, KISS
assert.ok(gui instanceof ElectronGUI, 'should be instanceof ElectronGUI')
console.log('PASS instance inheritance chain seems ok')

assert.equal(typeof gui.bootstrap, 'function', 'should implement #bootstrap()' )
assert.equal(typeof gui.shutdown, 'function', 'should implement #shutdown()' )
//assert.equal(typeof gui.createClient, 'function', 'should implement #createClient()' )
console.log('PASS instance interface seems ok')

process.on('exit', (code) => console.log('CODE', code))

process.stdin.resume()
console.log('INFO asynchronous tests begin (stdin resumed)')

new Promise((resolve, reject) => {
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = gui.bootstrap()
  assert.ok(promise instanceof Promise, '#bootstrap() should return a promise')
  promise
    // TODO then createClient()
    .then(gui => gui.on('client:created', client => {
      clearTimeout(timeout)
      assert.equal(typeof client.id, 'number', 'client#id should be number')

      let screen = client.screen
      assert.ok(screen, 'client#screen should be something')
      assert.ok(Array.isArray(screen.displays), 'client#screen#displays should be an array')
      assert.equal(typeof screen.current, 'number', 'client#screen#current should be number')
      assert.equal(typeof screen.cursor.x, 'number', 'client#screen#cursor.x should be number')
      assert.equal(typeof screen.cursor.y, 'number', 'client#screen#cursor.y should be number')

      console.log('PASS client data seems ok')
      resolve(client)//setImmediate(() => resolve(client))
    }))
    .catch(reject)
})
// client interface implementation
.then(client => {
  assert.ok(client instanceof ElectronGUI.Client, 'client should inherit #Client')
  assert.equal(typeof client.confirm, 'function', 'client should implement #confirm()' )
  console.log('PASS client instance inheritance chain and interface seem ok')
  return client
})
// ask user to confirm true
.then(client => new Promise((resolve, reject) => {
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = client.confirm('Selecciona o botón SI')
  assert.ok(promise instanceof Promise, 'client#confirm() should return a promise')
  promise.then(result => {
    clearTimeout(timeout)
    assert.strictEqual(result, true, 'wrong result value when user selects OK')
    console.log('PASS client#confirm when user confirms')
    resolve(client)//setImmediate(() => resolve(client))
  }).catch(reject)
}))
// ask user to confirm false
.then(client => new Promise((resolve, reject) => {
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = client.confirm('Selecciona o botón NON')
  assert.ok(promise instanceof Promise, 'client#confirm() should return a promise')
  promise.then(result => {
    clearTimeout(timeout)
    assert.strictEqual(result, false, 'wrong result value when user selects CANCEL')
    console.log('PASS client#confirm when user rejects')
    resolve(client)//setImmediate(() => resolve(client))
  }).catch(reject)
}))
// ask user to escape confirm dialog
.then(client => new Promise((resolve, reject) => {
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = client.confirm('Presiona a tecla ESCAPE')
  assert.ok(promise instanceof Promise, 'client#confirm() should return a promise')
  promise.then(result => {
    clearTimeout(timeout)
    assert.strictEqual(result, false, 'wrong result value when user escapes dialog')
    console.log('PASS client#confirm when user escapes')
    resolve(client)//setImmediate(() => resolve(client))
  }).catch(reject)
}))
// test #confirm accepts an object
.then(client => new Promise((resolve, reject) => {
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = client.confirm({
    message: 'Presiona calquera botón, ou ESCAPE'
  })
  assert.ok(promise instanceof Promise, 'client#confirm() should return a promise')
  promise.then(result => {
    clearTimeout(timeout)
    resolve(client)//setImmediate(() => resolve(client))
  }).catch(reject)
}))
// test shutdown logic
.then(() => new Promise((resolve, reject) => {
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = gui.shutdown()
  assert.ok(promise instanceof Promise, '#shutdown() should return a promise')
  return promise.then(() => {
    clearTimeout(timeout)
    console.log('PASS #shutdown() completed gracefully in less than 2s')
    resolve() //setImmediate(resolve)
  }).catch(reject)
}))
.catch(error => {
  if ('string' === typeof error) {
    switch (error) {
      case 'timed out': process.exitCode = 126; break
      default: process.exitCode = 2; break
    }
    error = new Error(error)
  }
  else if (error.code === 'ERR_ASSERTION') {
    console.log('FAIL', `${error.actual} should be ${error.operator} ${error.expected}`)
    process.exitCode = 1
  } else {
    process.exitCode = 99
  }
  console.error(error.stack)
  console.log('FAIL', error.message)
})
//.finally(() => gui.shutdown())
.finally(() => {
  process.stdin.pause()
  console.log(`INFO ${require.resolve('../')} test end (stdin paused)`)
  console.log('INFO If everything went ok, node process should gracefully exit')
})

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
