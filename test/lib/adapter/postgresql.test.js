

describe('Testing PostgreSQL adapter', function () {

  const adapter = require('../../../lib/adapter/postgresql');
  const build = adapter.build.bind(adapter);
  const value = adapter.formatValue;

  const options = {
    operator: '=',
    fieldWrapper: function (f) { return f; },
    valueWrapper: function (v) { return v; }
  };
  const placeholder = { arguments: [1] };

  it('should format data types', function () {
    value('foo').should.equal("'foo'");
    value(123).should.equal('123');
    value(false).should.equal('false');
    value(true).should.equal('true');
    value(null).should.equal('null');
    value(undefined).should.equal('null');
    value({ foo: 'bar' }).should.equal('\'{"foo":"bar"}\'');
    value([1,2,3]).should.equal('\'[1,2,3]\'');
    value(Symbol('$1')).should.equal('$1');
    value(Symbol.for('$2')).should.equal('$2');
  })

  it('should build simple query', function () {
    build({ 'a': placeholder }, options).should.equal('a = @1');
    build({ 'a.b': placeholder }, options).should.equal("a->>'b' = @1::TEXT");
    build({ 'a.b.c': placeholder }, options).should.equal("a->b->>'c' = @1::TEXT");
  });

  it('should build OR query', function () {
    build({ $OR: { 'a': placeholder, 'b': placeholder } }, options).should.equal('a = @1 OR b = @1');
    build({ $OR: { 'a.b': placeholder, 'c.d': placeholder } }, options).should.equal("a->>'b' = @1::TEXT OR c->>'d' = @1::TEXT");
    build({ $OR: { 'a.b.c': placeholder, 'd.e.f': placeholder, 'g.h.i': placeholder } }, options).should.equal("a->b->>'c' = @1::TEXT OR d->e->>'f' = @1::TEXT OR g->h->>'i' = @1::TEXT");
    build({ $OR: [ { 'a': placeholder }, { 'a': placeholder } ] }).should.equal('a = @1 OR a = @1');
  })

  it('should build AND query', function () {
    build({ $AND: { 'a': placeholder, 'b': placeholder } }, options).should.equal('a = @1 AND b = @1');
    build({ $AND: { 'a.b': placeholder, 'c.d': placeholder } }, options).should.equal("a->>'b' = @1::TEXT AND c->>'d' = @1::TEXT");
    build({ $AND: { 'a.b.c': placeholder, 'd.e.f': placeholder, 'g.h.i': placeholder } }, options).should.equal("a->b->>'c' = @1::TEXT AND d->e->>'f' = @1::TEXT AND g->h->>'i' = @1::TEXT");
  });

  it('should build array query', function () {
    build({ '@a': { 'b': placeholder } }, options).should.equal("a IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a) AS _a WHERE _a->>'b' = @1::TEXT)");
    build({ $OR: { '@a.b': { 'c.f': placeholder }, '@a.d': { 'e.f': placeholder } } }, options).should.equal("a->'b' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'b') AS _ab WHERE _ab->c->>'f' = @1::TEXT) OR a->'d' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'d') AS _ad WHERE _ad->e->>'f' = @1::TEXT)");
  });

  it('should build compound query', function () {
    build({ $OR: { '@a.b': { $AND: { 'c.g': placeholder, '@d.g': { $OR: { 'x': placeholder, '@y': { 'z': placeholder } } } } }, '@a.e': { 'f.g': placeholder } }, 'h.i.j': placeholder }, options).should.equal("a->'b' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'b') AS _ab WHERE _ab->c->>'g' = @1::TEXT AND _ab->d->'g' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(_ab->d->'g') AS _abdg WHERE _abdg->>'x' = @1::TEXT OR _abdg->'y' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(_abdg->'y') AS _abdgy WHERE _abdgy->>'z' = @1::TEXT))) OR a->'e' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'e') AS _ae WHERE _ae->f->>'g' = @1::TEXT) OR h->i->>'j' = @1::TEXT");
  });

  describe('Operators', function() {

    it('should register operator', function () {
      adapter.registerOperatorHandler('Test', function (field, oper, args) {
        return 'TEST(' + field + ',' + args.join(',') + ')';
      });
      build({ 'a': { operator: 'test' }}).should.equal('TEST(a,@1)');
      adapter.unregisterOperatorHandler('TeSt');
      build({ 'a': { operator: 'test' }}).should.equal('a test @1');
    });

    it('should validate BETWEEN operator', function () {
      build({ 'a': { operator: 'between', arguments: [1, 2] }}).should.equal('a BETWEEN @1 AND @2');
    });

    it('should fail if BETWEEN has not enough arguments', function () {
      (function () { build({ 'a': { operator: 'between', arguments: [1] }}); }).should.throw('Found 1 arguments, but required 2');
    });

  });

});
