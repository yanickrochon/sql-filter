
describe('Testing Adapter Interface', function () {

  const Adapter = require('../../../lib/adapter/adapter');


  it('should return identity field by default', function () {
    var adapter = new Adapter();

    [
      'foo', 'foo.bar'
    ].forEach(function (field) {
      (adapter.formatField(field) === field).should.be.true;
    });
  });

  it('should fail with invalid field', function () {
    var adapter = new Adapter();

    [
      undefined, null, false, true, NaN,
      -1, 0, 1, Infinity,
      '', {}, [], function () {}, /./
    ].forEach(function (field) {
      (function () { adapter.formatField(field); }).should.throw();
    });
  });

  it('should return identity value by default', function () {
    var adapter = new Adapter();

    [
      undefined, null, false, true, NaN,
      -1, 0, 1, Infinity,
      '', 'foo', {}, [], function () {}, /./
    ].forEach(function (value) {
      (adapter.formatValue(value) === value).should.be.true;
    });
  });

  it('should throw if "build" is not implemented', function () {
    var adapter = new Adapter();

    (function () { adapter.build('a'); }).should.throw('Not implemented');
  });

  it('should register and unregister custom operator handlers', function () {
    var adapter = new Adapter();
    var symbol = Object.getOwnPropertySymbols(adapter).filter(function (sym) {
      return sym.toString() === 'Symbol(customOperators)';
    }).pop();

    adapter.registerOperatorHandler('TEST', function () {});
    adapter[symbol].should.have.ownProperty('TEST').and.be.instanceOf(Function);

    adapter.unregisterOperatorHandler('TEST');
    (typeof adapter[symbol]['TEST']).should.equal('undefined');
  });

  it('should fail registering invalid operator', function () {
    var adapter = new Adapter();
    [
      undefined, null, false, true, NaN,
      -1, 0, 1, Infinity,
      '', {}, [], function () {}, /./
    ].forEach(function (operator) {
      (function () { adapter.registerOperatorHandler(operator, function () {}); }).should.throw();
    });
  });

  it('should fail registering invalid operator handler', function () {
    var adapter = new Adapter();
    [
      undefined, null, false, true, NaN,
      -1, 0, 1, Infinity,
      '', 'foo', {}, [], /./
    ].forEach(function (handler) {
      (function () { adapter.registerOperatorHandler('=', handler); }).should.throw();
    });
  });

  it('should fail unregistering invalid operator', function () {
    var adapter = new Adapter();
    [
      undefined, null, false, true, NaN,
      -1, 0, 1, Infinity,
      '', {}, [], function () {}, /./
    ].forEach(function (operator) {
      (function () { adapter.unregisterOperatorHandler(operator); }).should.throw();
    });
  });

});
