const assert = require('assert');
const Distance = require('../../../src/js/geography/distance');
const logManager = require('../logManager');

describe('Test de la classe Distance', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let distance = new Distance(10, "meter");

  describe('Test du constructeur et des getters/setters', function() {

    it('Get value', function() {
      assert.equal(distance.value, 10);
    });

    it('Get unit', function() {
      assert.equal(distance.unit, "meter");
    });

  });

  describe('Test de la conversion', function() {

    it('Convert()', function() {
      assert.equal(distance.convert("kilometer"), true);
    });

  });


});
