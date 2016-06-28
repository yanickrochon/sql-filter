

describe('Testing PostgreSQL adapter', function () {

  const adapter = require('../../../lib/adapter/postgresql');
  const build = adapter.build;
  const value = adapter.formatValue;

  const options = {
    operator: '=',
    fieldWrapper: function (f) { return f; },
    valueWrapper: function (v) { return v; }
  };
  const placeholder = '?';

  it('should format data types', function () {
    value('foo').should.equal("'foo'");
    value(123).should.equal('123');
    value(false).should.equal('false');
    value(true).should.equal('true');
    value(null).should.equal('null');
    value(undefined).should.equal('null');
    value({ foo: 'bar' }).should.equal('\'{"foo":"bar"}\'');
    value([1,2,3]).should.equal('\'[1,2,3]\'');
  })

  it('should build simple query', function () {
    build({ 'a': placeholder }, options).should.equal('a = ?');
    build({ 'a.b': placeholder }, options).should.equal("a->>'b' = ?::TEXT");
    build({ 'a.b.c': placeholder }, options).should.equal("a->b->>'c' = ?::TEXT");
  });

  it('should build OR query', function () {
    build({ $OR: { 'a': placeholder, 'b': placeholder } }, options).should.equal('a = ? OR b = ?');
    build({ $OR: { 'a.b': placeholder, 'c.d': placeholder } }, options).should.equal("a->>'b' = ?::TEXT OR c->>'d' = ?::TEXT");
    build({ $OR: { 'a.b.c': placeholder, 'd.e.f': placeholder, 'g.h.i': placeholder } }, options).should.equal("a->b->>'c' = ?::TEXT OR d->e->>'f' = ?::TEXT OR g->h->>'i' = ?::TEXT");
  })

  it('should build AND query', function () {
    build({ $AND: { 'a': placeholder, 'b': placeholder } }, options).should.equal('a = ? AND b = ?');
    build({ $AND: { 'a.b': placeholder, 'c.d': placeholder } }, options).should.equal("a->>'b' = ?::TEXT AND c->>'d' = ?::TEXT");
    build({ $AND: { 'a.b.c': placeholder, 'd.e.f': placeholder, 'g.h.i': placeholder } }, options).should.equal("a->b->>'c' = ?::TEXT AND d->e->>'f' = ?::TEXT AND g->h->>'i' = ?::TEXT");
  });

  it('should build array query', function () {
    build({ '@a': { 'b': placeholder } }, options).should.equal("a IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a) AS _a WHERE _a->>'b' = ?::TEXT)");
    build({ $OR: { '@a.b': { 'c.f': placeholder }, '@a.d': { 'e.f': placeholder } } }, options).should.equal("a->'b' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'b') AS _ab WHERE _ab->c->>'f' = ?::TEXT) OR a->'d' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'d') AS _ad WHERE _ad->e->>'f' = ?::TEXT)");
  });

  it('should build compound query', function () {
    build({ $OR: { '@a.b': { $AND: { 'c.g': placeholder, '@d.g': { $OR: { 'x': placeholder, '@y': { 'z': placeholder } } } } }, '@a.e': { 'f.g': placeholder } }, 'h.i.j': placeholder }, options).should.equal("a->'b' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'b') AS _ab WHERE _ab->c->>'g' = ?::TEXT AND _ab->d->'g' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(_ab->d->'g') AS _abdg WHERE _abdg->>'x' = ?::TEXT OR _abdg->'y' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(_abdg->'y') AS _abdgy WHERE _abdgy->>'z' = ?::TEXT))) OR a->'e' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'e') AS _ae WHERE _ae->f->>'g' = ?::TEXT) OR h->i->>'j' = ?::TEXT");
  });

});
