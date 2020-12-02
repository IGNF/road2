const assert = require('assert');
const LooseConstraint = require('../../../../src/js/constraint/looseConstraint');
const logManager = require('../logManager');

describe('Test de la classe LooseConstraint', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let type = "prefer";
  let key = "cpx_classement_administratif";
  let field = "cpx_classement_administratif";
  let operator = "=";
  let value = "autoroute";
  let condition = {
    "type": "like",
    "value": "$niv4$%Autoroute%$niv4$"
  };
  let ratio = 0.8;

  let sqlResult = "cpx_classement_administratif LIKE $niv4$%Autoroute%$niv4$";
  let costSQL = "CASE WHEN cpx_classement_administratif LIKE $niv4$%Autoroute%$niv4$ THEN 0.8 * cost_s_car ELSE cost_s_car END";
  let rcostSQL = "CASE WHEN cpx_classement_administratif LIKE $niv4$%Autoroute%$niv4$ THEN 0.8 * reverse_cost_s_car ELSE reverse_cost_s_car END";


  let looseConstraint = new LooseConstraint(type, key, field, operator, value, condition, ratio);

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(looseConstraint.type, type);
    });

    it('Get key', function() {
        assert.equal(looseConstraint.key, key);
    });

    it('Get field', function() {
        assert.equal(looseConstraint.field, field);
    });

    it('Get operator', function() {
        assert.equal(looseConstraint.operator, operator);
    });

    it('Get value', function() {
        assert.equal(looseConstraint.value, value);
    });

    it('Get condition', function() {
        assert.deepEqual(looseConstraint.condition, condition);
    });

    it('Get costRatio', function() {
      assert.deepEqual(looseConstraint.costRatio, ratio);
    });


  });

  describe('Test de la conversion SQL', function() {

    it('toSqlString()', function() {
        assert.deepEqual(looseConstraint._toSqlCondition(), sqlResult);
    });

    it('looseConstraintsToSQL()', function() {
      assert.deepEqual(LooseConstraint.looseConstraintsToSQL([looseConstraint], "cost_s_car", "reverse_cost_s_car"), [costSQL, rcostSQL]);
    });

  });


});
