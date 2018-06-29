const pathToRegexp = require('path-to-regexp');

const TAG = {
  TO    : '=>',
  EOL   : '\n',
  SPACE : /\s+/,
  SHARP : '#',
};

function removeQuotes(input){
  return input.map(function(item){
    return item.trim().replace(/"|'/ig, '')
  });
};

function parseRoute(content){
  return content.toString().split(TAG.EOL).map(function(line){
    return line.trim();
  }).filter(function(line){
    return line !== '' && (!(/^(\/\/|#)/).test(line));
  }).map(function(line){
    return line.split(TAG.TO).map(function(str){
      return str.trim();
    });
  }).map(function(item){
    if(item.length < 2){
      throw new SyntaxError('Unexpected token', item);
    }
    var method_and_route      = removeQuotes(item[0].split(TAG.SPACE));
    var controller_and_action = removeQuotes(item[1].split(TAG.SHARP));
    var keys = [];
    var regexp = pathToRegexp(method_and_route[1], keys);
    return {
      keys        : keys,
      regexp      : regexp,
      route       : method_and_route[1],
      method      : method_and_route[0].toUpperCase(),
      action      : controller_and_action[1],
      controller  : controller_and_action[0],
    }
  });
};

module.exports = {
  parse: parseRoute,
  removeQuotes
};
