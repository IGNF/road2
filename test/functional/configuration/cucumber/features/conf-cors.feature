# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: [cors.json] Contenu different
    Given a valid configuration 
    And with parameter "127.0.0.1" for attribute "origin" in cors configuration
    And with parameter "GET,POST" for attribute "methods" in cors configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    And the command log should not contain error

  Scenario: [cors.json] Contenu mauvais
    Given a valid configuration 
    And with parameter "TEST" for attribute "methods" in cors configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    And the command log should not contain error
