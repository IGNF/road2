# Tests fonctionnels de Road2
Feature: Road2
  Tests fonctionnels de Road2

  Background:
      Given I have loaded all my test configuration

  Scenario: Route principale
    Given an "HTTP" "GET" request on "/"
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "Road2"

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
    And the response should contain an attribute "api.name" with value "simple"
    And the response should contain an attribute "api.version" with value "1.0.0"
    And the response should contain an attribute "operations.[0].id" with value "route"
    And the response should contain an attribute "operations.[0].methods.[1]" with value "POST"
    And the response should contain an attribute "operations.[0].parameters.[0].name" with value "resource"
    And the response should contain an attribute "operations.[1].id" with value "isochrone"
    And the response should contain an attribute "operations.[1].methods.[0]" with value "GET"
    And the response should contain an attribute "operations.[1].parameters.[1].name" with value "point"

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
    And the response should contain an attribute "geometry"
    And the response should contain an attribute "bbox"
    And the response should contain an attribute "distance"
    And the response should contain an attribute "duration"
    And the response should contain an attribute "portions.[0]"
    And the response should contain an attribute "portions.[0].start"
    And the response should contain an attribute "portions.[0].end"
    And the response should contain an attribute "portions.[0].distance"
    And the response should contain an attribute "portions.[0].duration"
    And the response should contain an attribute "portions.[0].steps.[0]"
    And the response should contain an attribute "portions.[0].steps.[0].geometry"
    And the response should contain an attribute "portions.[0].steps.[0].attributes"
    And the response should contain an attribute "portions.[0].steps.[0].distance"
    And the response should contain an attribute "portions.[0].steps.[0].duration"

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

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais start 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key    | value           |
      | start  | -9,-410         |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'start' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais start (string)
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key    | value           |
      | start  | test            |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'start' is invalid"
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

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais end 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key    | value           |
      | end    | -9,-410         |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'end' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais end (string)
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key    | value           |
      | end    | test            |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'end' is invalid"
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

  Scenario: [GET] Route sur l'API simple 1.0.0 avec un point intermediaire
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
    And the response should contain an attribute "portions.[1]"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec plusieurs points intermediaires
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value                                     |
      | intermediates  | 8.732901,41.928823\|8.732701,41.927823    |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "resource" with value "corse-osm"
    And the response should contain an attribute "profile" with value "car"
    And the response should contain an attribute "optimization" with value "fastest"
    And the response should contain an attribute "distanceUnit" with value "meter"
    And the response should contain an attribute "timeUnit" with value "minute"
    And the response should contain an attribute "crs" with value "EPSG:4326"
    And the response should contain an attribute "portions.[2]"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec un point intermediaire
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
    And the response should contain an attribute "portions.[1]"


  Scenario: [POST] Route sur l'API simple 1.0.0 avec deux points intermediaires
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters for "intermediates":
      | value                  |
      | 8.732901,41.928823     |
      | 8.734901,41.928823     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "resource" with value "corse-osm"
    And the response should contain an attribute "profile" with value "car"
    And the response should contain an attribute "optimization" with value "fastest"
    And the response should contain an attribute "distanceUnit" with value "meter"
    And the response should contain an attribute "timeUnit" with value "minute"
    And the response should contain an attribute "crs" with value "EPSG:4326"
    And the response should contain an attribute "portions.[2]"

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

    
  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec un bon waysAttributes
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value      |
      | waysAttributes | name       |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec un bon waysAttributes
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters for "waysAttributes":
      | value     |
      | name      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec un bon waysAttributes doublé
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value             |
      | waysAttributes | name \| name      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec un bon waysAttributes doublé
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters for "waysAttributes":
      | value     |
      | name      |
      | name      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec un bon waysAttributes et un faux
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value             |
      | waysAttributes | name \| test      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec un bon waysAttributes et un faux
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters for "waysAttributes":
      | value     |
      | name      |
      | test      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

    
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

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec timeUnit=hour
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
  
  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec timeUnit=minute
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key          | value      |
      | timeUnit     | minute     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "timeUnit" with value "minute"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec timeUnit=second
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key          | value      |
      | timeUnit     | second     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "timeUnit" with value "second"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec timeUnit=standard
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key          | value        |
      | timeUnit     | standard     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "timeUnit" with value "standard"
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

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec distanceUnit=kilometer
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

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec distanceUnit=meter
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key          | value         |
      | distanceUnit | meter         |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "distanceUnit" with value "meter"
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

Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec geometryFormat=polyline
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value            |
      | geometryFormat | polyline         |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a string attribute "geometry"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec geometryFormat=geojson 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value            |
      | geometryFormat | geojson          |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "geometry.type"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais geometryFormat
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key              | value      |
      | geometryFormat   | test       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'geometryFormat' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une contrainte 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[0].key"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (constraintType absent)
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key         | value                                               |
      | constraints | {"key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (constraintType mauvais)
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key         | value                                                                       |
      | constraints | {"constraintType":"test","key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (key absent)
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key         | value                                                         |
      | constraints | {"constraintType":"banned","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (key mauvais)
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key         | value                                                                      |
      | constraints | {"constraintType":"banned","key":"test","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (operator absent)
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key         | value                                                          |
      | constraints | {"constraintType":"banned","key":"waytype","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (operator mauvais)
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key         | value                                                                            |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"test","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (value absent)
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key         | value                                                     |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"="}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (value mauvais)
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key         | value                                                                    |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une contrainte 
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[0].key"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (constraintType absent)
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters of object for "constraints":
      | value                                               |
      | {"key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (constraintType mauvais)
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters of object for "constraints":
      | value                                                                       |
      | {"constraintType":"test","key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (key absent)
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters of object for "constraints":
      | value                                                         |
      | {"constraintType":"banned","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (key mauvais)
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters of object for "constraints":
      | value                                                                      |
      | {"constraintType":"banned","key":"test","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (operator absent)
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters of object for "constraints":
      | value                                                          |
      | {"constraintType":"banned","key":"waytype","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (operator mauvais)
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters of object for "constraints":
      | value                                                                           |
      | {"constraintType":"banned","key":"waytype","operator":"test","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (value absent)
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters of object for "constraints":
      | value                                                     |
      | {"constraintType":"banned","key":"waytype","operator":"="}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (value mauvais)
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters of object for "constraints":
      | value                                                                    |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec des paramètres qui n'existent pas (ressource)
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key        | value           |
      | ressource  | corse-osm-2     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec des paramètres qui n'existent pas (point)
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key        | value    |
      | point      | 9,42     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec des paramètres qui n'existent pas (test)
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key       | value    |
      | test      | 1        |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario: [GET] Route sur l'API simple 1.0.0 avec des tout les paramètres 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value                                                                         |
      | profile        | car                                                                           |
      | optimization   | fastest                                                                       |
      | intermediates  | 9.448360204696855,42.567660375593106                                          |
      | geometryFormat | geojson                                                                       |
      | getSteps       | true                                                                          |
      | getBbox        | true                                                                          |
      | distanceUnit   | meter                                                                         |
      | timeUnit       | second                                                                        |
      | crs            | EPSG:4326                                                                     |
      | waysAttributes | name                                                                          |
      | constraints    | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"


  Scenario: [POST] Route sur l'API simple 1.0.0 avec des tout les paramètres 
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value                                                                         |
      | profile        | car                                                                           |
      | optimization   | fastest                                                                       |
      | geometryFormat | geojson                                                                       |
      | getSteps       | true                                                                          |
      | getBbox        | true                                                                          |
      | distanceUnit   | meter                                                                         |
      | timeUnit       | second                                                                        |
      | crs            | EPSG:4326                                                                     |
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
    And with table parameters for "intermediates":
      | value                  |
      | 8.732901,41.928823     |
    And with table parameters for "waysAttributes":
      | value                  |
      | name                   |                                                                 
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec plusieurs fois le start 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with "&start=9.449347257614130,42.563930726519340" at the end of the url
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'start' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec plusieurs fois le start 
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters for "start":
      | value                                    |
      | 9.449347257614130,42.563930726519340     |
      | 9.449347257614135,42.563930726519345     |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'start' is invalid"
