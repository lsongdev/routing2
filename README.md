## routing2

> Parse HTTP Routing definition with no dependencies, just ~3kb!

[![routing2](https://img.shields.io/npm/v/routing2.svg)](https://npmjs.org/routing2)
[![Build Status](https://travis-ci.org/song940/routing2.svg?branch=master)](https://travis-ci.org/song940/routing2)

### Define

<img src="./define.png" width="50%" >

### Installation

```bash
$ npm install routing2
```

### Example

```js
const routing = require('routing2');

const routes = routing.parse(`
get / => home#index
get /:name => user#index, { "foo": "bar" }
post /user => user#create
`);

const request = {
  method: 'get',
  url: '/lsong?foo=bar'
};

const route = routing.find(routes, request);

console.log(route);
// { status: 200,
//   route:
//    { domain: undefined,
//      path: '/:name',
//      action: 'index',
//      controller: 'user',
//      options: { foo: "bar" },
//      method: 'GET' },
//   params: { name: 'lsong' },
//   query: { foo: 'bar' } }
```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

This work is licensed under the [MIT license](./LICENSE).

---