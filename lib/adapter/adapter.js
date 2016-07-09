'use strict';

const $operBuiltin = Symbol('builtinOperators');
const $operCustom = Symbol('customOperators');

const DEFAULT_OPERATOR = '=';
const DEFAULT_PLACEHOLDER_PREFIX = '@';


module.exports = class Adapter {
  constructor(options) {
    options = options || {};

    this[$operBuiltin] = createOperatorHandler(options.operators);
    this[$operCustom] = {};
  }

  getOperatorHandler(operator) {
    operator = operator && operator.toLocaleUpperCase();
    return this[$operCustom][operator] || this[$operBuiltin][operator] || this[$operBuiltin][DEFAULT_OPERATOR];
  }

  registerOperatorHandler(operator, handler) {
    if (!operator) {
      throw new TypeError('Invalid or missing operator');
    } else if (typeof operator !== 'string') {
      throw new TypeError('Invalid operator : ' + operator);
    } else if (typeof handler !== 'function') {
      throw new TypeError('Operator handler must be a function : ' + handler);
    }

    this[$operCustom][operator.toLocaleUpperCase()] = handler;
    return this;
  }

  unregisterOperatorHandler(operator) {
    if (!operator) {
      throw new TypeError('Invalid or missing operator');
    } else if (typeof operator !== 'string') {
      throw new TypeError('Invalid operator : ' + operator);
    }

    this[$operCustom][operator.toLocaleUpperCase()] = undefined;
    return this;
  }

  formatField(field) {
    if (!field || typeof field !== 'string') {
      throw new TypeError('Field is missing or invalid');
    }
    return field;
  }

  formatValue(value) {
    return value;
  }

  build(data, options) {
    throw new Error('Not implemented');
  }

}

/**
Expose constants
*/
module.exports.prototype.DEFAULT_OPERATOR = DEFAULT_OPERATOR;
module.exports.prototype.DEFAULT_PLACEHOLDER_PREFIX = DEFAULT_PLACEHOLDER_PREFIX;


function createOperatorHandler(operators) {
  operators = operators || {};

  if (!(DEFAULT_OPERATOR in operators)) {
    operators[DEFAULT_OPERATOR] = defaultOperatorHandler;
  }

  return operators;
}

function defaultOperatorHandler(field, oper, args, argSuffix, options) {
  if (!field) {
    throw new TypeError('Missing field');
  } else if (!args || !args.length) {
    throw new Error('Missing argument');
  }

  return options.fieldWrapper(field) + ' ' + (oper || this.DEFAULT_OPERATOR) + ' ' + options.valueWrapper(args[0]) + (argSuffix || '');
}
