const pathToRegexp = require('path-to-regexp');

const parseLine = line => {
  if (!line.trim() || /^(#|\/\/)/.test(line)) return;
  const m = /(\w+)\s+(.+)\s*=>\s*(.+)#(\w+)(\s*,(.+))?/.exec(line);
  if (!m) throw new SyntaxError('Unexpected token', line);
  return {
    method: m[1].trim().toUpperCase(),
    path: m[2].trim(),
    controller: m[3].trim(),
    action: m[4].trim(),
    options: m[6] && JSON.parse(m[6])
  }
};

const find = (routes, req) => {
  const m = routes
    .filter(route =>
      (route.domain ? route.domain === req.host : true) &&
      route.regexp.test(req.path))
    .sort((a, b) => {
      const { priority: aPriority = 0 } = a;
      const { priority: bPriority = 0 } = b;
      return bPriority - aPriority;
    });
  if (!m.length) return { status: 404 };
  const allowMethods = m.map(route => route.method);
  const methodIndex = allowMethods.indexOf(req.method);
  if (!~methodIndex && req.method === 'OPTIONS')
    return { status: 204, allowMethods, routes: m };
  if (!~methodIndex) return { status: 405 };
  const route = m[methodIndex];
  const args = route.regexp.exec(req.path).slice(1).map(arg => {
    return arg === undefined ? arg : decodeURIComponent(arg);
  });
  route.params = route.regexp.keys.reduce((params, key, i) => {
    params[key.name] = args[i];
    return params;
  }, {});
  return { status: 200, route };
};

const create = route => {
  let keys = [];
  const { domain, path } = route;
  const i = path.indexOf('/');
  if (i > 0) {
    route.domain = path.substr(0, i);
    route.path = path.substr(i);
  }
  route.method = route.method.toUpperCase();
  route.regexp = pathToRegexp(route.path, keys);
  route.regexp.keys = keys;
  return route;
};

const parse = content =>
  content.split(/\n/)
  .map(parseLine)
  .filter(Boolean)
  .map(create);

module.exports = {
  find,
  create,
  parse,
  parseLine,
};