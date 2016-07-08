'use strict';   // Node v4, v5

const Adapter = require('./adapter/adapter');
const parse = require('./parser').parse;
const compile = require('./compiler');

const $adapter = Symbol('adapter');
const $template = Symbol('template');
const $pattern = Symbol('pattern');

const DEFAULT_OPERATOR = '=';
const DEFAULT_PLACEHOLDER_PREFIX = '@';

const adapters = {
  'postgresql': require('./adapter/postgresql')
};


module.exports = function filter(query, options) {
  options = options || {};

  options.adapter = 'adapter' in options ? (typeof options.adapter === 'string' ? adapters[options.adapter] : options.adapter) : adapters['postgresql'];
  options.operator = 'operator' in options ? options.operator : DEFAULT_OPERATOR;
  options.valueWrapper = 'valueWrapper' in options ? options.valueWrapper : identity;
  options.fieldWrapper = 'fieldWrapper' in options ? options.fieldWrapper : identity;
  options.placeholderPrefix = 'placeholderPrefix' in options ? options.placeholderPrefix : DEFAULT_PLACEHOLDER_PREFIX;

  if (!(options.adapter instanceof Adapter)) {
    throw new TypeError('Invalid adapter');
  } else if (typeof options.valueWrapper !== 'function') {
    throw new TypeError('Value wrapper is not a function');
  } else if (typeof options.fieldWrapper !== 'function') {
    throw new TypeError('Field wrapper is not a function');
  } else if (!options.placeholderPrefix || typeof options.placeholderPrefix !== 'string') {
    throw new TypeError('Invalid placeholder prefix');
  }

  return new Filter({
    template: options.adapter.build(compile(parse(query)), options),
    adapter: options.adapter,
    placeholderPattern: new RegExp(options.placeholderPrefix + '(\\d+)', 'g')
  });
}


class Filter {
  constructor(options) {
    this[$template] = options.template;
    this[$adapter] = options.adapter;
    this[$pattern] = options.placeholderPattern;
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


function identity(v) { return v; }
