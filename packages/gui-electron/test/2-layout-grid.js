const assert = require('assert')

console.log('TEST node', __filename)
process.on('exit', (code) => console.log('CODE', code))

const ElectronGUI = require('../ElectronGUI')

let  gui = new ElectronGUI()


process.stdin.resume()
console.log('INFO asynchronous tests begin (stdin resumed)')

new Promise((resolve, reject) => {
  let timeout = setTimeout(() => reject('timed out'), 10000)
  gui.bootstrap()
    .then(gui => gui.on('client:created', client => {
      clearTimeout(timeout)
      assert.equal(typeof client.layout, 'function', 'client should implement #layout()' )
      assert.ok(Array.isArray(client.windows), 'client#windows should be an array')
      resolve(client)//setImmediate(() => resolve(client))
    }))
    .catch(reject)
})
// horizontal layout
.then(client => new Promise((resolve, reject) => {
  let layout = { horizontal: 4 }
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = client.layout(layout)
  assert.ok(promise instanceof Promise, 'client#layout() should return a promise')
  console.log('PASS it returns a promise')
  promise
    .then(windows => {
      clearTimeout(timeout)
      assert.ok(Array.isArray(client.windows), 'client#windows should be an array')
      assert.strictEqual(windows, client.windows, 'fulfilled array should be client.windows')
      assert.strictEqual(windows.length, layout.horizontal, 'wrong window count')
      return client
    })
    .then(client => new Promise(resolve => setTimeout(() => resolve(client), 500)))
    .then(client => client.confirm('É correcta a disposición para o layout?\n'
      + JSON.stringify(layout, null, 2)
    ))
    .then(response => {
      assert.strictEqual(response, true, 'user says layout is not correct')
      console.log('PASS layout correct (user confirmation)')
      console.log('TODO client#confirm each window')
      resolve(client)//setImmediate(() => resolve(client))
    })
    .catch(reject)
}))
// vertical layout
.then(client => new Promise((resolve, reject) => {
  let layout = { vertical: 3 }
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = client.layout(layout)
  assert.ok(promise instanceof Promise, 'client#layout() should return a promise')
  console.log('PASS it returns a promise')
  promise
    .then(windows => {
      clearTimeout(timeout)
      assert.strictEqual(windows, client.windows, 'fulfilled array should be client.windows')
      assert.strictEqual(windows.length, layout.vertical, 'wrong window count')
      return client
    })
    .then(client => new Promise(resolve => setTimeout(() => resolve(client), 500)))
    .then(client => client.confirm('É correcta a disposición para o layout?\n'
      + JSON.stringify(layout, null, 2)
    ))
    .then(response => {
      assert.strictEqual(response, true, 'user says layout is not correct')
      console.log('PASS layout correct (user confirmation)')
      console.log('TODO client#confirm each window')
      resolve(client)//setImmediate(() => resolve(client))
    })
    .catch(reject)
}))
// grid layout
.then(client => new Promise((resolve, reject) => {
  let layout = { horizontal: 9, vertical: 5 }
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = client.layout(layout)
  assert.ok(promise instanceof Promise, 'client#layout() should return a promise')
  console.log('PASS it returns a promise')
  promise
    .then(windows => {
      clearTimeout(timeout)
      assert.strictEqual(windows, client.windows, 'fulfilled array should be client.windows')
      let expect = layout.vertical * layout.horizontal
      assert.strictEqual(windows.length, expect, 'wrong window count')
      return client
    })
    .then(client => new Promise(resolve => setTimeout(() => resolve(client), 500)))
    .then(client => client.confirm('É correcta a disposición para o layout?\n'
      + JSON.stringify(layout, null, 2)
    ))
    .then(response => {
      assert.strictEqual(response, true)
      console.log('PASS layout correct (user confirmation)')
      resolve(client)//setImmediate(() => resolve(client))
    })
    .catch(reject)
}))
// partial layout
.then(client => new Promise((resolve, reject) => {
  let layout = { horizontal: 3, only: [0, 2]  }
  let expect = layout.only.length
  let timeout = setTimeout(() => reject('timed out'), 10000)
  let promise = client.layout(layout)
  assert.ok(promise instanceof Promise, 'client#layout() should return a promise')
  console.log('PASS it returns a promise')
  promise
    .then(windows => {
      clearTimeout(timeout)
      assert.strictEqual(windows, client.windows, 'fulfilled array should be client.windows')
      assert.strictEqual(windows.length, expect, 'wrong window count')
      return client
    })
    .then(client => new Promise(resolve => setTimeout(() => resolve(client), 500)))
    .then(client => client.confirm('É correcta a disposición para o layout?\n'
      + JSON.stringify(layout, null, 2)
    ))
    .then(response => {
      assert.strictEqual(response, true)
      console.log('PASS layout correct (user confirmation)')
      resolve(client)//setImmediate(() => resolve(client))
    })
    .catch(reject)
}))
// confirm each window
.then(client => {
  return client.layout({ horizontal: 2 })
    .then(() => new Promise(resolve => setTimeout(() => resolve(client), 500)))
})
.then(client => new Promise((resolve, reject) => {
  let sequence = Promise.resolve()
  client.windows.forEach(win => {
    sequence = sequence
    .then(() => client.confirm({
      message: `É esta a ventá ${win.n}?`, window: win.id
    }))
    .then(response => {
      assert.strictEqual(response, true)
      console.log('PASS window %s ok (user confirmation)', win.id)
    })
    .then(() => new Promise(resolve => setTimeout(() => resolve(client), 500)))
  })
  sequence.then(() => resolve(client)).catch(reject)
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
.finally(() => gui.shutdown())
.finally(() => {
  process.stdin.pause()
  console.log(`INFO ${__filename} test end (stdin paused)`)
  console.log('INFO If everything went ok, node process should gracefully exit with CODE 0')
})

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
