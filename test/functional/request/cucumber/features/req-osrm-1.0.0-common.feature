Feature: Road2-osrm-1.0.0-common
  Tests fonctionnels de Road2 via l'API osrm/1.0.0

  Background:
      Given I have loaded all my test configuration in "../../configurations/local-service.json"

  Scenario: Route principale de l'API osrm/1.0.0
    Given an "GET" request on "/osrm/1.0.0"
    When I send the request 
    Then the server should send a response with status 200
    And the response should contain "Road2 via OSRM API 1.0.0"

  Scenario: GetCapabilities de l'API osrm/1.0.0
    Given an "GET" request on "/osrm/1.0.0/resources"
    When I send the request 
    Then the server should send a response with status 501
    And the response should contain "Not Implemented"

  Scenario: Requête sur une route inexistante
    Given an "GET" request on "/osrm/1.0.0/test"
    When I send the request 
    Then the server should send a response with status 404
    And the response should contain "Not found"

  Scenario: [route] Route sur l'API osrm 1.0.0 avec mauvaise resource 
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | test                                        |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.333865,48.881989;2.344851,48.872393       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'resourceId' is invalid: it does not exist on this service"

  Scenario: [route] Route sur l'API osrm 1.0.0 avec mauvais profile 
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | test                                        |
      | optimization | fastest                                     |
      | coordinates  | 2.333865,48.881989;2.344851,48.872393       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'profileId' is invalid"

  Scenario: [route] Route sur l'API osrm 1.0.0 avec mauvaise optimisation 
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | test                                        |
      | coordinates  | 2.333865,48.881989;2.344851,48.872393       |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'optimizationId' is invalid"

  Scenario: [route] Route sur l'API osrm 1.0.0 avec mauvaises coordonnées 
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.333865,48.881989;2.344851,                |
    When I send the request 
    Then the server should send a response with status 400
    And the response should have an header "content-type" with value "application/json"
    And the response should contain "Parameter 'coordinates' is invalid"



