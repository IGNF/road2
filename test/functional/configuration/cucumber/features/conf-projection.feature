# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: [projection.json] JSON invalide
    Given a valid configuration 
    And a wrong JSON file "./projections/test.json"
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de projection"

  Scenario: [projection.json] JSON vide
    Given a valid configuration 
    And without attribute "projectionsList" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La fichier des projections ne contient pas de liste"

  Scenario: [projection.json] projectionsList absent
    Given a valid configuration 
    And without attribute "projectionsList" in "projection.json" projection
    And with parameter "test" for attribute "projections" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La fichier des projections ne contient pas de liste"

  Scenario: [projection.json] projectionsList different
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'attribut projectionsList de la configuration n'est pas un tableau"

  Scenario: [projection.json] projectionsList est un tableau vide
    Given a valid configuration 
    And without attribute "projectionsList.[6]" in "projection.json" projection
    And without attribute "projectionsList.[5]" in "projection.json" projection
    And without attribute "projectionsList.[4]" in "projection.json" projection
    And without attribute "projectionsList.[3]" in "projection.json" projection
    And without attribute "projectionsList.[2]" in "projection.json" projection
    And without attribute "projectionsList.[1]" in "projection.json" projection
    And without attribute "projectionsList.[0]" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'attribut projectionsList de la configuration est un tableau vide"

  Scenario: [projection.json] une configuration de projection vide
    Given a valid configuration 
    And without attribute "projectionsList.[0].id" in "projection.json" projection
    And without attribute "projectionsList.[0].parameters" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas d'id"

  Scenario: [projection.json] une configuration de projection sans id
    Given a valid configuration 
    And without attribute "projectionsList.[0].id" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas d'id"

  Scenario: [projection.json] une configuration de projection sans parametre
    Given a valid configuration 
    And without attribute "projectionsList.[0].parameters" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas de parametres"

  Scenario: [projection.json] une configuration de projection différentes
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList.[0]" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas d'id"

  Scenario: [projection.json] projection.id différent pour une projection inutilisée dans les topologies
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList.[2].id" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [projection.json] projection.id différent pour une projection utilisée dans les topologies
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList.[0].id" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1

  Scenario: [projection.json] projection.id vide
    Given a valid configuration 
    And with parameter "" for attribute "projectionsList.[2].id" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas d'id"

  #TODO : Voir si on peut mieux vérifier 
  Scenario: [projection.json] projection.parameters différent
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList.[0].parameters" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [projection.json] projection.parameters vide
    Given a valid configuration 
    And with parameter "" for attribute "projectionsList.[0].parameters" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas de parametres"
