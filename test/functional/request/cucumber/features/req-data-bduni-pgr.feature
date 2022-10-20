Feature: Road2 with Bduni data via PGR 
  Tests fonctionnels de Road2 prenant en compte la donnée Bduni via PGR 

  Background:
      Given I have loaded all my test configuration in "../../configurations/local-service.json"

  Scenario Outline: [<method>] [simple/1.0.0] Route normale
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key    | value                                         |
      | start  | 2.3420083522796626,48.845718486262086         |
      | end    | 2.3216879367828365,48.84558433605804          |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the road should be similar to "../../data/bduni/common/normale.json"

  Examples:
    | method  |
    | GET     |
    | POST    |

  Scenario: [GET] [simple/1.0.0] Route qui doit passer sur un pont mais en interdisant les ponts
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key         | value                                                                     |
      | start       | 2.3491859436035156,48.857111116502665                                     |
      | end         | 2.347555160522461,48.85404215643837                                       |
      | constraints | {"constraintType":"banned","key":"wayType","operator":"=","value":"pont"} |
    When I send the request
    Then the server should send a response with status 404
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "error.message" with value "No path found"

  Scenario: [GET] [simple/1.0.0] Route avec point intermediaire qui provoque un demi-tour 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key           | value                                                                             |
      | start         | 2.557207345962524,48.74254989437114                                                                |
      | end           | 2.5614130496978755,48.74151692471051                                                                |
      | intermediates | 2.558408975601196,48.74189898445621     |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the road should be similar to "../../data/bduni/pgr/1.json"

  Scenario: [POST] [simple/1.0.0] Route avec point intermediaire qui provoque un demi-tour
    Given an "POST" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key           | value                                                                             |
      | start         | 2.557207345962524,48.74254989437114                                                                |
      | end           | 2.5614130496978755,48.74151692471051                                                                |
    And with table parameters for "intermediates":
      | value                                   |
      | 2.558408975601196,48.74189898445621     |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the road should be similar to "../../data/bduni/pgr/1.json"


  Scenario Outline: [<method>] [simple/1.0.0] Route commençant sur une raquette
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-pgr"
    And with query parameters:
      | key           | value                                                                             |
      | start         | 2.558207,48.741417                                                               |
      | end           | 2.559752,48.742114                                                              |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the road should be similar to "../../data/bduni/pgr/2.json"

  Examples:
    | method  |
    | GET     |
    | POST    |
