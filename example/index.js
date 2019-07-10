const routing = require('..');

const routes = routing.parse(`
get / => home#index, { "foo": "bar" }
get /:name => user#index
post /user => user#create
`);

const request = {
  method: 'get',
  url: '/lsong?foo=bar'
};

const route = routing.find(routes, request);

console.log(route);

