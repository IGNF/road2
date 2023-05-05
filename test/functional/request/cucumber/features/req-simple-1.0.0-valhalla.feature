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
      | costValue      | 2000            |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid iso

  Examples:
    | method  |
    | GET     |
    | POST    |

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un autre crs
    Given an "<method>" request on operation "isochrone" in api "simple" "1.0.0"
    And with default parameters for "isochrone-valhalla"
    And with query parameters:
      | key            | value           |
      | crs            | EPSG:2154       |
      | point          | 651475,6826145  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid iso
    And the response should contain an attribute "crs" with value "EPSG:2154"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec geometryFormat=wkt
    Given an "<method>" request on operation "isochrone" in api "simple" "1.0.0"
    And with default parameters for "isochrone-valhalla"
    And with query parameters:
      | key            | value            |
      | geometryFormat | wkt              |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid iso
    And the response should contain a string attribute "geometry"
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

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec geometryFormat=wkt
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-valhalla"
    And with query parameters:
      | key            | value            |
      | geometryFormat | wkt              |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain a string attribute "geometry"
  Examples:
    | method  |
    | GET     |
    | POST    |


