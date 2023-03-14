# Tests fonctionnels de Road2 prenant en compte la donnée 
Feature: Road2 with data
  Tests fonctionnels de Road2 prenant en compte la donnée 

  Background:
      Given I have loaded all my test configuration in "../../configurations/local-admin.json"

  Scenario Outline: [admin/1.0.0] Une route qui n'existe pas 
    Given an "<method>" request on "/admin/1.0.0/test"
    And with query parameters:
      | key       | value           |
      | test      | other           |
    When I send the request 
    Then the server should send a response with status 404
    And the response should contain "Not found"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario: [admin/1.0.0] Version de Road2
    Given an "GET" request on operation "version" in api "admin" "1.0.0"
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "version"

  Scenario: [admin/1.0.0] Version de Road2 avec un mauvais parametre
    Given an "GET" request on operation "version" in api "admin" "1.0.0"
    And with query parameters:
      | key       | value           |
      | test      | other           |
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "version"

  Scenario: [admin/1.0.0] Version de Road2 en POST ne marche pas
    Given an "POST" request on operation "version" in api "admin" "1.0.0"
    And with query parameters:
      | key       | value           |
      | test      | other           |
    When I send the request 
    Then the server should send a response with status 404
    And the response should contain "Not found"

  Scenario: [admin/1.0.0] État de Road2
    Given an "GET" request on operation "health" in api "admin" "1.0.0"
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "state"

  Scenario: [admin/1.0.0] État de Road2 avec un mauvais parametre
    Given an "GET" request on operation "health" in api "admin" "1.0.0"
    And with query parameters:
      | key       | value           |
      | test      | other           |
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "state"

  Scenario: [admin/1.0.0] État de Road2 en POST ne marche pas
    Given an "POST" request on operation "health" in api "admin" "1.0.0"
    And with query parameters:
      | key       | value           |
      | test      | other           |
    When I send the request 
    Then the server should send a response with status 404
    And the response should contain "Not found"

  Scenario: [admin/1.0.0] Configurations des services
    Given an "GET" request on operation "services" in api "admin" "1.0.0"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "application"
    And the response should contain an attribute "[0].id"

  Scenario: [admin/1.0.0] Configurations des services en POST ne marche pas
    Given an "POST" request on operation "services" in api "admin" "1.0.0"
    And with query parameters:
      | key       | value           |
      | test      | other           |
    When I send the request 
    Then the server should send a response with status 404
    And the response should contain "Not found"

  Scenario: [admin/1.0.0] Configuration du service "main"
    Given an "GET" request on operation "services/<service>" in api "admin" "1.0.0"
    And with path parameters:
      | key       | value |
      | service   | main  |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "application"

  Scenario: [admin/1.0.0] Configuration d'un service inexistant ne marche pas
    Given an "GET" request on operation "services/<service>" in api "admin" "1.0.0"
    And with path parameters:
      | key       | value |
      | service   | other  |
    When I send the request 
    Then the server should send a response with status 404
    And the response should contain "Can't find service"
