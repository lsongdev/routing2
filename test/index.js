const assert = require('assert');
const test = require('./test');
const { parse, pathToRegexp, find, load } = require('..');

var r, s;

test('normal path', () => {
  r = pathToRegexp('/normal/path');
  assert.ok(r.parse('/normal/path'));
  assert.equal(r.parse('/aaa'), null);
});

test('optional parameter', () => {
  r = pathToRegexp('/v1/:name*');
  assert.deepEqual(r.parse('/v1/aaa/bbb'), { name: 'aaa/bbb'})
});

test('named and optional parameter', () => {
  r = pathToRegexp('/:a/:b*');
  s = '/test/';
  assert.ok(r.test(s));
  assert.deepEqual(r.parse(s), { a: 'test', b: '' });
});

const routes = parse(`
  get / => home#index
  get /:name => user#user
`);

test('parse routing rules', () => {
  assert.equal(routes[0].path, '/');
  assert.equal(routes[0].action, 'index');
  assert.equal(routes[1].action, 'user');
  assert.equal(routes[1].controller, 'user');
});

test('find match rule in routes', () => {
  r = find(routes, {
    host: 'google.com',
    method: 'GET',
    url: '/1?a=b'
  });
  assert.equal(r.status, 200);
  assert.equal(r.route.action, 'user');
  assert.equal(r.route.controller, 'user');
  assert.deepEqual(r.query, { a: 'b' });
  assert.deepEqual(r.params, { name: '1' });
});

test('load routes from file', () => {
  const routes = load(__dirname + '/routes.txt');
  assert.ok(Array.isArray(routes));
  assert.equal(routes.length, 2);
  assert.equal(routes[0].controller, 'home');
  assert.equal(routes[0].action, 'index');
  assert.equal(routes[1].controller, 'user');
  assert.equal(routes[1].action, 'create');
});