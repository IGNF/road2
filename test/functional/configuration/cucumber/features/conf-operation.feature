# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: [operations] id différent
    Given a valid configuration 
    And with parameter "test" for attribute "id" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation indiquee n'est pas disponible"

  Scenario: [operations] id vide
    Given a valid configuration 
    And with parameter "" for attribute "id" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'id"

  Scenario: [operations] id absent
    Given a valid configuration 
    And without attribute "id" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'id"

  Scenario: [operations] name différent
    Given a valid configuration 
    And with parameter "test" for attribute "name" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [operations] name vide
    Given a valid configuration 
    And with parameter "" for attribute "name" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut name"

  Scenario: [operations] name absent
    Given a valid configuration 
    And without attribute "name" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut name"

  Scenario: [operations] description différent
    Given a valid configuration 
    And with parameter "test" for attribute "description" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [operations] description vide
    Given a valid configuration 
    And with parameter "" for attribute "description" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut description"

  Scenario: [operations] description absent
    Given a valid configuration 
    And without attribute "description" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut description"

  Scenario: [operations] parameters différent
    Given a valid configuration 
    And with parameter "test" for attribute "parameters" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Les parametres de l'operation ne sont pas dans un tableau"

  Scenario: [operations] parameters vide
    Given a valid configuration 
    And with parameter "" for attribute "parameters" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut parameters"

  Scenario: [operations] parameters absent
    Given a valid configuration 
    And without attribute "parameters" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut parameters"

  Scenario: [operations] parameters est un tableau vide
    Given a valid configuration 
    And without attribute "parameters.[13]" in "route.json" operation
    And without attribute "parameters.[12]" in "route.json" operation
    And without attribute "parameters.[11]" in "route.json" operation
    And without attribute "parameters.[10]" in "route.json" operation
    And without attribute "parameters.[9]" in "route.json" operation
    And without attribute "parameters.[8]" in "route.json" operation
    And without attribute "parameters.[7]" in "route.json" operation
    And without attribute "parameters.[6]" in "route.json" operation
    And without attribute "parameters.[5]" in "route.json" operation
    And without attribute "parameters.[4]" in "route.json" operation
    And without attribute "parameters.[3]" in "route.json" operation
    And without attribute "parameters.[2]" in "route.json" operation
    And without attribute "parameters.[1]" in "route.json" operation
    And without attribute "parameters.[0]" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le tableau des parametres est vide"

  Scenario: [operations] parameters est incomplet 
    Given a valid configuration 
    And without attribute "parameters.[0]" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le nombre de parametres presents n'est pas celui attendu"

  Scenario: [operations] parameters contient un element different 
    Given a valid configuration 
    And with parameter "test" for attribute "parameters.[0]" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation précise un parametre qui n'est pas disponible"
