

describe('Testing Compiler', function () {

  const compile = require('../../lib/compiler');
  const DEFAULT_VALUE_OUT = { arguments: ['@1'] };


  it('should return simple value', function () {
    compile('a', 'test').should.deepEqual({ 'a': DEFAULT_VALUE_OUT });
  })

  it('should compile simple path', function () {
    compile({
      path: [ "a", "b" ]
    }).should.deepEqual({ 'a.b': DEFAULT_VALUE_OUT });
  });

  it('should compile simple list', function () {
    compile({
      glue: 'OR', list: [ 'a', 'b' ]
    }).should.deepEqual({ $OR: { 'a': DEFAULT_VALUE_OUT, 'b': DEFAULT_VALUE_OUT } });
  });

  it('should compile path + list', function () {
    compile({
      "path": [
        "a",
        "b",
        {
          "glue": "OR",
          "list": [ "c", "d" ]
        }
      ]
    }).should.deepEqual({ $OR: { 'a.b.c': DEFAULT_VALUE_OUT, 'a.b.d': DEFAULT_VALUE_OUT } });
  });

  it('should permute two lists', function () {
    compile({
      "path": [
        {
          "glue": "OR",
          "list": [ "a", "b" ]
        },
        {
          "glue": "AND",
          "list": [ "c", "d" ]
        }
      ]
    }).should.deepEqual({ $OR: [{ $AND: { 'a.c': DEFAULT_VALUE_OUT, 'a.d': DEFAULT_VALUE_OUT } }, { $AND: { 'b.c': DEFAULT_VALUE_OUT, 'b.d': DEFAULT_VALUE_OUT } }] });

    compile({
      "path": [
        "a",
        {
          "glue": "AND",
          "list": [ "b", "c" ]
        },
        "d",
        {
          "glue": "OR",
          "list": [
            {
              "path": [ "e",  "f" ]
            }
          ]
        }
      ]
    }).should.deepEqual({ $AND: { 'a.b.d.e.f': DEFAULT_VALUE_OUT, 'a.c.d.e.f': DEFAULT_VALUE_OUT } });

    compile({
      "path": [
        "a",
        {
          "glue": "AND",
          "list": [ "b", "c" ]
        },
        "d",
        {
          "glue": "OR",
          "list": [
            {
              "path": [ "e",  "f" ]
            },
            'g'
          ]
        }
      ]
    }).should.deepEqual({ $AND: [{ $OR: { 'a.b.d.e.f': DEFAULT_VALUE_OUT, 'a.b.d.g': DEFAULT_VALUE_OUT } }, { $OR: { 'a.c.d.e.f': DEFAULT_VALUE_OUT, 'a.c.d.g': DEFAULT_VALUE_OUT } }] });
  });

  it('should compile simple array', function () {
    compile({
      "array": "a",
      "path": [ "b" ]
    }).should.deepEqual({ '@a': { 'b': DEFAULT_VALUE_OUT } })

    compile({
      "path": [
        "a",
        {
          "glue": "OR",
          "list": [
            {
              "array": "b",
              "path": [ "c" ]
            },
            {
              "array": "d",
              "path": [ "e" ]
            }
          ]
        },
        "f"
      ]
    }).should.deepEqual({ $OR: { '@a.b': { 'c.f': DEFAULT_VALUE_OUT }, '@a.d': { 'e.f': DEFAULT_VALUE_OUT } } });

    compile({
      "path": [
        "a",
        {
          "glue": "OR",
          "list": [
            {
              "array": "b",
              "path": [
                {
                  "glue": "AND",
                  "list": [ "c", "d" ]
                }
              ]
            },
            {
              "array": "e",
              "path": [ "f" ]
            }
          ]
        },
        "g"
      ]
    }).should.deepEqual({ $OR: { '@a.b': { $AND: { 'c.g': DEFAULT_VALUE_OUT, 'd.g': DEFAULT_VALUE_OUT } }, '@a.e': { 'f.g': DEFAULT_VALUE_OUT} } })
  });

  it('should compile two arrays', function () {
    compile({
      "array": "a",
      "path": [
        {
          "array": "b",
          "path": [ "c" ]
        }
      ]
    }).should.deepEqual({ '@a': { '@b': { 'c': DEFAULT_VALUE_OUT } } });

    compile({
     "path": [
        "a",
        {
          "glue": "OR",
          "list": [
            {
              "array": "b",
              "path": [ "c" ]
            },
            {
              "array": "d",
              "path": [ "e" ]
            }
          ]
        },
        "f"
      ]
    }).should.deepEqual({ $OR: { '@a.b': { 'c.f': DEFAULT_VALUE_OUT }, '@a.d': { 'e.f': DEFAULT_VALUE_OUT } } });

    compile({
      "glue": "OR",
      "list": [
        {
          "array": "a",
          "path": [ "b" ]
        },
        {
          "array": "a",
          "path": [ "c" ]
        }
     ]
   }).should.deepEqual({ $OR: { '@a': { 'b': DEFAULT_VALUE_OUT, 'c': DEFAULT_VALUE_OUT } } });
  });


  it('should compile with optional operator', function () {
    compile({
      "path": [
        "a"
      ],
      "options": {
        "operator": "<>"
      }
    }).should.deepEqual({ 'a': { arguments: ['@1'], operator: '<>' } });

    compile({
      "path": [
        "a",
        {
          "glue": "OR",
          "list": [
            {
              "path": [ "b" ],
              "options": {
                "operator": "<"
              }
            },
            {
              "path": [ "b" ],
              "options": {
                "operator": ">"
              }
            }
          ]
        }
      ]
    }).should.deepEqual({
      $OR: {
        'a.b': [ { arguments: ['@1'], operator: '<' }, { arguments: ['@1'], operator: '>' } ]
      }
    });

    compile({
      "glue": "OR",
      "list": [
        {
          "path": ["a"],
          "options": {
            "operator": "<",
            "arguments": [1]
          }
        },
        {
          "path": ["a"],
          "options": {
            "operator": ">",
            "arguments": [2]
          }
        }
      ]
    }).should.deepEqual({
      $OR: {
        'a': [ { arguments: ['@1'], operator: '<' }, { arguments: ['@2'], operator: '>' } ]
      }
    });
  });




});
