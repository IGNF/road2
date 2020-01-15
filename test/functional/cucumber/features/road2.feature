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

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "resource" with value "corse-osm"
    And the response should contain an attribute "profile" with value "car"
    And the response should contain an attribute "optimization" with value "fastest"
    And the response should contain an attribute "distanceUnit" with value "meter"
    And the response should contain an attribute "timeUnit" with value "minute"
    And the response should contain an attribute "crs" with value "EPSG:4326"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 sans ressource 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And without query parameters:
      | key       | 
      | resource  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'resource' not found"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvaise ressource 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key       | value           |
      | resource  | corse-osm-2     |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'resource' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 sans start 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And without query parameters:
      | key       | 
      | start     |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'start' not found"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 sans end 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And without query parameters:
      | key       | 
      | end       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'end' not found"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais profile 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key       | value           |
      | profile   | test            |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'profile' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvaise optimisation
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value           |
      | optimization   | test            |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'optimization' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec un autre crs
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value           |
      | crs            | EPSG:2154       |
      | start          | 1231119,6124145 |
      | end            | 1231019,6124045 |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "crs" with value "EPSG:2154"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais crs
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value           |
      | crs            | EPSG:4325       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'crs' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario: [GET] Route sur l'API simple 1.0.0 avec points intermediaires
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value                  |
      | intermediates  | 8.732901,41.928823     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "resource" with value "corse-osm"
    And the response should contain an attribute "profile" with value "car"
    And the response should contain an attribute "optimization" with value "fastest"
    And the response should contain an attribute "distanceUnit" with value "meter"
    And the response should contain an attribute "timeUnit" with value "minute"
    And the response should contain an attribute "crs" with value "EPSG:4326"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec points intermediaires
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters for "intermediates":
      | value                  |
      | 8.732901,41.928823     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "resource" with value "corse-osm"
    And the response should contain an attribute "profile" with value "car"
    And the response should contain an attribute "optimization" with value "fastest"
    And the response should contain an attribute "distanceUnit" with value "meter"
    And the response should contain an attribute "timeUnit" with value "minute"
    And the response should contain an attribute "crs" with value "EPSG:4326"

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec getSteps=true
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key           | value    |
      | getSteps      | true     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "portions.[0].steps.[0].geometry"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec getSteps=false
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key           | value    |
      | getSteps      | false    |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should not contain an attribute "portions.[0].steps.[0].geometry"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais getSteps
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key             | value      |
      | getSteps        | test       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'getSteps' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec mauvais waysAttributes
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value      |
      | waysAttributes | test       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'waysAttributes' is invalid"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec mauvais waysAttributes
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters for "waysAttributes":
      | value     |
      | test      |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'waysAttributes' is invalid"

    
  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec mauvais waysAttributes
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value      |
      | waysAttributes | name       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'waysAttributes' is invalid"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec mauvais waysAttributes
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters for "waysAttributes":
      | value     |
      | name      |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'waysAttributes' is invalid"

    
  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec getBbox=true
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key          | value    |
      | getBbox      | true     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "bbox"
Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec getBbox=false
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key          | value    |
      | getBbox      | false    |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should not contain an attribute "bbox"
Examples:
    | method  |
    | GET     |
    | POST    | 
  
  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais getBbox
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value      |
      | getBbox        | test       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'getBbox' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec timeUnit
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key          | value    |
      | timeUnit     | hour     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "timeUnit" with value "hour"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais timeUnit
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value      |
      | timeUnit       | test       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'timeUnit' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec distanceUnit
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key          | value         |
      | distanceUnit | kilometer     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "distanceUnit" with value "kilometer"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais distanceUnit
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value      |
      | distanceUnit   | test       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'distanceUnit' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 