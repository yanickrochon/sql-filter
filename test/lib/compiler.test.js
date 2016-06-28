

describe('Testing Compiler', function () {

  const compile = require('../../lib/compiler');

  it('should return simple value', function () {
    compile('a', 'test').should.deepEqual({ 'a': 'test' });
  })

  it('should compile simple path', function () {
    compile({
      path: [ "a", "b" ]
    }, 'test').should.deepEqual({ 'a.b': 'test' });
  });

  it('should compile simple list', function () {
    compile({
      glue: 'OR', list: [ 'a', 'b' ]
    }, 'test').should.deepEqual({ $OR: { 'a': 'test', 'b': 'test' } });
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
    }, 'test').should.deepEqual({ $OR: { 'a.b.c': 'test', 'a.b.d': 'test' } });
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
    }, 'test').should.deepEqual({ $OR: [{ $AND: { 'a.c': 'test', 'a.d': 'test' } }, { $AND: { 'b.c': 'test', 'b.d': 'test' } }] });

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
    }, 'test').should.deepEqual({ $AND: { 'a.b.d.e.f': 'test', 'a.c.d.e.f': 'test' } });

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
    }, 'test').should.deepEqual({ $AND: [{ $OR: { 'a.b.d.e.f': 'test', 'a.b.d.g': 'test' } }, { $OR: { 'a.c.d.e.f': 'test', 'a.c.d.g': 'test' } }] });
  });

  it('should compile simple array', function () {
    compile({
      "array": "a",
      "path": [ "b" ]
    }, 'test').should.deepEqual({ '@a': { 'b': 'test' } })

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
    }, 'test').should.deepEqual({ $OR: { '@a.b': { 'c.f': 'test' }, '@a.d': { 'e.f': 'test' } } });

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
    }, 'test').should.deepEqual({ $OR: { '@a.b': { $AND: { 'c.g': 'test', 'd.g': 'test' } }, '@a.e': { 'f.g': 'test'} } })
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
    }, 'test').should.deepEqual({ '@a': { '@b': { 'c': 'test' } } });

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
    }, 'test').should.deepEqual({ $OR: { '@a.b': { 'c.f': 'test' }, '@a.d': { 'e.f': 'test' } } });

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
   }, 'test').should.deepEqual({ $OR: { '@a': { 'b': 'test', 'c': 'test' } } });
  });

});
