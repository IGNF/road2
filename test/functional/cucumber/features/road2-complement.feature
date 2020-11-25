# Tests fonctionnels complémentaires de Road2
Feature: Road2-complement
  Tests fonctionnels complémentaires de Road2

  Background:
    Given I have loaded all my test configuration

 Scenario Outline: [<method>] Route sur l'API simple 1.0.0
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "resource" with value "bduni-idf-osrm"
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

  Scenario Outline: [<method>] Route sur l'API simple 1.0.0
    Given an "HTTP" "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "resource" with value "bduni-idf-pgr"
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

  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec plusieurs waysAttributes 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value                             |
      | waysAttributes | name \| nature \| importance      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.nature"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.importance"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec plusieurs waysAttributes 
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with table parameters for "waysAttributes":
      | value      |
      | name       |
      | nature     |
      | importance |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.name"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.nature"
    And the response should contain an attribute "portions.[0].steps.[0].attributes.importance"

  Scenario Outline: [GET] Route sur l'API simple 1.0.0 avec plusieurs waysAttributes 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route"
    And with query parameters:
      | key            | value                             |
      | waysAttributes | name \| nature \| importance \| cleabs \| urbain \| access_pieton \| cpx_numero \| largeur_de_chaussee \| position_par_rapport_au_sol \| restriction_de_hauteur \| sens_de_circulation   |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'waysAttributes' is invalid"

  Scenario Outline: [POST] Route sur l'API simple 1.0.0 avec plusieurs waysAttributes 
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route"
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
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[1].key"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec deux contraintes dont une invalide sur une ressource OSRM 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec trois contraintes sur une ressource OSRM 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[1].key"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec trois contraintes dont une invalide sur une ressource OSRM 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec trois contraintes dont deux invalides sur une ressource OSRM 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test1"}\|{"constraintType":"test2","key":"waytype","operator":"=","value":"tunnel"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec deux contraintes sur une ressource OSRM
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[1].key"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec deux contraintes dont une ivalide sur une ressource OSRM
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
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
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}           |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[2].key"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec trois contraintes dont une invalide sur une ressource OSRM
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
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
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
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

  Scenario: [GET] Route sur l'API simple 1.0.0 avec deux contraintes sur une ressource pgr 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[1].key"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec deux contraintes dont une invalide sur une ressource pgr 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec trois contraintes sur une ressource pgr 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[1].key"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec trois contraintes dont une invalide sur une ressource pgr 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [GET] Route sur l'API simple 1.0.0 avec trois contraintes dont deux invalides sur une ressource pgr 
    Given an "HTTP" "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"test1"}\|{"constraintType":"test2","key":"waytype","operator":"=","value":"tunnel"}\|{"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec deux contraintes sur une ressource pgr
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[1].key"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec deux contraintes dont une ivalide sur une ressource pgr
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}      |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec trois contraintes sur une ressource pgr
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}           |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[2].key"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec trois contraintes dont une invalide sur une ressource pgr
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"test"}           |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"tunnel"}         |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}           |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario: [POST] Route sur l'API simple 1.0.0 avec trois contraintes dont deux invalides sur une ressource pgr
    Given an "HTTP" "POST" request on "/simple/1.0.0/route"
    And with default parameters for "route-pgr"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"test1"}          |
      | {"constraintType":"test2","key":"waytype","operator":"=","value":"tunnel"}          |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"pont"}           |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'constraints' is invalid"

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "point" with value "2.333865,48.881989"
    And the response should contain an attribute "resource" with value "bduni-idf-pgr"
    And the response should contain an attribute "profile" with value "car"
    And the response should contain an attribute "costType" with value "time"
    And the response should contain an attribute "costValue" 
    And the response should contain an attribute "timeUnit" with value "second"
    And the response should contain an attribute "crs" with value "EPSG:4326"
    And the response should contain an attribute "resourceVersion"
    And the response should contain an attribute "geometry"
    And the response should contain an attribute "direction"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 sans ressource 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
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

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec une mauvaise ressource 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key       | value                |
      | resource  | bduni-idf-osrm-2     |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'resource' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 sans point 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And without query parameters:
      | key    | 
      | point  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'point' not found"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais point 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key    | value                |
      | point  | -9,-410              |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'point' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 sans costValue 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And without query parameters:
      | key        | 
      | costValue  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'costValue' not found"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais costValue (1)
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key        | value                |
      | costValue  | -9,-410              |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'costValue' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais costValue (2)
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key        | value                 |
      | costValue  | Infinity              |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'costValue' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais costValue (3)
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key        | value                 |
      | costValue  | NaN                   |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'costValue' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais costValue (4)
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key        | value                 |
      | costValue  | test                  |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'costValue' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 sans costType 
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And without query parameters:
      | key        | 
      | costType   |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'costType' not found"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais costType
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key        | value                |
      | costType   | test                 |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'costType' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 


  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais profile
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key        | value                |
      | profile    | test                 |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'profile' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 


  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais direction
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key         | value                |
      | direction   | test                 |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'direction' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais geometryFormat
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key              | value                |
      | geometryFormat   | test                 |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'geometryFormat' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais distanceUnit
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key            | value                |
      | distanceUnit   | test                 |
      | costType       | distance             |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'distanceUnit' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais timeUnit
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key        | value                |
      | timeUnit   | test                 |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'timeUnit' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario Outline: [<method>] Isochrone sur l'API simple 1.0.0 avec un mauvais crs
    Given an "HTTP" "<method>" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key        | value                |
      | crs        | test                 |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "Parameter 'crs' is invalid"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario: [GET] Isochrone sur l'API simple 1.0.0 avec une contrainte sur une ressource pgr 
    Given an "HTTP" "GET" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with query parameters:
      | key         | value                                                                           |
      | constraints | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}  |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[0].key"

  Scenario: [POST] Isochrone sur l'API simple 1.0.0 avec une contrainte sur une ressource pgr
    Given an "HTTP" "POST" request on "/simple/1.0.0/isochrone"
    And with default parameters for "isochrone"
    And with table parameters of object for "constraints":
      | value                                                                               |
      | {"constraintType":"banned","key":"waytype","operator":"=","value":"autoroute"}      |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "constraints.[0].key"