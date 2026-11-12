const assert = require('assert');
const controller = require('../../../../src/js/apis/simple/1.0.0/controller/controller');

describe('Simple API controller', function() {

  describe('convertPostArrayToGetParameters', function() {

    it('rejects scalar values for exploded array parameters', function() {
      assert.throws(function() {
        controller.convertPostArrayToGetParameters('not-an-array', { explode: 'true' }, 'intermediates');
      }, function(error) {
        return error.status === 400;
      });
    });

    it('serializes each array value according to its own type', function() {
      const parameter = { explode: 'false', style: 'pipeDelimited' };
      const values = [1, { id: 2 }, null];

      assert.strictEqual(
        controller.convertPostArrayToGetParameters(values, parameter, 'constraints'),
        '1|{"id":2}|null'
      );
    });

  });

});
