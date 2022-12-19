Feature: Road2-OSRM
  Tests fonctionnels complémentaires de Road2 sur OSRM

  Background:
    Given I have loaded all my test configuration in "../../configurations/local-service.json"


  Scenario Outline: [<method>] Route sur l'API simple 1.0.0
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 sans ressource 
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value           |
      | crs            | EPSG:2154       |
      | start          | 651475,6826145  |
      | end            | 651475,6826140  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "crs" with value "EPSG:2154"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais crs
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value                  |
      | intermediates  | 2.333865,48.881        |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[1]"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec plusieurs points intermediaires
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value                                     |
      | intermediates  | 2.333865,48.882989\|2.333885,48.881989    |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[2]"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec un point intermediaire
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters for "intermediates":
      | value                  |
      | 2.333865,48.882989     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[1]"


  Scenario: [POST] Route sur l'API simple 1.0.0 avec deux points intermediaires
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters for "intermediates":
      | value                  |
      | 2.334865,48.891989     |
      | 2.333875,48.883989     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[2]"

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec getSteps=true
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key           | value    |
      | getSteps      | true     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[0].steps.[0].geometry"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec getSteps=false
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value      |
      | waysAttributes | test       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'waysAttributes' is invalid"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec mauvais waysAttributes
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters for "waysAttributes":
      | value     |
      | test      |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'waysAttributes' is invalid"

    
  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec un bon waysAttributes
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value      |
      | waysAttributes | name       |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec un bon waysAttributes
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters for "waysAttributes":
      | value     |
      | name      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec un bon waysAttributes doublé
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value             |
      | waysAttributes | name \| name      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec un bon waysAttributes doublé
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters for "waysAttributes":
      | value     |
      | name      |
      | name      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec un bon waysAttributes et un faux
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value             |
      | waysAttributes | name \| test      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec un bon waysAttributes et un faux
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters for "waysAttributes":
      | value     |
      | name      |
      | test      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"

    
  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec getBbox=true
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value    |
      | getBbox      | true     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "bbox"
Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec getBbox=false
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value    |
      | timeUnit     | hour     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "timeUnit" with value "hour"
  Examples:
    | method  |
    | GET     |
    | POST    | 
  
  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec timeUnit=minute
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value      |
      | timeUnit     | minute     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "timeUnit" with value "minute"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec timeUnit=second
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value      |
      | timeUnit     | second     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "timeUnit" with value "second"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec timeUnit=standard
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value        |
      | timeUnit     | standard     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "timeUnit" with value "standard"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais timeUnit
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value         |
      | distanceUnit | kilometer     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "distanceUnit" with value "kilometer"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec distanceUnit=meter
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value         |
      | distanceUnit | meter         |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "distanceUnit" with value "meter"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais distanceUnit
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value            |
      | geometryFormat | polyline         |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain a string attribute "geometry"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec geometryFormat=geojson 
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value            |
      | geometryFormat | geojson          |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "geometry.type"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec geometryFormat=wkt
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais geometryFormat
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "constraints.[0].key"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (constraintType absent)
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                               |
      | constraints | {"key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (constraintType mauvais)
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                       |
      | constraints | {"constraintType":"test","key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (key absent)
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                         |
      | constraints | {"constraintType":"banned","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (key mauvais)
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                      |
      | constraints | {"constraintType":"banned","key":"test","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (operator absent)
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                          |
      | constraints | {"constraintType":"banned","key":"waytype","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (operator mauvais)
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                            |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"test","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (value absent)
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                     |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"="}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (value mauvais)
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                    |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une contrainte 
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "constraints.[0].key"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (constraintType absent)
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                               |
      | {"key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (constraintType mauvais)
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                       |
      | {"constraintType":"test","key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (key absent)
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                         |
      | {"constraintType":"banned","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (key mauvais)
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                      |
      | {"constraintType":"banned","key":"test","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (operator absent)
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                          |
      | {"constraintType":"banned","key":"waytype","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (operator mauvais)
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                           |
      | {"constraintType":"banned","key":"waytype","operator":"test","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (value absent)
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                     |
      | {"constraintType":"banned","key":"waytype","operator":"="}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec une mauvaise contrainte (value mauvais)
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                    |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}|
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec des paramètres qui n'existent pas (ressource)
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key        | value           |
      | ressource  | corse-osm-2     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec des paramètres qui n'existent pas (point)
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key        | value    |
      | point      | 9,42     |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec des paramètres qui n'existent pas (test)
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key       | value    |
      | test      | 1        |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario: [GET] Route sur l'API simple 1.0.0 avec des tout les paramètres 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value                                                                         |
      | profile        | car                                                                           |
      | optimization   | fastest                                                                       |
      | intermediates  | 2.343865,48.881989                                                            |
      | geometryFormat | geojson                                                                       |
      | getSteps       | true                                                                          |
      | getBbox        | true                                                                          |
      | distanceUnit   | meter                                                                         |
      | timeUnit       | minute                                                                        |
      | crs            | EPSG:4326                                                                     |
      | waysAttributes | name                                                                          |
      | constraints    | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}|
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road


  Scenario: [POST] Route sur l'API simple 1.0.0 avec des tout les paramètres 
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value                                                                         |
      | profile        | car                                                                           |
      | optimization   | fastest                                                                       |
      | geometryFormat | geojson                                                                       |
      | getSteps       | true                                                                          |
      | getBbox        | true                                                                          |
      | distanceUnit   | meter                                                                         |
      | timeUnit       | minute                                                                        |
      | crs            | EPSG:4326                                                                     |
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
    And with table parameters for "intermediates":
      | value                  |
      | 2.333865,48.891989     |
    And with table parameters for "waysAttributes":
      | value                  |
      | name                   |                                                                 
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road

  Scenario: [GET] Route sur l'API simple 1.0.0 avec plusieurs fois le start 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with "&start=9.449347257614130,42.563930726519340" at the end of the url
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'start' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec plusieurs fois le start 
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters for "start":
      | value                                    |
      | 9.449347257614130,42.563930726519340     |
      | 9.449347257614135,42.563930726519345     |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'start' is invalid"


 Scenario Outline: [<method>] Route sur l'API simple 1.0.0
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec plusieurs waysAttributes 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value                             |
      | waysAttributes | name \| nature \| importance      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.nature"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.importance"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec plusieurs waysAttributes 
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters for "waysAttributes":
      | value      |
      | name       |
      | nature     |
      | importance |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.nature"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.importance"

  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec plusieurs waysAttributes 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key            | value                             |
      | waysAttributes | name \| nature \| importance \| cleabs \| urbain \| access_pieton \| cpx_numero \| largeur_de_chaussee \| position_par_rapport_au_sol \| restriction_de_hauteur \| sens_de_circulation   |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'waysAttributes' is invalid"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec plusieurs waysAttributes 
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters for "waysAttributes":
      | value                       |
      | name                        |
      | nature                      |
      | importance                  |
      | cleabs                      |
      | urbain                      |
      | access_pieton               |
      | cpx_numero                  |
      | largeur_de_chaussee         |
      | position_par_rapport_au_sol |
      | restriction_de_hauteur      |
      | sens_de_circulation         |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'waysAttributes' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec deux contraintes sur une ressource OSRM 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "constraints.[1].key"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec deux contraintes dont une invalide sur une ressource OSRM 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec trois contraintes sur une ressource OSRM 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "constraints.[1].key"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec trois contraintes dont une invalide sur une ressource OSRM 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec trois contraintes dont deux invalides sur une ressource OSRM 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test1"}\|{"constraintType":"test2","key":"waytype","operator":"=","value":"tunnel"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec deux contraintes sur une ressource OSRM
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "constraints.[1].key"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec deux contraintes dont une ivalide sur une ressource OSRM
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}      |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec trois contraintes sur une ressource OSRM
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}           |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the response should contain an attribute "constraints.[2].key"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec trois contraintes dont une invalide sur une ressource OSRM
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}           |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}           |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec trois contraintes dont deux invalides sur une ressource OSRM
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"test1"}          |
      | {"constraintType":"test2","key":"waytype","operator":"=","value":"tunnel"}          |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}           |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

Scenario Outline: [<method>] Nearest sur l'API simple 1.0.0
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid nearest response

  Examples:
    | method  |
    | GET     |
    | POST    | 


Scenario Outline: [<method>] Nearest sur l'API simple 1.0.0 sans ressource 
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
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

  Scenario Outline: [<method>] Nearest sur l'API simple 1.0.0 avec mauvaise ressource 
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
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

Scenario Outline: [<method>] Route sur l'API simple 1.0.0 sans coordinates 
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
    And without query parameters:
      | key             | 
      | coordinates     |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'coordinates' not found"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais coordinates 
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
    And with query parameters:
      | key          | value           |
      | coordinates  | -9,-410         |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'coordinates' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais coordinates (string)
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
    And with query parameters:
      | key          | value           |
      | coordinates  | test            |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'coordinates' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais nbPoints 
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
    And with query parameters:
      | key       | value         |
      | nbPoints  | 50000         |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'nbPoints' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0 avec mauvais nbPoints (string)
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
    And with query parameters:
      | key       | value           |
      | nbPoints  | test            |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'nbPoints' is invalid"
  Examples:
    | method  |
    | GET     |
    | POST    | 

Scenario Outline: [<method>] Nearest sur l'API simple 1.0.0 avec un autre crs
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
    And with query parameters:
      | key            | value           |
      | crs            | EPSG:2154       |
      | coordinates    | 651475,6826145  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid nearest response
    And the response should contain an attribute "crs" with value "EPSG:2154"
  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Nearest sur l'API simple 1.0.0 avec mauvais crs
    Given an "<method>" request on operation "nearest" in api "simple" "1.0.0"
    And with default parameters for "nearest-osrm"
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
