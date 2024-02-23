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
    And the response should contain an attribute "routes.[0].geometry"
    And the response should contain an attribute "routes.[0].distance"
    And the response should contain an attribute "routes.[0].duration"
    And the response should contain an attribute "routes.[0].legs"
    And the response should contain an attribute "routes.[0].legs.[0].distance"
    And the response should contain an attribute "routes.[0].legs.[0].duration"
    And the response should contain an attribute "routes.[0].legs.[0].steps"
    And the response should contain an attribute "routes.[0].legs.[0].summary"
    And the response should contain an attribute "waypoints.[0].name"
    And the response should contain an attribute "waypoints.[0].distance"
    And the response should contain an attribute "waypoints.[0].location"
    And the response should contain an attribute "waypoints.[0].hint"

  Scenario: [osrm/1.0.0] Route avec point intermédiaire 
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.431111978054117,48.843103213614626;2.332134095987717,48.871144172016784;2.382134095987717,48.851144172016784       |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "code" with value "Ok"
    And the response should contain an attribute "waypoints.[2].name"
    And the response should contain an attribute "routes.[0].legs.[1].summary"

  Scenario: [osrm/1.0.0] Route avec steps=false (default)
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.431111978054117,48.843103213614626;2.332134095987717,48.871144172016784;2.382134095987717,48.851144172016784       |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "code" with value "Ok"
    And the response should not contain an attribute "routes.[0].legs.[0].steps.[0]"

  Scenario: [osrm/1.0.0] Route avec steps=false explicitement
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.431111978054117,48.843103213614626;2.332134095987717,48.871144172016784;2.382134095987717,48.851144172016784       |
    And with query parameters:
      | key    | value         |
      | steps  | false         |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "code" with value "Ok"
    And the response should not contain an attribute "routes.[0].legs.[0].steps.[0]"

  Scenario: [osrm/1.0.0] Route avec steps=true
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.431111978054117,48.843103213614626;2.332134095987717,48.871144172016784;2.382134095987717,48.851144172016784       |
    And with query parameters:
      | key    | value         |
      | steps  | true          |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "code" with value "Ok"
    And the response should contain an attribute "routes.[0].legs.[0].steps.[0].name"
    And the response should contain an attribute "routes.[0].legs.[0].steps.[0].distance"
    And the response should contain an attribute "routes.[0].legs.[0].steps.[0].duration"
    And the response should contain an attribute "routes.[0].legs.[0].steps.[0].mode"
    And the response should contain an attribute "routes.[0].legs.[0].steps.[0].geometry"
    And the response should contain an attribute "routes.[0].legs.[0].steps.[0].maneuver"
    And the response should contain an attribute "routes.[0].legs.[0].steps.[0].intersections"

  Scenario: [osrm/1.0.0] Route avec geometries=polyline (default)
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.431111978054117,48.843103213614626;2.332134095987717,48.871144172016784;2.382134095987717,48.851144172016784       |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "code" with value "Ok"
    And the response should contain a string attribute "routes.[0].geometry"
    And the response should contain a string attribute "waypoints.[0].hint"

  Scenario: [osrm/1.0.0] Route avec geometries=polyline explicitement
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.431111978054117,48.843103213614626;2.332134095987717,48.871144172016784;2.382134095987717,48.851144172016784       |
    And with query parameters:
      | key         | value            |
      | geometries  | polyline         |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "code" with value "Ok"
    And the response should contain a string attribute "routes.[0].geometry"
    And the response should contain a string attribute "waypoints.[0].hint"

  Scenario: [osrm/1.0.0] Route avec geometries=geojson
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.431111978054117,48.843103213614626;2.332134095987717,48.871144172016784       |
    And with query parameters:
      | key         | value            |
      | geometries  | geojson          |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "code" with value "Ok"
    And the response should contain a string attribute "routes.[0].geometry.type"
    And the response should contain a string attribute "waypoints.[0].hint"

  Scenario: [osrm/1.0.0] Route avec geometries=geojson et steps=true
    Given an "GET" request on operation "<resource>/<profile>/<optimization>/route/v1/_/<coordinates>" in api "osrm" "1.0.0"
    And with path parameters:
      | key          | value                                       |
      | resource     | bduni-idf-osrm                              |
      | profile      | car                                         |
      | optimization | fastest                                     |
      | coordinates  | 2.431111978054117,48.843103213614626;2.332134095987717,48.871144172016784       |
    And with query parameters:
      | key         | value            |
      | geometries  | geojson          |
      | steps       | true             |
    When I send the request 
    Then the server should send a response with status 200
    And the response should have an header "content-type" with value "application/json"
    And the response should contain an attribute "code" with value "Ok"
    And the response should contain a string attribute "routes.[0].geometry.type"
    And the response should contain a string attribute "routes.[0].legs.[0].steps.[0].geometry.type"
    And the response should contain a string attribute "waypoints.[0].hint"