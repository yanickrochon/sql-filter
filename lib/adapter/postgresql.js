'use strict';   // Node v4, v5

const DEFAULT_GLUE = ' OR ';

const TEMP_FIELD_PREFIX = '_';

const JSON_PROPERTY = '->';
const JSON_PROPERTY_TEXT = '->>';

const DEFAULT_OPERATOR = '=';
const OPERATORS = {
  '=': operatorDefaultHandler,
  'BETWEEN': operatorbetweenHandler
};


module.exports.build = postreSqlBuilder;
module.exports.formatField = formatField;
module.exports.formatValue = formatValue;



function postreSqlBuilder(tree, options) {
  return buildList('', tree, options, {}, 0).join(DEFAULT_GLUE);
}

function buildList(fieldPrefix, tree, options, cache, depth) {
  let buffer = [];

  for (let keys = Object.keys(tree), i = 0, iLen = keys.length; i < iLen; ++i) {
    let field = keys[i];
    let value = tree[field];

    if (field.charAt(0) === '$') {
      let list;
      if (Array.isArray(value)) {
        list = [];
        for (let i = 0, iLen = value.length; i < iLen; ++i) {
          list.push.apply(list, buildList(fieldPrefix, value[i], options, cache, depth + 1));
        }
      } else {
        list = buildList(fieldPrefix, value, options, cache, depth + 1);
      }
      let isSubList = depth && list.length;
      buffer.push((isSubList ? '(' : '') + list.join(' ' + field.substr(1) + ' ') + (isSubList ? ')' : ''));
    } else if (field.charAt(0) === '@') {
      buffer.push(buildArray(fieldPrefix, field.substr(1), value, options, cache));
    } else if (Array.isArray(value)) {
      for (let i = 0, iLen = value.length; i < iLen; ++i) {
        buffer.push(buildExpression(fieldPrefix, field, value[i], options));
      }
    } else {
      buffer.push(buildExpression(fieldPrefix, field, value, options));
    }
  }

  return buffer;
}

function buildArray(fieldPrefix, field, tree, options, cache) {
  let tmpField = createTempField(fieldPrefix + field, cache);
  let arrayField = formatField(field, fieldPrefix, false);
  let conditions = buildList(tmpField, tree, options, cache, 0).join(DEFAULT_GLUE);

  return arrayField + ' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(' + arrayField + ') AS ' + tmpField + ' WHERE ' + conditions + ')';
}


function createTempField(field, cache) {
  let tmp = TEMP_FIELD_PREFIX + field.replace(/[^a-z0-9]/gi, '');
  let counter = 0;

  field = tmp;

  while (field in cache) field = tmp + (++counter);

  cache[field] = true;

  return field;
}


function buildExpression(fieldPrefix, field, value, options) {
  let fieldPart = formatField(field, fieldPrefix, true);
  let fieldArgSuffix = fieldPart.indexOf(JSON_PROPERTY_TEXT) >= 0 ? '::TEXT' : '';
  let fieldOperator = value.operator || options.operator;
  let fieldArgs = value.arguments && value.arguments.length && value.arguments || ['@1'];
  let operatorHandler = OPERATORS[fieldOperator.toLocaleUpperCase()] || OPERATORS[DEFAULT_OPERATOR];

  return options.fieldWrapper(fieldPart) + operatorHandler(fieldOperator, fieldArgs, fieldArgSuffix, options);
}


function formatField(field, prefix, asText) {
  let parts = ((prefix ? prefix + '.' : '') + field).split('.');
  let last;

  if (parts.length > 1) {
    last = parts.pop();
    return parts.join(JSON_PROPERTY) + (asText ? JSON_PROPERTY_TEXT : JSON_PROPERTY) + "'" + last + "'";
  } else {
    return field;
  }
}


function formatValue(value) {
  if (typeof value === 'string') {
    return "'" + value.replace("'", "''") + "'";
  } else if (value === false || value === true || typeof value === 'number') {
    return value.toString();
  } else if (value === undefined || value === null) {
    return 'null';
  } else {
    return "'" + JSON.stringify(value) + "'";
  }
}


function operatorDefaultHandler(oper, args, argSuffix, options) {
  if (!args.length) {
    throw new Error('Missing argument');
  }
  return ' ' + oper + ' ' + options.valueWrapper(args[0]) + argSuffix;
}
function operatorbetweenHandler(oper, args, argSuffix, options) {
  if (args.length < 2) {
    throw new Error('Found '  + args.length + ' arguments, but requried 2');
  }
  return ' BETWEEN ' + options.valueWrapper(args[0]) + argSuffix + ' AND ' + options.valueWrapper(args[1]) + argSuffix;
}
