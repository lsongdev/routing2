const routing = require('..');

const routes = routing.parse(`
# xx
get baidu.com/:name => home/aaa#index, { "a": true }
get /:all => home#all, { "priority": 1 }
`);

const route = routing.find(routes, {
  // host: 'baidu.com',
  method: 'GET',
  path: '/x'
});

console.log(route);
