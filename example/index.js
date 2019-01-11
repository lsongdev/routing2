const routing = require('..');

// const routes = routing.parse(`
// # xx
// get baidu.com/:name => home/aaa#index, { "a": true }
// // get /:all => home#all, { "priority": 1 }
// get "/:x" => "user#index"
// `);

// const route = routing.find(routes, {
//   // host: 'baidu.com',
//   method: 'GET',
//   url: '/1'
// });

// console.log(route.route.params);

const r = routing.pathToRegexp('/v1/:name*');

console.log(r);
console.log('keys:', r.keys);
console.log(r.exec('/v1/aaa/bbb'));