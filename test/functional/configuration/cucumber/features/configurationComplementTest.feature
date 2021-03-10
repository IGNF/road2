# Tests fonctionnels de Road2 sur la configuration du serveur pour les cas particuliers suivants: 
# - problèmes dans la configuration mais on veut que le service démarre quand même 

Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

Scenario: [osrm resource] resource absent
    Given a valid configuration 
    And without attribute "resource" in "corse.resource" resource
    When I load the server
    Then the server log should contain "Les demarrages se sont bien deroules"

