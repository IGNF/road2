const assert = require('assert');
const Administrator = require('../../../../src/js/administrator/administrator');
const { startServicesThenAdmin } = require('../../../../src/js/road2');

describe('Road2 startup ordering', function() {

  it('starts the admin API before the initial service startup attempt', async function() {
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
      'admin:ready',
      'services:start',
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

});
