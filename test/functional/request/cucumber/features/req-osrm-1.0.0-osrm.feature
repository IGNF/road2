Feature: Road2-osrm-1.0.0-osrm
  Tests fonctionnels de Road2 via l'API osrm/1.0.0 avec le moteur OSRM

  Background:
    Given I have loaded all my test configuration in "../../configurations/local-service.json"


  Scenario: Route sur l'API osrm 1.0.0
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.333865,48.881989;2.344851,48.872393       |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "code" with value "Ok"
    And the response should contain an attribute "waypoints"
    And the response should contain an attribute "routes"
