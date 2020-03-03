
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
  assert.equal(typeof server.listen, 'function', 'server should implement #listen()' );
  assert.strictEqual( server.listening, false, 'server should not be listening' );
  server
    .on('listening', address => {
      assert.ok(address, 'address should be something')
      assert.strictEqual(server.listening, true, 'server should be listening')
      resolve(address)
    })
    .listen()
})
.then(address => {
  console.log(address)
  throw new Error('i should instantiate client now')
})
.then(() => {
  process.stdin.pause()
  console.log(`${require.resolve('../')} test end (stdin paused)`)
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
