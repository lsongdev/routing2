const routing = require('..');

const routes = routing.parse(`
# xx
get /:name => home/aaa#index, { "a": true }
get /:all* => home#all, { "priority": 1 }
`);

const route = routing.find(routes, {
  method: 'get',
  path: '/x'
});

console.log(route);
