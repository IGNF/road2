const assert = require('assert');
const Duration = require('../../../../src/js/time/duration');
const logManager = require('../logManager');

describe('Test de la classe Duration', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let value = 3600;
  let unit = "second";

  let duration = new Duration(value, unit);


  describe('Test du constructeur et des getters', function() {

    it('Get Value', function() {
      assert.equal(duration.value, value);
    });

    it('Get Unit', function() {
        assert.equal(duration.unit, unit);
    });

  });

  describe('Test des conversions', function() {

    it('Convert() sans unit ne doit pas marcher', function() {
        assert.equal(duration.convert(), false);
    });

    it('Convert(test) ne doit pas marcher', function() {
        assert.equal(duration.convert("test"), false);
    });

    it('Convert(second)', function() {
        assert.equal(duration.convert("second"), true);
        assert.equal(duration.value, 3600);
    });

    it('Convert(minute)', function() {
        assert.equal(duration.convert("minute"), true);
        assert.equal(duration.value, 60);
    });

    it('Convert(hour)', function() {
        assert.equal(duration.convert("hour"), true);
        assert.equal(duration.value, 1);
    });

    it('Convert(standard)', function() {
        assert.equal(duration.convert("standard"), true);
        assert.equal(duration.value, "01:00:00");
    });

  });

});
