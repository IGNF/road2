# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: [parameters] id différent
    Given a valid configuration 
    And with parameter "test" for attribute "id" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation précise un parametre qui n'est pas disponible: intermediates"

  Scenario: [parameters] id vide
    Given a valid configuration 
    And with parameter "" for attribute "id" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'id"

  Scenario: [parameters] id absent
    Given a valid configuration 
    And without attribute "id" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'id"

  Scenario: [parameters] id deja utilise
    Given a valid configuration 
    And with parameter "test" for attribute "id" in "start.json" parameter
    And with parameter "test" for attribute "id" in "end.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre contenant l'id test est deja vérifié"

  Scenario: [parameters] name différent
    Given a valid configuration 
    And with parameter "test" for attribute "name" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] name vide
    Given a valid configuration 
    And with parameter "" for attribute "name" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut name"

  Scenario: [parameters] name absent
    Given a valid configuration 
    And without attribute "name" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut name"

  Scenario: [parameters] description différent
    Given a valid configuration 
    And with parameter "test" for attribute "description" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] description vide
    Given a valid configuration 
    And with parameter "" for attribute "description" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut description"

  Scenario: [parameters] description absent
    Given a valid configuration 
    And without attribute "description" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut description"

  Scenario: [parameters] required différent
    Given a valid configuration 
    And with parameter "true" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

    Scenario: [parameters] required invalide
    Given a valid configuration 
    And with parameter "test" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre contient un attribut required mal configure"

  Scenario: [parameters] required vide
    Given a valid configuration 
    And with parameter "" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut required"

  Scenario: [parameters] required absent
    Given a valid configuration 
    And without attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut required"
  
  Scenario: [parameters] defaultValue différent (true donc probleme apres)
    Given a valid configuration 
    And with parameter "true" for attribute "defaultValue" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas de valeur par defaut alors qu'il doit en avoir un"

  Scenario: [parameters] defaultValue invalide
    Given a valid configuration 
    And with parameter "test" for attribute "defaultValue" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre contient un attribut defaultValue mal configure"

  Scenario: [parameters] defaultValue vide
    Given a valid configuration 
    And with parameter "" for attribute "defaultValue" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut defaultValue"

  Scenario: [parameters] defaultValue absent
    Given a valid configuration 
    And without attribute "defaultValue" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut defaultValue"
  
  Scenario: [parameters] example différent 
    Given a valid configuration 
    And with parameter "test" for attribute "example" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] example vide
    Given a valid configuration 
    And with parameter "" for attribute "example" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le parametre ne contient pas d'exemple"

  Scenario: [parameters] example absent
    Given a valid configuration 
    And without attribute "example" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le parametre ne contient pas d'exemple"

  Scenario: [parameters] type différent
    Given a valid configuration 
    And with parameter "boolean" for attribute "type" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La valeur du parametre est incorrecte par rapport à son type: boolean"

  Scenario: [parameters] type invalide
    Given a valid configuration 
    And with parameter "test" for attribute "type" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le type du parametre est incorrect"

  Scenario: [parameters] type vide
    Given a valid configuration 
    And with parameter "" for attribute "type" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut type"

  Scenario: [parameters] type absent
    Given a valid configuration 
    And without attribute "type" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut type"
  
  Scenario: [parameters] min différent et required true
    Given a valid configuration 
    And with parameter "1" for attribute "min" in "intermediates.json" parameter
    And with parameter "true" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] min différent et required false
    Given a valid configuration 
    And with parameter "1" for attribute "min" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre min est incorrect: valeur superieure a 0"

  Scenario: [parameters] min a 0 et required true
    Given a valid configuration 
    And with parameter "0" for attribute "min" in "intermediates.json" parameter
    And with parameter "true" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre min est incorrect: valeur inferieure a 1"

  Scenario: [parameters] min invalide
    Given a valid configuration 
    And with parameter "test" for attribute "min" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre min est incorrect: valeur non entiere"

  Scenario: [parameters] min vide
    Given a valid configuration 
    And with parameter "" for attribute "min" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] min absent
    Given a valid configuration 
    And without attribute "min" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [parameters] max différent
    Given a valid configuration 
    And with parameter "1" for attribute "max" in "intermediates.json" parameter
    And with parameter "true" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] max a 0 
    Given a valid configuration 
    And with parameter "0" for attribute "max" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre max est incorrect: valeur inferieure a 1"

  Scenario: [parameters] max invalide
    Given a valid configuration 
    And with parameter "test" for attribute "max" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre max est incorrect: valeur non entiere"

  Scenario: [parameters] max vide
    Given a valid configuration 
    And with parameter "" for attribute "max" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] max absent
    Given a valid configuration 
    And without attribute "max" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [parameters] max plus petit que min
    Given a valid configuration 
    And with parameter "1" for attribute "max" in "intermediates.json" parameter
    And with parameter "2" for attribute "min" in "intermediates.json" parameter
    And with parameter "true" for attribute "required" in "intermediates.json" parameter    
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre max est incorrect: valeur inferieure au parametre min"

  Scenario: [parameters] explode différent (true)
    Given a valid configuration 
    And with parameter "true" for attribute "explode" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] explode invalide
    Given a valid configuration 
    And with parameter "test" for attribute "explode" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre explode est incorrect"

  Scenario: [parameters] explode vide
    Given a valid configuration 
    And with parameter "" for attribute "explode" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] explode absent
    Given a valid configuration 
    And without attribute "explode" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [parameters] style invalide alors que explode false
    Given a valid configuration 
    And with parameter "test" for attribute "style" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre style est incorrect"

  Scenario: [parameters] style vide alors que explode false
    Given a valid configuration 
    And with parameter "" for attribute "style" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre style n'est pas present alors que explode=false"

  Scenario: [parameters] style vide alors que explode false
    Given a valid configuration 
    And without attribute "style" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre style n'est pas present alors que explode=false"
