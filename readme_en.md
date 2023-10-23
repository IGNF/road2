# Road2

## General presentation

Road2 is a route and isochrone calculation server written in Javascript and designed to work with NodeJS. This server offers the calculation of routes and isochrones via existing engines like [OSRM](https://github.com/Project-OSRM/osrm-backend) or [PGRouting](https://pgrouting.org/ ). Road2 is therefore an interface for calculation engines. These are not done in Road2's code but via calls to its engines. This can mean calling a library, or a database, or another web service.

Road2 was designed with the idea of being able to easily add new engines and new APIs, and this, in a completely transparent way for each other. In other words, adding an engine has no impact on existing APIs. The goal is to facilitate the addition of new features while maintaining access to the service. For a longer discussion on the software concepts introduced in Road2, please refer to the [following documentation](./documentation_en/developers/concepts.md).

Currently, Road2 offers three engines, OSRM, PGRouting and Valhalla, through a single REST API.

## Features available

Road2 offers several sets of features:
- Calculate routes
- Calculate isochrones and isodistances
- Manage the service
- etc...

These sets include all the functionalities and are detailed [here](./documentation_en/developers/functionalities.md).

## Licence

Road2 is released under the GPL v3 license.

## Service discovery

### Demonstrator

IGN offers a demonstrator for [the route](https://geoservices.ign.fr/documentation/services_betas/itineraires.html) and [the isochrone](https://geoservices.ign.fr/documentation/services_betas/isochrones.html). These demonstrators allow you to build queries via a map and visualize the results.

Otherwise, for a first grip of the service locally, it is possible to use the [alpine](./docker/demonstration/Dockerfile) image of Road2. This will make it possible to have a local instance of the service and a web page allowing it to be tested. Setup instructions are given [here](./documentation_en/docker/demonstration/readme.md).

### Discover and test the service's APIs

IGN offers a visualization of the user API for [the itinerary](https://geoservices.ign.fr/documentation/services/api-et-services-ogc/itineraires/api) and [the isochrone](https://geoservices.ign.fr/documentation/services/api-et-services-ogc/isochrone/api).

IGN also offers pages for testing an instance of the service throughout France, with map visualization. There is a page for the [itinerary](https://geoservices.ign.fr/documentation/services/api-et-services-ogc/itineraires) and a page for the [isochrone](https://geoservices.ign.fr/documentation/services/api-et-services-ogc/isochrones).

Otherwise, all available APIs are documented in this [folder](./documentation_en/apis/). At the moment there is only one user API which is documented via a [file](./documentation_en/apis/simple/1.0.0/api.json) JSON using openapi 3.0.0, and one documented admin API via another [file](./documentation_en/apis/administration/1.0.0/api.json) JSON following the same formating.

It is possible to view these API documentations locally by following the instructions that are [here](./documentation_en/docker/demonstration/readme.md).

## Installing and using Road2

### Prerequisites

To use this project, it is necessary to have NodeJS installed on the machine used. The NodeJS version used during development is *12.14.0*.

### Installing modules

The installation of the modules is carried out via NPM. Going to the root of the project:
```
npm install
```

NB: There are optional dependencies to manage those of each engine. For more information, see this [document](./documentation_en/production/readme.md).

### Data generation

Whatever the data source, it is necessary to provide it in one of the formats used by Road2. Since Road2 can use several calculation engines, it accepts several data formats:
- OSRM 5.26.0 makes it possible to use OSRM data generated with this version.
- PGRouting 3.1.3 makes it possible to use a database using this version. It will be necessary to add the project procedures [pgrouting-procedures](https://github.com/IGNF/pgrouting-procedures) so that Road2 can communicate with the database.

This data can therefore be generated from any database, or from OSM files. The [route-graph-generator](https://github.com/IGNF/route-graph-generator) project offers tools to generate graphs from any database or OSM files. (If the database does not correspond to the format of the database expected by route-graph-generator, it will suffice to derive it.)#TODO


For a detailed discussion of the expected data, refer to this [documentation](./documentation_en/data/readme.md).

### Setup

In order for the server to work, it is necessary to [configure](./documentation_en/configuration/readme.md). This involves creating a tree structure of a few JSON files allowing instantiation of the server with resources.

### Launch

Once configured, it is possible to launch an instance of Road2 with the command:
```
node ${road2}/src/js/road2.js --ROAD2_CONF_FILE=${configuration}/administration.json
```

### For more details

In the [docker/distributions](./docker/distributions) folder, you will find different Dockerfiles that allow you to see the installation and test the service on different platforms. At the moment, Debian 10 is available.

## Participate in developments

Contributing to this project is welcome (see our [code of conduct](./CODE_OF_CONDUCT.md) on this subject). We have set up a [guide](./CONTRIBUTING.md) of contributions to help you in this process.

Developer documentation can be found [here](./documentation_en/developers/readme.md). It indicates the useful concepts to carry out developments on Road2.

To learn more about our roadmap, you can look at the [IGNF/Road2 Roadmap](https://github.com/orgs/IGNF/projects/3) project.

Finally, it is possible to use this [docker-compose](./documentation_en/docker/dev/readme.md) to have a development environment including building binaries, modules and generating data.

## Production use

In order to use Road2 in production, several informations are given in this [document](./documentation_en/production/readme.md). These are mainly the needs already observed for a production launch of the service covering the whole of French territory.
