
describe('Testing parser', function () {

  const parser = require('../../lib/parser');
  const parse = parser.parse;

  it('should parse simple query', function () {
    parse('a').should.deepEqual({ path: [ 'a' ] });
    parse('  a').should.deepEqual({ path: [ 'a' ] });
    parse('a  ').should.deepEqual({ path: [ 'a' ] });
    parse('a.b').should.deepEqual({ path: [ 'a', 'b' ] });
    parse(' a . b ').should.deepEqual({ path: [ 'a', 'b' ] });
    parse('  a.b.  c').should.deepEqual({ path: [ 'a', 'b', 'c' ] });
  });

  it('should fail with invalid query', function () {
    [
      null, undefined, '', '.',
      'a.',
      'a[]',
      'a b', 'a\nb'
    ].forEach(function (query) {
      (function () { parse(query); }).should.throw();
    });
  })

  it('should parse list query', function () {
    parse('{a}').should.deepEqual({ glue: 'OR', list: [ { path: [ 'a' ] } ] });
    parse('{ a }').should.deepEqual({ glue: 'OR', list: [ { path: [ 'a' ] } ] });
    parse('{a,b}').should.deepEqual({ glue: 'OR', list: [ { path: [ 'a' ] }, { path: [ 'b' ] } ] });
    parse('{ a , b }').should.deepEqual({ glue: 'OR', list: [ { path: [ 'a' ] }, { path: [ 'b' ] } ] });
    parse('{a,b,c}').should.deepEqual({ glue: 'OR', list: [ { path: [ 'a' ] }, { path: [ 'b' ] }, { path: [ 'c' ] } ] });
    parse('{{a}}').should.deepEqual({ glue: 'AND', list: [ { path: [ 'a' ] } ] });
    parse('{{ a }}').should.deepEqual({ glue: 'AND', list: [ { path: [ 'a' ] } ] });
    parse('{{a,b}}').should.deepEqual({ glue: 'AND', list: [ { path: [ 'a' ] }, { path: [ 'b' ] } ] });
    parse('{{ a , b }}').should.deepEqual({ glue: 'AND', list: [ { path: [ 'a' ] }, { path: [ 'b' ] } ] });
    parse('{{a,b,c}}').should.deepEqual({ glue: 'AND', list: [ { path: [ 'a' ] }, { path: [ 'b' ] }, { path: [ 'c' ] } ] });
    parse('{a,{{b}},{c,d}}').should.deepEqual({
      glue: 'OR',
      list: [
        { path: [ 'a' ] },
        {
          glue: 'AND',
          list: [ { path: [ 'b' ] } ]
        },
        {
          glue: 'OR',
          list: [ { path: [ 'c' ] }, { path: [ 'd' ] } ]
        }
      ]
    });
    parse('{ a , {{ b }} , { c , d }}').should.deepEqual({
      glue: 'OR',
      list: [
        { path: [ 'a' ] },
        {
          glue: 'AND',
          list: [ { path: [ 'b' ] } ]
        },
        {
          glue: 'OR',
          list: [ { path: [ 'c' ] }, { path: [ 'd' ] } ]
        }
      ]
    });
  });

  it('should fail with invalid list', function () {
    [
      '{}', '{{}}', '{{}', '{}}', '{', '{{', '}', '}}',
      '{a}}', '{{a}',
      '{a,}', '{{a,}}', '{a,b,}', '{{a,b,}}',
      '{a[]}', '{{a[]}}'
    ].forEach(function (query) {
      (function () { console.log(parse(query)); }).should.throw();
    });
  });

  it('should parse array query', function () {
    parse('a[].b').should.deepEqual({ array: 'a', path: [ 'b' ] });
    parse('a[].b.c').should.deepEqual({ array: 'a', path: [ 'b', 'c' ] });
    parse('a.b[].c').should.deepEqual({ path: [ 'a', { array: 'b', path: [ 'c' ] } ] });
    parse('a.b[].c.d').should.deepEqual({ path: [ 'a', { array: 'b', path: [ 'c', 'd' ] }] });
  });

  it('should fail with invalid array', function () {
    [
      '[', ']', '[]', '.[', '.]', '.[]',
      'a[', 'a]', 'a[]', 'a[].',
      'a.b[', 'a.b]', 'a.b[]', 'a.b[].'
    ].forEach(function (query) {
      (function () { console.log(parse(query)); }).should.throw();
    });
  });

  it('should parse compound query', function () {
    parse('a.b[].{ c.d[].e, f[].g[].h[].{{ i, j }} }.k').should.deepEqual({
      path: [
        'a',
        {
          array: 'b',
          path: [
            {
              glue: 'OR',
              list: [
                {
                  path: [
                    'c',
                    {
                      array: 'd',
                      path: [ 'e' ]
                    }
                  ]
                },
                {
                  array: 'f',
                  path: [
                    {
                      array: 'g',
                      path: [
                        {
                          array: 'h',
                          path: [
                            {
                              glue: 'AND',
                              list: [ { path: [ 'i' ] }, { path: [ 'j' ] } ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'k'
          ]
        }
      ]
    });
  });

  it('should parse with params', function () {
    parse('a(=)').should.deepEqual({ path: [ 'a' ], options: { operator: '=' } });
    parse(' a ( = ) ').should.deepEqual({ path: [ 'a' ], options: { operator: '=' } });
    parse(' a ( <=, 1 ) ').should.deepEqual({ path: [ 'a' ], options: { operator: '<=', arguments: [1] } });
    parse(' a ( FOOBAR!, 1 ,  10, 9999 ) ').should.deepEqual({ path: [ 'a' ], options: { operator: 'FOOBAR!', arguments: [1,10,9999] } });

    parse('a[].b(=)').should.deepEqual({ array: 'a', path: [ 'b' ], options: { operator: '=' } });
    parse(' a [] . b ( = ) ').should.deepEqual({ array: 'a', path: [ 'b' ], options: { operator: '=' } });
    parse(' a [] .  b ( <=, 1 ) ').should.deepEqual({ array: 'a', path: [ 'b' ], options: { operator: '<=', arguments: [1] } });
    parse(' a[].b ( FOOBAR!, 1 ,  10, 9999 ) ').should.deepEqual({ array: 'a', path: [ 'b' ], options: { operator: 'FOOBAR!', arguments: [1,10,9999] } });

  });

});
