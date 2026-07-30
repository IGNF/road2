const assert = require('assert');
const sinon = require('sinon');
const OperationManager = require('../../../../src/js/operations/operationManager');
const logManager = require('../logManager');

describe('Test de la classe OperationManager', function() {

  before(function() {
    logManager.manageLogs();
  });

  describe('Test de checkResourceOperationConfiguration', function() {

    it('Accepte une ressource sans date_time quand les parametres obligatoires sont presents', function() {
      let operationManager = new OperationManager();

      operationManager._checkedOperationId = ['route'];
      operationManager._checkedOperationConfiguration = {
        'route': {
          parameters: ['start', 'end', 'date_time'],
          optional_parameters: ['date_time']
        }
      };
      operationManager._parameterManager.checkResourceParameterConfiguration = sinon.stub().returns(true);

      let resourceOperationConfiguration = [
        {
          id: 'route',
          parameters: [
            { id: 'start' },
            { id: 'end' }
          ]
        }
      ];

      assert.equal(operationManager.checkResourceOperationConfiguration(resourceOperationConfiguration), true);
    });

    it('Refuse une ressource si un parametre obligatoire manque', function() {
      let operationManager = new OperationManager();

      operationManager._checkedOperationId = ['route'];
      operationManager._checkedOperationConfiguration = {
        'route': {
          parameters: ['start', 'end', 'date_time'],
          optional_parameters: ['date_time']
        }
      };
      operationManager._parameterManager.checkResourceParameterConfiguration = sinon.stub().returns(true);

      let resourceOperationConfiguration = [
        {
          id: 'route',
          parameters: [
            { id: 'start' }
          ]
        }
      ];

      assert.equal(operationManager.checkResourceOperationConfiguration(resourceOperationConfiguration), false);
    });

  });

});