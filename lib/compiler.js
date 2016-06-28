'use strict';   // Node v4, v5

const FIELD_SEPARATOR = '.';

const VALID_OPERATORS = /^OR|AND$/;

const GLUE_PREFIX = '$';
const ARRAY_PREFIX = '@';


module.exports = function compiler(tree, value) {
  const cache = createPatternCache();
  const compiled = {};
  let tokens;
  //let count = 0;

  while (tokens = collect(tree, cache.resetKey(), [])) {
    //console.log(++count, tokens);
    processTokens(compiled, tokens, value);

    if (!cache.hasNext) break;
  }

  return compiled;
}


function processTokens(compiled, tokens, value) {
  let fieldPath = '';
  let _compiled = compiled;

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
  }

  _compiled[fieldPath] = value;
}


function collect(tree, cache, tokens) {
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
        const subTokens = collect(tree.path[i], cache, []);

        tokens.push.apply(tokens, subTokens);
      }
    }
  } else if ('list' in tree) {
    const glue = checkOperator(tree.glue);
    const index = cache.getIndex(tree.list.length - 1);
    const subTokens = collect(tree.list[index], cache, []);

    subTokens[0].glue = tree.glue;
    subTokens[0].index = index;
    subTokens[0].max = tree.list.length - 1;
    tokens.push.apply(tokens, subTokens);
  }

  return tokens;
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
    getIndex(max) {
      if (key in indexCache) {
        ++indexCache[key].index;
        if (indexCache[key].index >= indexCache[key].max) {
          indexCache[key].looped = true;
          if (indexCache[key].index > indexCache[key].max) {
            indexCache[key].index = 0;
          }
        }
      } else {
        indexCache[key] = { index: 0, max: max };
      }
      return indexCache[key].index;
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
