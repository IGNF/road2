const assert = require('assert');
const HttpQuery = require('../../../../src/js/utils/httpQuery');
const logManager = require('../logManager');

describe('Test de httpQuery', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction get()', () => {
    let httpQuery = new HttpQuery({prefixUrl: "https://httpbin.org/status"});

    it('httpQuery.get should return a valid response', () => {
      return httpQuery.get("200").then( (response) => {
        assert.equal(response.statusCode, 200);
      }).catch( () => {
        assert.equal(false, true);
      });
    });

    it('httpQuery.get should return an error', () => {
      return httpQuery.get("400").then( () => {
        assert.equal(false, true);
      }).catch( (error) => {
        assert.equal(error.response.statusCode, 400);
      });
    });
  });

  describe('Test de la fonction post()', () => {
    let httpQuery = new HttpQuery();
    const test = 'grand_fou';

    it('httpQuery.post should return a valid response', () => {
      return httpQuery.post("https://httpbin.org/post", {body: test}).then( (response) => {
        assert.equal(response.statusCode, 200);
        assert.equal(JSON.parse(response.body).data, test);
      }).catch( () => {
        assert.equal(false, true);
      });
    });

    it('httpQuery.post should return an error', () => {
      return httpQuery.post("https://httpbin.org/status/500").then( () => {
        assert.equal(false, true);
      }).catch( (error) => {
        assert.equal(error.response.statusCode, 500);
      });
    });
  });
});
