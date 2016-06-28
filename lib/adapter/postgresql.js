'use strict';   // Node v4, v5

const DEFAULT_GLUE = ' OR ';

const TEMP_FIELD_PREFIX = '_';

const JSON_PROPERTY = '->';
const JSON_PROPERTY_TEXT = '->>';


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
      let list = buildList(fieldPrefix, value, options, cache, depth + 1);
      let isSubList = depth && list.length;
      buffer.push((isSubList ? '(' : '') + list.join(' ' + field.substr(1) + ' ') + (isSubList ? ')' : ''));
    } else if (field.charAt(0) === '@') {
      buffer.push(buildArray(fieldPrefix, field.substr(1), value, options, cache));
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
  let valueSuffix = fieldPart.indexOf(JSON_PROPERTY_TEXT) >= 0 ? '::TEXT' : '';

  return options.fieldWrapper(fieldPart) + ' ' + options.operator + ' ' + options.valueWrapper(value) + valueSuffix;
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
