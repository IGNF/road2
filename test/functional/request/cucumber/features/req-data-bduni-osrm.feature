Feature: Road2 with Bduni data via OSRM
  Tests fonctionnels de Road2 prenant en compte la donnée Bduni via le moteur OSRM

  Background:
      Given I have loaded all my test configuration in "../../configurations/local.json"

  Scenario Outline: [<method>] [simple/1.0.0] Route normale
    Given an "<method>" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
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

  Scenario: [GET] [simple/1.0.0] Route qui fait une boucle 
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value                                         |
      | start        | 2.276744842529297,48.874651226434366         |
      | end          | 2.276744842529297,48.874651226434366         |
      | intermediates | 2.4161338806152344,48.84958044593267\|2.3285865783691406,48.819072029824866          |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the road should be similar to "../../data/bduni/common/boucle.json"

  Scenario: [GET] [simple/1.0.0] Route qui fait du sur place
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value                                        |
      | start        | 2.276744842529297,48.874651226434366         |
      | end          | 2.276744842529297,48.874651226434366         |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the road should be similar to "../../data/bduni/common/point.json"

  Scenario: [GET] [simple/1.0.0] Route à sens unique en sens direct
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value                                        |
      | start        | 2.3266366124153137,48.87538156341441         |
      | end          | 2.3267331719398494,48.87491231430877         |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the road should be similar to "../../data/bduni/common/unique-direct.json"

  Scenario: [GET] [simple/1.0.0] Routes à sens unique en sens inverse
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
    And with default parameters for "route-osrm"
    And with query parameters:
      | key          | value                                        |
      | start        | 2.326878011226654,48.87438308071262          |
      | end          | 2.3266473412513733,48.875370978896655        |
    When I send the request
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain a complete and valid road
    And the road should be similar to "../../data/bduni/common/unique-inverse.json"

  Scenario: [GET] [simple/1.0.0] Route qui doit passer sur un pont mais en interdisant les ponts
    Given an "GET" request on operation "route" in api "simple" "1.0.0"
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

