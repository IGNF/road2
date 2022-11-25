Feature: Road2-SMARTROUTING
  Tests fonctionnels complémentaires de Road2 via SmartRouting

  Background:
    Given I have loaded all my test configuration in "../../configurations/local-service.json"

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 sur une ressource smartpgr avec appel à la source smartrouting
    Given an "<method>" request on operation "isochrone" in api "simple" "1.0.0"
    And with default parameters for "isochrone-smartpgr"
    And with query parameters:
      | key         | value     |
      | costType    | distance  |
      | costValue   | 31000     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid iso

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 sur une ressource smartpgr avec appel à la source pgr
    Given an "<method>" request on operation "isochrone" in api "simple" "1.0.0"
    And with default parameters for "isochrone-smartpgr"
    And with query parameters:
      | key         | value     |
      | costType    | distance  |
      | costValue   | 1000      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid iso

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario: [GET] Isochrone sur l'API simple 1.0.0 avec une contrainte sur une ressource smartpgr avec appel à la source smartrouting
    Given an "GET" request on operation "isochrone" in api "simple" "1.0.0"
    And with default parameters for "isochrone-smartpgr"
    And with query parameters:
      | key         | value                                                                           |
      | costType    | distance                                                                        |
      | costValue   | 1000                                                                            |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid iso
    And the response should contain an attribute "constraints.[0].key"

  Scenario: [GET] Isochrone sur l'API simple 1.0.0 avec une contrainte sur une ressource smartpgr avec appel à la source smartrouting
    Given an "GET" request on operation "isochrone" in api "simple" "1.0.0"
    And with default parameters for "isochrone-smartpgr"
    And with query parameters:
      | key         | value                                                                           |
      | costType    | distance                                                                        |
      | costValue   | 31000                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid iso
    And the response should contain an attribute "constraints.[0].key"

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un geometryFormat polyline à partir d'une géométrie générée par smartrouting
    Given an "<method>" request on operation "isochrone" in api "simple" "1.0.0"
    And with default parameters for "isochrone-smartpgr"
    And with query parameters:
      | key              | value                    |
      | costType         | distance                 |
      | costValue        | 31000                    |
      | geometryFormat   | polyline                 |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"

  Examples:
    | method  |
    | GET     |
    | POST    | 