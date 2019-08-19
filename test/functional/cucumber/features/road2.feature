# Tests fonctionnels de Road2
Feature: Road2
  Tests fonctionnels de Road2

  Background:
      Given I have loaded all my test configuration

  Scenario: Route principale
    Given an "HTTP" "GET" request on "/"
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "Road2 is running"

  Scenario: API simple 1.0.0
    Given an "HTTP" "GET" request on "/simple/1.0.0/"
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "Road2 via l'API simple 1.0.0"

  Scenario: GetCapabilities sur l'API simple 1.0.0
    Given an "HTTP" "GET" request on "/simple/1.0.0/getcapabilities"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "info.name" with value "Road2"
    
    
