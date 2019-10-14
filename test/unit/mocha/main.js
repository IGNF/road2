var assert = require('assert');

describe('Test de mocha', function() {
  describe('Test d\'une fonction JavaScript', function() {
    it('IndexOf should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});
