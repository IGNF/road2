Feature: Road2-Valhalla
  Tests fonctionnels complémentaires de Road2 via Valhalla

  Background:
    Given I have loaded all my test configuration in "../../configurations/local-service.json"

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 sur une ressource valhalla
    Given an "<method>" request on operation "isochrone" in api "simple" "1.0.0"
    And with default parameters for "isochrone-valhalla"
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid iso

  Examples:
    | method  |
    | GET     |
    | POST    |

  Scenario Outline: [<method>] Isochrone distance sur l'API simple 1.0.0 sur une ressource valhalla
    Given an "<method>" request on operation "isochrone" in api "simple" "1.0.0"
    And with default parameters for "isochrone-valhalla"
    And with query parameters:
      | key            | value           |
      | costType       | distance        |
      | costValue      | 1000            |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid iso

  Examples:
    | method  |
    | GET     |
    | POST    |

Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec valhalla
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-valhalla"
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road

  Examples:
    | method  |
    | GET     |
    | POST    |
