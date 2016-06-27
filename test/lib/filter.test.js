
describe('Testing filter', function () {

  const builder = require('../../lib/filter');


  it('should create basic filter', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = 'a';
    const filter = builder(query, options);

    filter.toString().should.equal('a = %%VALUE%%');
    filter.apply('foo').should.equal("a = 'foo'");
    filter.apply(123).should.equal("a = 123");
  });

  it('should create OR filter', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = '{a,b}';
    const filter = builder(query, options);

    filter.toString().should.equal('a = %%VALUE%% OR b = %%VALUE%%');
    filter.apply('foo').should.equal("a = 'foo' OR b = 'foo'");
    filter.apply(123).should.equal("a = 123 OR b = 123");
  });

  it('should create array filter', function () {
    const options = {
      adatper: 'postgresql'
    };
    const query = 'a[].b';
    const filter = builder(query, options);
    
    filter.toString().should.equal("a IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a) AS _a WHERE _a->>'b' = %%VALUE%%::TEXT)");
    filter.apply('foo').should.equal("a IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a) AS _a WHERE _a->>'b' = 'foo'::TEXT)");
    filter.apply(123).should.equal("a IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(a) AS _a WHERE _a->>'b' = 123::TEXT)");
  });


});