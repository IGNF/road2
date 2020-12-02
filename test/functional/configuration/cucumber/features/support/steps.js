const { Given, When, Then } = require("cucumber");
const assert = require('assert');

Given("I have loaded all my test configuration", function() {
    assert.equal(this.loadTestConfiguration(), true);
});

Given("a valid configuration", function() {
    assert.equal(this.readServerConfigurationFiles(), true);
});

// Given("with parameter {string} for {string} in {string} configuration", function(value, attribute, object) {
//     this.modifyServerConfiguration(value, attribute, object);
// });

// Given("with parameter {string} for {string} in {string} resource", function(value, attribute, id) {
//     this.modifyServerConfiguration(value, attribute, id);
// });

// When("I load the server", function(done) {
//     this.loadServer()
//     .then(() => {
//         done();
//     })
//     .catch((error) => {
//         done(error);
//     });

// });

When("I test the configuration", function(done) {
    this.testConfiguration()
    .then(() => {
        done();
    })
    .catch((error) => {
        done(error);
    });

});
  
Then("the configuration analysis should give an exit code {int}", function(code) {
    assert.equal(this.verifyCommandExitCode(code), true);
});

// Then("the server log should contain {string}", function(message) {
//     assert.equal(this.findInServerLog(message), true);
// });

// Then("the server log should not contain {string}", function(message) {
//     assert.equal(this.findInServerLog(message), false);
// });

