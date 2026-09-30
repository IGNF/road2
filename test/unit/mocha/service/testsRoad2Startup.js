const assert = require('assert');
const { startServicesThenAdmin } = require('../../../../src/js/road2');

describe('Road2 startup ordering', function() {

  it('starts the admin API only after the initial service startup attempt', async function() {
    const events = [];
    const administrator = {
      async createServices() {
        events.push('services:start');
        await Promise.resolve();
        events.push('services:complete');
        return true;
      },
      createServer() {
        events.push('admin:start');
        return true;
      }
    };

    const result = await startServicesThenAdmin(administrator);

    assert.deepStrictEqual(events, [
      'services:start',
      'services:complete',
      'admin:start'
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

});
