# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: [log.json] (mainConf different)
    Given a valid configuration 
    And with parameter "test" for attribute "mainConf" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'mainConf.appenders' absent"

  Scenario: [log.json] (mainConf vide)
    Given a valid configuration 
    And with parameter "" for attribute "mainConf" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'mainConf' absent"

  Scenario: [log.json] (mainConf absent)
    Given a valid configuration 
    And without attribute "mainConf" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'mainConf' absent"

  Scenario: [log.json] (httpConf different)
    Given a valid configuration 
    And with parameter "test" for attribute "httpConf" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.level' absent"

  Scenario: [log.json] (httpConf vide)
    Given a valid configuration 
    And with parameter "" for attribute "httpConf" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf' absent"

  Scenario: [log.json] (httpConf absent)
    Given a valid configuration 
    And without attribute "httpConf" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf' absent"

  Scenario: [log.json] (httpConf.level different)
    Given a valid configuration 
    And with parameter "test" for attribute "httpConf.level" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [log.json] (httpConf.level vide)
    Given a valid configuration 
    And with parameter "" for attribute "httpConf.level" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.level' absent"

  Scenario: [log.json] (httpConf.level absent)
    Given a valid configuration 
    And without attribute "httpConf.level" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.level' absent"

  Scenario: [log.json] (httpConf.format different)
    Given a valid configuration 
    And with parameter "test" for attribute "httpConf.format" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [log.json] (httpConf.format vide)
    Given a valid configuration 
    And with parameter "" for attribute "httpConf.format" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.format' absent"

  Scenario: [log.json] (httpConf.format absent)
    Given a valid configuration 
    And without attribute "httpConf.format" in service log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.format' absent"
