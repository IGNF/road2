const assert = require('assert');
const Administrator = require('../../../../src/js/administrator/administrator');
const { startServicesThenAdmin } = require('../../../../src/js/road2');

describe('Road2 startup ordering', function() {

  it('starts service initialization while the admin API binds', async function() {
    const events = [];
    const administrator = {
      async createServices() {
        events.push('services:start');
        await Promise.resolve();
        events.push('services:complete');
        return true;
      },
      async createServer() {
        events.push('admin:start');
        await Promise.resolve();
        events.push('admin:ready');
        return true;
      }
    };

    const result = await startServicesThenAdmin(administrator);

    assert.deepStrictEqual(events, [
      'admin:start',
      'services:start',
      'admin:ready',
      'services:complete'
    ]);
    assert.deepStrictEqual(result, {
      servicesStarted: true,
      adminServerStarted: true
    });
  });

  it('still starts the admin API after a failed service startup attempt', async function() {
    let adminServerStarted = false;
    const administrator = {
      async createServices() {
        return false;
      },
      createServer() {
        adminServerStarted = true;
        return true;
      }
    };

    const result = await startServicesThenAdmin(administrator);

    assert.strictEqual(result.servicesStarted, false);
    assert.strictEqual(adminServerStarted, true);
  });

  it('waits for and propagates the administrator server startup result', async function() {
    const administrator = Object.create(Administrator.prototype);
    administrator._configuration = {
      administration: {
        api: {},
        network: { server: {} }
      }
    };
    administrator._logConfiguration = {
      httpConf: { level: 'info', format: ':method :url' }
    };
    administrator._apisManager = {
      loadApiConfiguration() {
        return true;
      }
    };
    administrator._serverManager = {
      loadServerConfiguration() {
        return true;
      },
      async startAllServers() {
        return false;
      }
    };

    const result = await administrator.createServer();

    assert.strictEqual(result, false);
  });

  it('queues and coalesces restart requests until initial service startup finishes', async function() {
    const administrator = Object.create(Administrator.prototype);
    administrator._restartPromises = new Map();
    administrator._configuration = {
      administration: { services: [] }
    };

    let finishServices;
    administrator._createServices = function() {
      return new Promise(resolve => {
        finishServices = resolve;
      });
    };
    const startupPromise = administrator.createServices();

    const restartService = administrator._restartService.bind(administrator);
    let restartAttempts = 0;
    administrator._restartService = async serviceId => {
      restartAttempts += 1;
      return restartService(serviceId);
    };

    const firstRestart = administrator.restartService('main');
    const secondRestart = administrator.restartService('main');
    let restartSettled = false;
    const restartResults = Promise.all([
      firstRestart.catch(error => error),
      secondRestart.catch(error => error)
    ]).then(results => {
      restartSettled = true;
      return results;
    });

    await Promise.resolve();
    assert.strictEqual(restartSettled, false);
    assert.strictEqual(restartAttempts, 1);

    finishServices(true);
    await startupPromise;
    const errors = await restartResults;

    assert.strictEqual(restartSettled, true);
    assert.strictEqual(restartAttempts, 1);
    assert.match(errors[0].message, /Can't find service main/);
    assert.strictEqual(errors[1], errors[0]);
  });

});
