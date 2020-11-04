const assert = require('assert');
const copyManager = require('../../../../src/js/utils/copyManager');
const logManager = require('../logManager');

describe('Test du copyManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction deepCopy()', function() {

    let objectToCopy = {
        "test": "string",
        "nombre": 1,
        "myArray" : [
            "item"
        ],
        "myObject": {
            "key": "value"
        }
    };

    let resultedObject;

    it('deepCopy() with an object', function() {
        resultedObject = copyManager.deepCopy(objectToCopy);
        assert.deepEqual(objectToCopy, resultedObject);
    });

  });

});
