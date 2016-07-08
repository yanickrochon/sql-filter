'use strict';   // Node v4, v5

const Adapter = require('./adapter/adapter');
const parse = require('./parser').parse;
const compile = require('./compiler');

const $adapter = Symbol('adapter');
const $template = Symbol('template');

const PLACEHOLDER_PATTERN = /@(\d+)/g;
const DEFAULT_OPERATOR = '=';

const adapters = {
  'postgresql': require('./adapter/postgresql')
};


module.exports = function filter(query, options) {
  options = options || {};

  options.adapter = typeof options.adapter === 'string' ? adapters[options.adapter] : options.adapter || adapters['postgresql'];
  options.operator = options.operator || DEFAULT_OPERATOR;
  options.valueWrapper = options.valueWrapper || identity;
  options.fieldWrapper = options.fieldWrapper || identity;

  if (!(options.adapter instanceof Adapter)) {
    throw new TypeError('Invalid adapter');
  } else if (typeof options.valueWrapper !== 'function') {
    throw new TypeError('Value wrapper is not a function');
  } else if (typeof options.fieldWrapper !== 'function') {
    throw new TypeError('Field wrapper is not a function');
  }

  return new Filter({
    template: options.adapter.build(compile(parse(query)), options),
    adapter: options.adapter
  });
}


class Filter {
  constructor(options) {
    this[$template] = options.template;
    this[$adapter] = options.adapter;
  }

  apply() {
    let values = arguments;
    let adapter = this[$adapter];
    return this[$template].replace(PLACEHOLDER_PATTERN, function (m, i) {
      return adapter.formatValue(values[i - 1]);
    });
  }

  toString() {
    return this[$template];
  }
}



function identity(v) { return String(v); }
