## routing2 [![routing2](https://img.shields.io/npm/v/routing2.svg)](https://npmjs.org/routing2)

> parse http routing define

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
get /:name => home#index , a=1, b=2
`);

console.log(routes); // ->
{
	method: 'get',
	path: '/:name',
	controller: 'home',
	action: 'index',
	options: { a:1, b:2 }
}
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

### ISC

This work is licensed under the [ISC license](./LICENSE).

---