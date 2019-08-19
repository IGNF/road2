const { Given, When, Then } = require("cucumber");
const assert = require('assert');

Given("I have loaded all my test configuration", function() {
    this.loadConfiguration();
});

Given("an {string} {string} request on {string}", function(protocol, method, path) {
    this.createRequest(protocol, method, path);
});
  
When("I send the request", function(done) {
    this.sendRequest()
    .then(() => {
        done();
    })
    .catch((error) => {
        done(error);
    });

});
  
Then("the server should send a response with status {int}", function(status) {
    assert.equal(this.verifyResponseStatus(status), true);
});

Then("the response should contain {string}", function(message) {
    assert.equal(this.verifyRawResponseContent(message), true);
});

Then("the response should have an header {string} with value {string}", function(key, value) {
    assert.equal(this.checkHeaderContent(key, value), true);
});

Then("the response should contain an attribute {string} with value {string}", function(key, value) {
    assert.equal(this.checkResponseContent(key, value), true);
});