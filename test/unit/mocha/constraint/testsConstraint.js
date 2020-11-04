const assert = require('assert');
const Constraint = require('../../../../src/js/constraint/constraint');
const logManager = require('../logManager');

describe('Test de la classe Constraint', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let type = "banned";
  let key = "waytype";
  let field = "acces_vehicule_leger";
  let operator = "=";
  let value = "autoroute";
  let condition = {
    "type": "equal",
    "value": "$niv4$A péage$niv4$"
  };

  let sqlResult = " NOT (acces_vehicule_leger=$niv4$A péage$niv4$)";


  let constraint = new Constraint(type, key, field, operator, value, condition);

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(constraint.type, type);
    });

    it('Get key', function() {
        assert.equal(constraint.key, key);
    });

    it('Get field', function() {
        assert.equal(constraint.field, field);
    });

    it('Get operator', function() {
        assert.equal(constraint.operator, operator);
    });

    it('Get value', function() {
        assert.equal(constraint.value, value);
    });

    it('Get condition', function() {
        assert.deepEqual(constraint.condition, condition);
    });


  });

  describe('Test de la conversion SQL', function() {

    it('toSqlString()', function() {
        assert.deepEqual(constraint.toSqlString(), sqlResult);
    });

  });


});
