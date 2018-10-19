const fs = require('fs');
const url = require('url');

const parseLine = line => {
  if (!line.trim() || /^(#|\/\/)/.test(line)) return;
  const m = /(\w+)\s+(.+)\s*=>\s*(.+)#(\w+)(\s*,(.+))?/.exec(line);
  if (!m) throw new SyntaxError('Unexpected token', line);
  let domain, path = m[2].trim();
  const i = path.indexOf('/');
  if (i > 0) {
    domain = path.substr(0, i);
    path = path.substr(i);
  }
  return {
    domain,
    path,
    action: m[4].trim(),
    controller: m[3].trim(),
    options: m[6] && JSON.parse(m[6]),
    method: m[1].trim().toUpperCase(),
  }
};

const parse = content =>
  content.split(/\n/)
  .map(parseLine)
  .filter(Boolean)
  .map(create);

const load = filename =>
  parse(fs.readFileSync(filename, 'utf8'));

const pathToRegexp = path => {
  if(path instanceof RegExp) return path;
  let arr = path.split('/'), pattern = '', keys = [];
  (arr[0] === '') && arr.shift();
  arr.forEach((p, i) => {
    switch(p[0]){
      case '*':
        pattern += '/(.+)';
        keys.push(p.substring(1) || `$${i}`);
        break;
      case ':':
        const r = '([^/]+?)';
        const o = p.substr(-1) === '?';
        pattern +=  o ? `(?:/${r})?` : `/${r}`;
        keys.push(p.substring(1, p.length-o));
        break;
      default:
        pattern += `/${p}`;
        break;
    }
  });
  keys.length && (pattern += '(?:/)?');
  pattern = new RegExp(`^${pattern}\/?$`, 'i');
  pattern.keys = keys;
  return pattern;
};

const find = (routes, req) => {
  const [ domain ] = (req.host || '').split(':');
  const { pathname } = url.parse(req.url);
  const m = routes
    .filter(route =>
      (route.domain ? route.domain === domain : true) &&
      route.regexp.test(pathname))
    .sort((a, b) => {
      const { priority: aPriority = 0 } = a;
      const { priority: bPriority = 0 } = b;
      return bPriority - aPriority;
    });
  if (!m.length) return { status: 404 };
  const allowMethods = m.map(route => route.method.toUpperCase());
  const methodIndex = allowMethods.findIndex(x => x === '*' || x === req.method.toUpperCase());
  if (!~methodIndex && req.method === 'OPTIONS')
    return { status: 204, allowMethods, routes: m };
  if (!~methodIndex) return { status: 405 };
  const route = m[ methodIndex ];
  route.params = route.regexp.exec(pathname).slice(1).reduce((params, param, i) => {
    params[ route.regexp.keys[i] ] = param && decodeURIComponent(param);
    return params;
  }, {});
  return { status: 200, route };
};

const create = route => {
  if(typeof route === 'string')
    route = parseLine(route);
  route.method = (route.method || '*');
  route.regexp = pathToRegexp(route.path);
  return route;
};

module.exports = {
  find,
  load,
  parse,
  create,
  parseLine,
  pathToRegexp
};

// console.log(find([
//   create('get / => home#index'),
//   create('get /user/:user? => user#index'),
// ], {
//   method: 'get', path: '/user/song940'
// }));