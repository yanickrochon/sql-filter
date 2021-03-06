
describe('Testing filter', function () {

  const builder = require('../../lib/filter');


  it('should create basic filter', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = 'a';
    const filter = builder(query, options);

    filter.toString().should.equal('a = @1');
    filter.apply('foo').should.equal("a = 'foo'");
    filter.apply(123).should.equal("a = 123");
  });

  it('should create OR filter', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = '{a,b}';
    const filter = builder(query, options);

    filter.toString().should.equal('a = @1 OR b = @1');
    filter.apply('foo').should.equal("a = 'foo' OR b = 'foo'");
    filter.apply(123).should.equal("a = 123 OR b = 123");
  });

  it('should create AND filter', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = '{{a,b}}';
    const filter = builder(query, options);

    filter.toString().should.equal('a = @1 AND b = @1');
    filter.apply('foo').should.equal("a = 'foo' AND b = 'foo'");
    filter.apply(123).should.equal("a = 123 AND b = 123");
  });

  it('should create OR and AND filter', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = '{a,{{b,c}}}';
    const filter = builder(query, options);

    filter.toString().should.equal('a = @1 OR b = @1 AND c = @1');
    filter.apply('foo').should.equal("a = 'foo' OR b = 'foo' AND c = 'foo'");
    filter.apply(123).should.equal("a = 123 OR b = 123 AND c = 123");
  });

  it('should create array filter', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = 'a[].b';
    const filter = builder(query, options);

    filter.toString().should.equal("a IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a) AS _a WHERE _a->>'b' = @1::TEXT)");
    filter.apply('foo').should.equal("a IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a) AS _a WHERE _a->>'b' = 'foo'::TEXT)");
    filter.apply(123).should.equal("a IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a) AS _a WHERE _a->>'b' = 123::TEXT)");
  });

  it('should create with custom operator', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = 'a(>)';
    const filter = builder(query, options);

    filter.toString().should.equal('a > @1');
  });

  it('should create with multiple arguments', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = '{a(<,1),a(>,2)}';
    const filter = builder(query, options);

    filter.toString().should.equal('a < @1 OR a > @2');
    filter.apply(10, 30).should.equal('a < 10 OR a > 30');
  });

  it('should create with array and multiple arguments', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = 'properties[].{ name(ILIKE,1), value(>=,2) }';
    const filter = builder(query, options);

    filter.toString().should.equal('properties IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(properties) AS _properties WHERE _properties->>\'name\' ILIKE @1::TEXT OR _properties->>\'value\' >= @2::TEXT)');
    filter.apply('foo', 90).should.equal('properties IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(properties) AS _properties WHERE _properties->>\'name\' ILIKE \'foo\'::TEXT OR _properties->>\'value\' >= 90::TEXT)');
  });

  it('should not build with invalid adapter', function () {
    [
      undefined, null, NaN, true, false,
      -1, 0, 1, Infinity,
      [], {}, /./, function () {}
    ].forEach(function (adapter) {
      (function () { builder('a', { adapter: adapter }); }).should.throw();
    });
  });

  it('should not build with invalid value wrapper', function () {
    [
      undefined, null, NaN, true, false,
      -1, 0, 1, Infinity,
      '', 'foo',
      [], {}, /./
    ].forEach(function (wrapper) {
      (function () { builder('a', { valueWrapper: wrapper }); }).should.throw();
    });
  });

  it('should not build with invalid field wrapper', function () {
    [
      undefined, null, NaN, true, false,
      -1, 0, 1, Infinity,
      '', 'foo',
      [], {}, /./
    ].forEach(function (wrapper) {
      (function () { builder('a', { fieldWrapper: wrapper }); }).should.throw();
    });
  });

});
