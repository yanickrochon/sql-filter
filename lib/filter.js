'use strict';   // Node v4, v5

const Adapter = require('./adapter/adapter');
const parse = require('./parser').parse;
const compile = require('./compiler');

const $adapter = Symbol('adapter');
const $template = Symbol('template');
const $pattern = Symbol('pattern');

const adapters = {
  'postgresql': require('./adapter/postgresql')
};


module.exports = function filter(query, options) {
  options = options || {};

  options.adapter = 'adapter' in options ? (typeof options.adapter === 'string' ? adapters[options.adapter] : options.adapter) : adapters['postgresql'];

  if (!(options.adapter instanceof Adapter)) {
    throw new TypeError('Invalid adapter');
  }

  return new Filter({
    template: options.adapter.build(compile(parse(query)), options),
    adapter: options.adapter,
    placeholderPrefix: options.placeholderPrefix || options.adapter.DEFAULT_PLACEHOLDER_PREFIX
  });
}


class Filter {
  constructor(options) {
    this[$template] = options.template;
    this[$adapter] = options.adapter;
    this[$pattern] = new RegExp(options.placeholderPrefix + '(\\d+)', 'g');
  }

  apply() {
    let values = arguments;
    let adapter = this[$adapter];
    return this[$template].replace(this[$pattern], function (m, i) {
      return adapter.formatValue(values[i - 1]);
    });
  }

  toString() {
    return this[$template];
  }
}
