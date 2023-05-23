# List of features

Road2 offers a set of features spread across several groups.



## Function group 1: Interface for calculating routes

### Define a start point, an end point and intermediate points

Classic and unavoidable functionalities, they will not be detailed here. Precision: it is possible to specify as many intermediate points as desired.

### Define Constraints

The notion of constraint is defined in the [concepts](./concepts.md). Basically, it's about specifying conditions that the route must meet. The best known is certainly the prohibition to take highways. But we can have much more complex conditions and we can apply several of them to the calculation of a route.

### Specify the resource used

As specified in the [concepts](./concepts.md), Road2 manages resources. Each request must specify the resources it is querying.

### Specify the desired profile

It is possible to specify which means of transport the itinerary concerns.

### Specify the desired optimization

It is possible to specify the optimization to be applied during the calculation.

### Add information on each section

Depending on the data present in the graphs, it is possible to choose the information to be retrieved in the calculation response.

### Specify the content of the response

Via several parameters, it is possible to specify the content of the response:
- The presence or not of the steps of the course.
- The format of the geometries in the response. At the moment, geojson, polyline and wkt are available.
- Whether or not a bbox is present in the response.

### Choose request and response units

Using request parameters, it is possible to influence the format of the request itself, and of the response:
- You can define the projection used.
- The format of the durations can be modified.
- The format of the distances is modifiable.




## Feature group 2: Interface for calculating isochrones and isodistances

### Define a start or end point

Inevitable functionality for the calculation of an isochrone.

### Specify the resource used

As specified in the [concepts](./concepts.md), Road2 manages resources. Each request must specify the resources it is querying.

### Specify the type of cost used

Various costs are possible for the calculation, so it should be specified.

### Set cost value used

Inevitable features for such a calculation.

### Specify the desired profile

It is possible to specify which means of transport the isochrone concerns.

### Indicate the direction considered for the calculation result

An isochrone can be defined in two directions: departure or arrival. It is therefore a question of specifying which one.

### Define Constraints

The notion of constraint is defined in the [concepts](./concepts.md). It is limited to prohibitions, such as, for example, the prohibition to take motorways.

### Specify the content of the response

Via several parameters, only one for the moment, it is possible to specify the content of the response:
- The format of the geometries in the response. At the moment, geojson, polyline and wkt are available.

### Choose request and response units

Using request parameters, it is possible to influence the format of the request itself, and of the response:
- It is possible to define the projection used.
- The format of the durations can be modified.
- The format of the distances is modifiable.


## Feature group 3: Provide a web service

Road2 takes the form of a web server which provides a route calculation service. So it has several features related to that.

### Use HTTP and HTTPS protocols

Self-explanatory feature.

### Configure CORS

Self-explanatory feature.

### Have several APIs

As presented in the [concepts](./concepts.md), Road2 offers the possibility of offering customers different APIs simultaneously.

### Have multiple engines

As presented in the [concepts](./concepts.md), Road2 offers the possibility of offering customers different engines simultaneously.


## Feature Group 4: Administer Service

The service can be administered in two ways: configuration and a dedicated API.

### Configure resources via configuration

Via the configuration file of the server, it is possible to create [resources](./concepts.md) which will be based on one or more [sources](./concepts.md).

### Limit certain uses via configuration

Road2's APIs offer several options, such as the ability to calculate routes with intermediate points. It may be interesting to limit the usage of these options so as not to overload the service.

### Get server version via API

Self-explanatory feature.

### Get server health status via API

Feature being implemented. The goal is to retrieve the status of each [source](./concepts.md) from the server and report it.

## Feature Group 5: OSRM Specific Features

### Graph optimization for faster responses

Self-explanatory feature.

### Route calculation

Self-explanatory feature.

### Management of simple constraints or exclusions

The exclusions are the classic constraints such as the prohibition to use certain types of roads (eg motorways). These are the only constraints available through OSRM.

### Determine the nearest graph point

For a given point, OSRM can return the nearest points of the graph.

## Feature Group 6: PGRouting Specific Features

### Route calculation

Self-explanatory feature.

### Isochrone calculation

Self-explanatory feature.

### Management of complex constraints

PGRouting manages all types of constraints, from the simplest to the most complex. We can therefore prohibit access to motorways or prefer roads that have a width greater than 5 meters.


## Feature Group 7: Simple API/1.0.0 Specific Features

### Getting a GetCapabilities

The GetCapabilities is a JSON response that describes the parameters for each operation and the values available for an instance of Road2.

An example can be found in {{ '[documentation]({}/tree/{}/documentation/apis/simple/1.0.0/)'.format(repo_url, repo_branch) }}.