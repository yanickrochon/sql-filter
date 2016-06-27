

describe('Testing PostgreSQL adapter', function () {

  const adapter = require('../../../lib/adapter/postgresql');
  const build = adapter.build;

  const options = {
    operator: '=',
    fieldWrapper: function (f) { return f; },
    valueWrapper: function (v) { return v; }
  };
  const value = '?';

  it('should build simple query', function () {
    build({ 'a': value }, options).should.equal('a = ?');
    build({ 'a.b': value }, options).should.equal("a->>'b' = ?::TEXT");
    build({ 'a.b.c': value }, options).should.equal("a->b->>'c' = ?::TEXT");
  });

  it('should build OR query', function () {
    build({ $OR: { 'a': value, 'b': value } }, options).should.equal('a = ? OR b = ?');
    build({ $OR: { 'a.b': value, 'c.d': value } }, options).should.equal("a->>'b' = ?::TEXT OR c->>'d' = ?::TEXT");
    build({ $OR: { 'a.b.c': value, 'd.e.f': value, 'g.h.i': value } }, options).should.equal("a->b->>'c' = ?::TEXT OR d->e->>'f' = ?::TEXT OR g->h->>'i' = ?::TEXT");
  })

  it('should build AND query', function () {
    build({ $AND: { 'a': value, 'b': value } }, options).should.equal('a = ? AND b = ?');
    build({ $AND: { 'a.b': value, 'c.d': value } }, options).should.equal("a->>'b' = ?::TEXT AND c->>'d' = ?::TEXT");
    build({ $AND: { 'a.b.c': value, 'd.e.f': value, 'g.h.i': value } }, options).should.equal("a->b->>'c' = ?::TEXT AND d->e->>'f' = ?::TEXT AND g->h->>'i' = ?::TEXT");
  });

  it('should build array query', function () {
    build({ '@a': { 'b': value } }, options).should.equal("a IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a) AS _a WHERE _a->>'b' = ?::TEXT)");
    build({ $OR: { '@a.b': { 'c.f': value }, '@a.d': { 'e.f': value } } }, options).should.equal("a->'b' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'b') AS _ab WHERE _ab->c->>'f' = ?::TEXT) OR a->'d' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'d') AS _ad WHERE _ad->e->>'f' = ?::TEXT)");
  });

  it('should build compound query', function () {
    build({ $OR: { '@a.b': { $AND: { 'c.g': value, '@d.g': { $OR: { 'x': value, '@y': { 'z': value } } } } }, '@a.e': { 'f.g': value } }, 'h.i.j': value }, options).should.equal("a->'b' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'b') AS _ab WHERE _ab->c->>'g' = ?::TEXT AND _ab->d->'g' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(_ab->d->'g') AS _abdg WHERE _abdg->>'x' = ?::TEXT OR _abdg->'y' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(_abdg->'y') AS _abdgy WHERE _abdgy->>'z' = ?::TEXT))) OR a->'e' IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a->'e') AS _ae WHERE _ae->f->>'g' = ?::TEXT) OR h->i->>'j' = ?::TEXT");
  });

});