
const assert = require('assert')

console.log('TESTING', require.resolve('../'))

const ServiceServer = require('../ServiceServer');
const ServiceClient = require('../ServiceClient')

assert.equal(typeof ServiceServer, 'function', 'Server should export a function')
assert.equal(typeof ServiceClient, 'function', 'Client should export a function')

let server = null
let client = null

try {
  server = new ServiceServer()
}
catch (error) {
  console.error('should be able to instantiate without arguments')
  throw error
}

const { EventEmitter } = require('events')
assert.ok(server instanceof EventEmitter, 'server should extend EventEmitter')
assert.ok(EventEmitter.prototype.isPrototypeOf(server), 'server should inherit EventEmitter')

console.log('server inheritance chain seems ok')

process.stdin.resume()
console.log('asynchronous tests begin (stdin resumed)')

new Promise((resolve, reject) => {
  assert.equal(typeof server.listen, 'function', 'server should implement #listen()' )
  assert.strictEqual( server.listening, false, 'server should not be listening' )
  assert.equal(typeof server.close, 'function', 'server should implement #close()' )
  assert.equal(typeof server.url, 'function', 'server should implement #url()' )
  try {
    server.url()
    assert.ok(false, 'server#url() should fail when not listening')
  } catch (error) {
    assert.ok(/listening/.test(error.message), 'error should reference listening')
  }
  server
    .on('listening', address => {
      assert.strictEqual(server.listening, true, 'server should be listening')
      assert.ok(address, 'address should be something')
      assert.ok(address.address, 'address should contain .address')
      assert.ok(address.port, 'address should contain .port')
      let url = server.url()
      assert.ok(url, 'server.url() should return something')
      resolve(url)
    })
    .listen()
})
.then(url => {
  client = new ServiceClient(url)
  assert.equal(typeof client.connect, 'function', 'client should implement #connect()' )
  assert.equal(typeof client.disconnect, 'function', 'client should implement #disconnect()' )
  assert.equal(typeof client.send, 'function', 'client should implement #send()' )
  assert.strictEqual(client.connected, false, 'client should not be connected' )
  return new Promise((resolve, reject) => {
    let promise = client.connect()
    assert.ok(promise instanceof Promise, 'client#connect() should return a promise' )
    promise.then(resolve).catch(reject)
  })
})
.then(() => new Promise((resolve, reject) => {
  server.once('ws:message', (ws, msg) => {
    assert.strictEqual(msg, 'foo', 'should receive foo')
    resolve(ws)
  })
  client.send('foo')
}))
.then((ws) => new Promise((resolve, reject) => {
  client.once('ws:message', (msg) => {
    assert.strictEqual(msg, 'bar', 'should receive bar')
    resolve()
  })
  ws.send('bar')
}))
.then(() => client.disconnect())
.then(() => server.close())
.catch(error => {
  console.error('something failed during asynchronous tests:')
  console.error(error)
})
.finally(() => {
  process.stdin.pause()
  console.log(`${require.resolve('../')} test end (stdin paused)`)
  console.log('If everything went ok, node process should gracefully exit')
})
/*
test('server', function( t ){
  var service = Object.create( server );
  service.on('request', function( req, res ){
    t.ok( req, 'expect an incoming message' );
    t.ok( res, 'expect an outgoing response stream' );
    res.on('finish', function(){
      t.pass( 'outgoing response finished' );
      service.close(function( err ){
        t.error( err, 'service should close without errors' );
        t.end();
      });
    }).end() // trigger response end
    this.close( t.end.bind(t) );
  }).on('listening', function(){
    t.pass( 'service is listening as expected' );
    console.log( this.address() );
    //t.fail( 'request should be mocked-up here' );
    // once listening, mock-up a fake request
  }).listen();
});

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
