const { Given, When, Then, After } = require("cucumber");
const assert = require('assert');

After( function () {
    this.cleanTmpDirectory();
    // this.killChildProcess();
});

Given("I have loaded all my test configuration", function() {
    assert.equal(this.loadTestConfiguration(), true);
});

Given("a valid configuration", function() {
    assert.equal(this.readServerConfigurationFiles(), true);
});

Given("with {string} for command line parameter {string}", function(commandParameterValue, commandeParameterKey) {
    assert.equal(this.modifyCommandLineParameter(commandParameterValue, commandeParameterKey, "modify"), true);
});

Given("without parameter {string} in command line", function(commandeParameterKey) {
    assert.equal(this.modifyCommandLineParameter("", commandeParameterKey, "delete"), true);
});

// Given("with {string} for env variable {string}", function(envValue, envKey) {
//     assert.equal(this.modifyEnvVariable(envValue, envKey), true);
// });

Given("with parameter {string} for attribute {string} in server configuration", function(value, attribute) {
    this.modifyServerConfiguration(value, attribute, "", "server", "modify");
});

Given("with parameter {string} for attribute {string} in service configuration", function(value, attribute) {
    this.modifyServerConfiguration(value, attribute, "", "service", "modify");
});

Given("without attribute {string} in service configuration", function(attribute) {
    this.modifyServerConfiguration("", attribute, "", "service", "delete");
});

Given("without attribute {string} in server configuration", function(attribute) {
    this.modifyServerConfiguration("", attribute, "", "server", "delete");
});

Given("a file {string}", function(relativeFilePath) {
    this.createFile(relativeFilePath, "", true);
});

Given("a file {string} non readable", function(relativeFilePath) {
    this.createFile(relativeFilePath, "", false);
});

Given("an empty directory {string}", function(dirname) {
    this.createDir(dirname);
});

Given("a server configuration non readable", function() {
    this.nonReadableServerConfiguration();
});

Given("a wrong JSON file {string}", function(relativeFilePath) {
    this.createWrongJSONFile(relativeFilePath);
});

Given("with parameter {string} for attribute {string} in service log configuration", function(value, attribute) {
    this.modifyServerConfiguration(value, attribute, "", "log-service", "modify");
});

Given("without attribute {string} in service log configuration", function(attribute) {
    this.modifyServerConfiguration("", attribute, "", "log-service", "delete");
});

Given("with parameter {string} for attribute {string} in cors configuration", function(value, attribute) {
    this.modifyServerConfiguration(value, attribute, "", "cors", "modify");
});

Given("without attribute {string} in cors configuration", function(attribute) {
    this.modifyServerConfiguration("", attribute, "", "cors", "delete");
});

Given("with parameter {string} for attribute {string} in {string} resource", function(value, attribute, id) {
    this.modifyServerConfiguration(value, attribute, id, "resource", "modify");
});

Given("without attribute {string} in {string} resource", function(attribute, id) {
    this.modifyServerConfiguration("", attribute, id, "resource", "delete");
});

Given("with parameter {string} for attribute {string} in {string} projection", function(value, attribute, id) {
    this.modifyServerConfiguration(value, attribute, id, "projection", "modify");
});

Given("without attribute {string} in {string} projection", function(attribute, id) {
    this.modifyServerConfiguration("", attribute, id, "projection", "delete");
});

Given("with parameter {string} for attribute {string} in {string} operation", function(value, attribute, id) {
    this.modifyServerConfiguration(value, attribute, id, "operations", "modify");
});

Given("without attribute {string} in {string} operation", function(attribute, id) {
    this.modifyServerConfiguration("", attribute, id, "operations", "delete");
});

Given("with parameter {string} for attribute {string} in {string} parameter", function(value, attribute, id) {
    this.modifyServerConfiguration(value, attribute, id, "parameters", "modify");
});

Given("without attribute {string} in {string} parameter", function(attribute, id) {
    this.modifyServerConfiguration("", attribute, id, "parameters", "delete");
});

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
    assert.equal(this.returnCommandExitCode(), code);
});

Then("the server log should contain {string}", function(message) {
    assert.equal(this.findInServerLog(message), true);
});

Then("the server log should not contain {string}", function(message) {
    assert.equal(this.findInServerLog(message), false);
});

Then("the command log should not contain error", function() {
    assert.equal(this._stderr, "");
});

