# Tests fonctionnels de Road2 prenant en compte la donnée 
Feature: Road2 with data
  Tests fonctionnels de Road2 prenant en compte la donnée 

  Background:
      Given I have loaded all my test configuration in "../../configurations/local.json"

  Scenario Outline: [<method>] [simple/1.0.0] Route normale 
    Given an "<method>" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key    | value                                         |
      | start  | 2.3420083522796626,48.845718486262086         |
      | end    | 2.3216879367828365,48.84558433605804          |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the road should be similar to "../../data/1.json"

  Examples:
    | method  |
    | GET     |
    | POST    | 

  Scenario: [GET] [simple/1.0.0] Route qui doit passer sur un pont mais en interdisant les ponts
    Given an "GET" request on "/simple/1.0.0/route"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key         | value                                                                     |
      | start       | 2.3491859436035156,48.857111116502665                                     |
      | end         | 2.347555160522461,48.85404215643837                                       |
      | constraints | {"constraintType":"banned","key":"wayType","operator":"=","value":"pont"} |
    When I send the request 
    Then the server should send a response with status 404
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "No path found"