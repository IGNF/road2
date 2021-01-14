# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: Configuration correcte
    Given a configuration "HTTP" "GET" request on "/"
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "Road2"

