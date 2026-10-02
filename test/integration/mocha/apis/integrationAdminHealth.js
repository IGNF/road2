const assert = require('assert');
const http = require('http');
const express = require('express');
const adminRouter = require('../../../../src/js/apis/admin/1.0.0');

async function requestHealth(globalState) {
  const application = express();
  application.set('administrator', {
    async computeHealthRequest() {
      return {
        globalState,
        adminState: 'green',
        serviceStates: []
      };
    }
  });
  application.use('/admin/1.0.0', adminRouter);

  const server = application.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));

  try {
    return await new Promise((resolve, reject) => {
      const request = http.get({
        host: '127.0.0.1',
        port: server.address().port,
        path: '/admin/1.0.0/health'
      }, response => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', chunk => { body += chunk; });
        response.on('end', () => {
          resolve({ statusCode: response.statusCode, body: JSON.parse(body) });
        });
      });
      request.on('error', reject);
    });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

describe('Admin health endpoint status', function() {

  it('returns 200 only when every managed service is green', async function() {
    const greenResponse = await requestHealth('green');
    const orangeResponse = await requestHealth('orange');
    const redResponse = await requestHealth('red');

    assert.strictEqual(greenResponse.statusCode, 200);
    assert.strictEqual(greenResponse.body.state, 'green');
    assert.strictEqual(orangeResponse.statusCode, 503);
    assert.strictEqual(orangeResponse.body.state, 'orange');
    assert.strictEqual(redResponse.statusCode, 503);
    assert.strictEqual(redResponse.body.state, 'red');
  });

});
