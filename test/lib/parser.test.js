
describe('Testing parser', function () {

  const parser = require('../../lib/parser');
  const parse = parser.parse;

  it('should parse simple query', function () {
    parse('a').should.deepEqual('a');
    parse('a.b').should.deepEqual({ path: [ 'a', 'b' ] });
    parse('a[].b').should.deepEqual({ array: 'a', path: [ 'b' ] });
  });

  it('should fail with invalid query', function () {
    [
      null, undefined, '',
      'a.',
      'a[]',
      'a b', 'a\nb'
    ].forEach(function (query) {
      (function () { parse(query); }).should.throw();
    });
  })

  it('should parse list query', function () {
    parse('{a}').should.deepEqual({ glue: 'OR', list: [ 'a' ] });
    parse('{a,b}').should.deepEqual({ glue: 'OR', list: [ 'a', 'b' ] });
    parse('{a,b,c}').should.deepEqual({ glue: 'OR', list: [ 'a', 'b', 'c' ] });
    parse('{{a}}').should.deepEqual({ glue: 'AND', list: [ 'a' ] });
    parse('{{a,b}}').should.deepEqual({ glue: 'AND', list: [ 'a', 'b' ] });
    parse('{{a,b,c}}').should.deepEqual({ glue: 'AND', list: [ 'a', 'b', 'c' ] });
    parse('{a,{{b}},{c,d}}').should.deepEqual({
      glue: 'OR',
      list: [
        'a',
        {
          glue: 'AND',
          list: [ 'b' ]
        },
        {
          glue: 'OR',
          list: [ 'c', 'd' ]
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

});
