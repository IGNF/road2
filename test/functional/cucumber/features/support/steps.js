const { Given, When, Then } = require("cucumber");
const assert = require('assert');

Given("I have loaded all my test configuration", function() {
    this.loadConfiguration();
});

Given("an {string} {string} request on {string}", function(protocol, method, path) {
    this.createRequest(protocol, method, path);
});

Given("with default parameters for {string}", function(operation) {
    assert.equal(this.useDefaultQueryParameters(operation), true);
});

Given('without query parameters:', function (table) {
    this.unsetQueryParameters(table.hashes());
});

Given('with query parameters:', function (table) {
    this.setQueryParameters(table.hashes());
});

Given('with table parameters for {string}:', function (key, table) {
    this.setTableParameters(key, table.hashes());
});

Given('with table parameters of object for {string}:', function (key, table) {
    this.setTableOfObjectParameters(key, table.hashes());
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

Then("the response should contain an attribute {string}", function(key) {
    assert.equal(this.checkResponseAttribut(key), true);
});

Then("the response should contain a string attribute {string}", function(key) {
    assert.equal(this.checkResponseAttributString(key), true);
});

Then("the response should not contain an attribute {string}", function(key) {
    assert.equal(this.checkResponseAttribut(key), false);
});