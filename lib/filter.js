'use strict';   // Node v4, v5

const parse = require('./parser').parse;
const compile = require('./compiler');

const DEFAULT_OPERATOR = '=';
const DEFAULT_PLACEHOLDER = '%%VALUE%%'

const adapters = {
  'postgresql': require('./adapter/postgresql')
};


module.exports = function filter(query, options) {
  options = options || {};

  options.adapter = typeof options.adapter === 'string' ? adapters[options.adapter] : options.adapter || adapters['postgresql'];
  options.operator = options.operator || DEFAULT_OPERATOR;
  options.placeholder = options.placeholder || DEFAULT_PLACEHOLDER;
  options.valueWrapper = options.valueWrapper || identity;
  options.fieldWrapper = options.fieldWrapper || identity;

  if (typeof options.adapter.build !== 'function' || typeof options.adapter.formatValue !== 'function') {
    throw new TypeError('Invalid adapter');
  } else if (typeof options.valueWrapper !== 'function') {
    throw new TypeError('Value wrapper is not a function');
  } else if (typeof options.fieldWrapper !== 'function') {
    throw new TypeError('Field wrapper is not a function');
  }

  return new Filter({
    queryFilter: options.adapter.build(compile(parse(query), options.placeholder), options),
    placeholder: options.placeholder,
    valueFormatter: options.adapter.formatValue
  });
}


class Filter {
  constructor(options) {
    this._queryFilter = options.queryFilter;
    this._placeholder = options.placeholder;
    this._formatValue = options.valueFormatter;
  }

  apply(value) {
    return this._queryFilter.replace(new RegExp(this._placeholder, 'g'), this._formatValue(value));
  }

  toString() {
    return this._queryFilter;
  }
}



function identity(v) { return String(v); }