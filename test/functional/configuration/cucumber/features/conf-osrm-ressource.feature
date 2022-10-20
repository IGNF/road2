# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: [osrm resource] resource absent
    Given a valid configuration 
    And without attribute "resource" in "data-osm.resource" resource
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    # TODO : avoir plusieurs ressources dans le dossier pour qu'une d'entre elles marche
    # Then the configuration analysis should give an exit code 0
    # Then the server log should contain "Erreur lors de la lecture de la ressource"

  Scenario: [osrm resource] id different
    Given a valid configuration 
    And with parameter "test" for attribute "resource.id" in "data-osm.resource" resource
    When I test the configuration
    Then the configuration analysis should give an exit code 0
