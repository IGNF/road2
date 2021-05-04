const { Given, When, Then } = require("cucumber");
const assert = require('assert');

Given("I have loaded all my test configuration in {string}", function(configurationPath) {
    this.loadConfiguration(configurationPath);
});

Given("an {string} request on {string}", function(method, path) {
    this.createRequest(method, path);
});

Given("an {string} request on operation {string} in api {string} {string}", function(method, operationId, apiId, version) {
    this.createRequestOnApi(method, operationId, apiId, version);
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

Given('with {string} at the end of the url', function (key) {
    this.setStringToUrl(key);
});

When("I send the request", function(done) {
    this.sendRequest()
    .then((response) => {
        this.saveResponse(response);
        done();
    })
    .catch((error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            this.saveResponse(error.response);
            done();
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            done(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            done(error.message);
        }
    });

});
  
Then("the server should send a response with status {int}", function(status) {
    assert.equal(this.verifyResponseStatus(status), true);
});

Then("the response should contain {string}", function(message) {
    assert.equal(this.verifyRawResponseContent(message), true);
});

Then("the response should contain a complete and valid road", function() {
    assert.equal(this.checkCompleteRoad(), true);
});

Then("the response should contain a complete and valid iso", function() {
    assert.equal(this.checkCompleteIso(), true);
});

Then("the response should have an header {string} with value {string}", function(key, value) {
    assert.equal(this.checkHeaderContent(key, value), true);
});

Then("the response should contain an attribute {string} with value {string}", function(key, value) {
    assert.equal(this.checkResponseContent(key, value), true);
});

Then("the road should be similar to {string}", function(path) {
    assert.equal(this.checkRoadContent(path), true);
});

Then("the iso should be similar to {string}", function(path) {
    assert.equal(this.checkIsoContent(path), true);
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