'use strict';   // Node v4, v5

const FIELD_SEPARATOR = '.';

const VALID_OPERATORS = /^OR|AND$/;

const GLUE_PREFIX = '$';
const ARRAY_PREFIX = '@';


module.exports = function compiler(tree) {
  const cache = createPatternCache();
  const compiled = {};
  let tokens;
  //let count = 0;

  while (tokens = collect(tree, cache.resetKey(), [], 0)) {
    //console.log(++count, tokens);
    processTokens(compiled, tokens);

    if (!cache.hasNext) break;
  }

  return compiled;
}


function processTokens(compiled, tokens) {
  let fieldPath = '';
  let _compiled = compiled;
  var fieldValue = { arguments: [1] };

  function hasArrayAhead(i, glue) {
    for (let iLen = tokens.length; i < iLen; ++i) {
      if (tokens[i].array) {
        return false;
      } else if (tokens[i].glue && tokens[i].glue !== glue && tokens[i].max > 0) {
        return true;
      }
    }
    return false;
  }

  for (let i = 0, iLen = tokens.length; i < iLen; ++i) {
    fieldPath = (fieldPath ? fieldPath + FIELD_SEPARATOR : '') + tokens[i].field;

    if (tokens[i].glue && tokens[i].max > 0) {
      let glue = GLUE_PREFIX + tokens[i].glue;
      let index = tokens[i].index;

      if (!tokens[i].array && hasArrayAhead(i + 1, glue)) {
        if (!Array.isArray(_compiled[glue])) {
          _compiled = _compiled[glue] ? (_compiled[glue] = [_compiled[glue]]) : (_compiled[glue] = []);
        } else {
          _compiled = _compiled[glue];
        }
        _compiled = (_compiled[index] || (_compiled[index] = {}));
      } else {
        _compiled = (_compiled[glue] || (_compiled[glue] = {}));
      }
    }
    if (tokens[i].array) {
      fieldPath = ARRAY_PREFIX + fieldPath
      _compiled = (_compiled[fieldPath] = _compiled[fieldPath] || {});
      fieldPath = '';
    }
    if ('operator' in tokens[i]) {
      fieldValue.operator = tokens[i].operator;
    }
    if ('arguments' in tokens[i]) {
      fieldValue.arguments = tokens[i].arguments;
    }
  }
  if (_compiled[fieldPath] && !isFieldValueEqual(_compiled[fieldPath], fieldValue)) {
    if (!Array.isArray(_compiled[fieldPath])) {
      _compiled[fieldPath] = [_compiled[fieldPath]];
    }
    _compiled[fieldPath].push(fieldValue);
  } else {
    _compiled[fieldPath] = fieldValue;
  }
}


function collect(tree, cache, tokens, depth) {
  if (typeof tree === 'string') {
    tokens.push({ field: tree });
    cache.pushKey(tree);
  } else if ('path' in tree) {
    if ('array' in tree) {
      tokens.push({ field: tree.array, array: true });
      cache.pushKey(tree.array);
    }

    for (let i = 0, iLen = tree.path.length; i < iLen; ++i) {
      if (typeof tree.path[i] === 'string') {
        tokens.push({ field: tree.path[i] });
        cache.pushKey(tree.path[i]);
      } else {
        const subTokens = collect(tree.path[i], cache, [], depth + 1);

        tokens.push.apply(tokens, subTokens);
      }
    }

    if (tree.options) {
      tree.options && 'operator' in tree.options && (tokens[0].operator = tree.options.operator);
      tree.options && 'arguments' in tree.options && (tokens[0].arguments = tree.options.arguments);
    }
  } else if ('list' in tree) {
    const glue = checkOperator(tree.glue);
    const index = cache.getIndex(tree.list.length - 1, depth);
    const subTokens = collect(tree.list[index], cache, [], depth + 1);

    if (!subTokens[0].glue) {
      subTokens[0].glue = tree.glue;
    }
    subTokens[0].index = index;
    subTokens[0].max = tree.list.length - 1;
    tokens.push.apply(tokens, subTokens);
  }

  return tokens;
}


function isFieldValueEqual(a, b) {
  return (a.operator === b.operator) && (a.arguments.sort().join(',') === b.arguments.sort().join(','));
}


function checkOperator(oper) {
  if (!VALID_OPERATORS.test(oper)) {
    throw new Error('Invalid operator : ' + oper);
  }
  return oper;
}


function createPatternCache() {
  const indexCache = {};
  let key = '';

  return {
    //getKey() {
    //  return key;
    //},
    pushKey(suffix) {
      key = (key ? key + FIELD_SEPARATOR : '') + suffix;
      return this;
    },
    resetKey() {
      key = '';
      return this;
    },
    getIndex(max, depth) {
      let indexKey = key + '/' + depth;
      if (indexKey in indexCache) {
        ++indexCache[indexKey].index;
        if (indexCache[indexKey].index >= indexCache[indexKey].max) {
          indexCache[indexKey].looped = true;
          if (indexCache[indexKey].index > indexCache[indexKey].max) {
            indexCache[indexKey].index = 0;
          }
        }
      } else {
        indexCache[indexKey] = { index: 0, max: max };
      }
      return indexCache[indexKey].index;
    },
    get hasNext() {
      const keys = Object.keys(indexCache);

      for (let i = 0, iLen = keys.length; i < iLen; ++i) {
        let key = keys[i];
        if (!indexCache[key].looped) {
          return true;
        }
      }

      return false;
    }
  };
}
