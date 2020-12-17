# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: Configuration correcte
    Given a valid configuration 
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "La vérification de la configuration est terminée"
    Then the server log should not contain error

  Scenario: Modification du server.json (application different)
    Given a valid configuration 
    And with parameter "test" for attribute "application" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs' absent"

  Scenario: Modification du server.json (application vide)
    Given a valid configuration 
    And with parameter "" for attribute "application" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application' absent"

  Scenario: Modification du server.json (application absent)
    Given a valid configuration 
    And without attribute "application" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application' absent"

  Scenario: Modification du server.json (application.logs different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.logs" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs.configuration' absent"

  Scenario: Modification du server.json (application.logs vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.logs" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs' absent"

  Scenario: Modification du server.json (application.logs absent)
    Given a valid configuration 
    And without attribute "application.logs" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs' absent"

  Scenario: Modification du server.json (application.logs.configuration different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: fichier de configuration des logs inexistant"

  Scenario: Modification du server.json (application.logs.configuration vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs.configuration' absent"

  Scenario: Modification du server.json (application.logs.configuration absent)
    Given a valid configuration 
    And without attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs.configuration' absent"

  Scenario: Modification du server.json (application.logs.configuration sur un fichier non lisible)
    Given a valid configuration 
    And a file "file.json" non readable
    And with parameter "file.json" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs"

  Scenario: Modification du server.json (application.logs.configuration sur un fichier vide)
    Given a valid configuration 
    And a file "file.json" 
    And with parameter "file.json" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs"

  Scenario: Modification du server.json (application.logs.configuration sur un fichier incorrect)
    Given a valid configuration 
    And a wrong JSON file "file.json" 
    And with parameter "file.json" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs"

  Scenario: Modification du server.json (name different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: Modification du server.json (name vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1

  Scenario: Modification du server.json (name absent)
    Given a valid configuration 
    And without attribute "application.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1

  Scenario: Modification du server.json (title different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.title" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: Modification du server.json (title vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.title" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1

  Scenario: Modification du server.json (title absent)
    Given a valid configuration 
    And without attribute "application.title" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1

# tester les options de lancement (configCheck et ROAD2_CONF_FILE)
# tester sans certains fichiers ( proj.json, resource.json)
# modifier les parametres de chaque fichier 

