Feature: Road2
  Tests fonctionnels de Road2 sur les requêtes de l'API simple 1.0.0

  Background:
      Given I have loaded all my test configuration in "../../configurations/local-service.json"

  Scenario Outline: [<method>] Route principale
    Given an "<method>" request on "/"
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "Road2"
  
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario: API simple 1.0.0
    Given an "GET" request on "/simple/1.0.0/"
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "Road2 via l'API simple 1.0.0"

  Scenario Outline: Métadonnées seules d'un itinéraire sur <engine>
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-<engine>"
    And with query parameters:
      | key          | value |
      | metadataOnly | true  |
    When I send the request
    Then the server should send a response with status 200
    And the response should contain an attribute "resourceVersion"
    And the response should contain an attribute "crs"
    And the response should contain an attribute "distance"
    And the response should contain an attribute "distanceUnit"
    And the response should contain an attribute "duration"
    And the response should contain an attribute "timeUnit"
    And the response should not contain an attribute "geometry"
    And the response should not contain an attribute "portions"
    And the response should not contain an attribute "bbox"

  Examples:
    | engine   |
    | osrm     |
    | pgr      |
    | valhalla |

  Scenario: GetCapabilities sur l'API simple 1.0.0
    Given an "GET" request on operation "getcapabilities" in api "simple" "1.0.0"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "info.name" with value "Road2"
    And the response should contain an attribute "api.name" with value "simple"
    And the response should contain an attribute "api.version" with value "1.0.0"
    And the response should contain an attribute "operations.[0].id" with value "route"
    And the response should contain an attribute "operations.[0].methods.[1]" with value "POST"
    And the response should contain an attribute "operations.[0].parameters.[0].name" with value "resource"
    And the response should contain an attribute "operations.[1].id" with value "isochrone"
    And the response should contain an attribute "operations.[1].methods.[0]" with value "GET"
    And the response should contain an attribute "operations.[1].parameters.[1].name" with value "point"

  Scenario: GetCapabilities sur l'API simple 1.0.0 sans changer le host 
    Given an "GET" request on operation "getcapabilities" in api "simple" "1.0.0"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "info.url" with configuration value of "url"

  Scenario: GetCapabilities sur l'API simple 1.0.0 en changeant le host 
    Given an "GET" request on operation "getcapabilities" in api "simple" "1.0.0"
    And with the alternative url 
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "info.url" with configuration value of "alternativeParameters.url"
