const routing = require('..');

const routes = routing(`
  get /:name => home#index
`);

console.log(routes);
