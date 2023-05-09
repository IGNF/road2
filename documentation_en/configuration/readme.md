# Road2 Setup

## Overview

To instantiate Road2, it is necessary to provide it with some information. For that, there are different JSON. The files that we are going to fill will depend on the use we want to make of them. We will present a complete use. This will help to understand the other uses.

A complete use of the possibilities offered by the Road2 project is as follows: we want to instantiate, from the start, an administrator and its service.

In this case, our entry point will be the *administration.json* file.

This file will indicate several pieces of information and two elements:
- the location of the service configuration: one *service.json* per associated service.
- a *log4js.json* for the administrator logs

Each *service.json* will indicate the following:
- a *log4js.json* per service for the logs,
- a *cors.json* per service if you want to specify a CORS policy,
- the *projections* folder,
- the *ressources* files, #TODO
- the *sources* folders.

## administration.json

This file indicates some general information related to the administration instance. Its main purpose is the indication of logs and managed services.

You can find an [example](../../docker/config/road2.json) of this file and the [model](./administration/admin_model.yaml) in YAML format.

## service.json

This file indicates some general information related to the instance of a service. Its main purpose is the indication of logs, sources and server resources. However, it allows you to specify much more information, such as the operations or projections available on the instance.

You can find an [example](../../docker/config/service.json) of this file and the [model](./services/service_model.yaml) in YAML format.

## log4js.json

This file is used to specify the level of the logs, the location of the files and the format of their content. It does not strictly follow the JSON syntax used to configure [log4js](https://log4js-node.github.io/log4js-node/).
The format is that of a JSON which contains two objects `mainConf` and `httpConf`. Both of these must be present.

The content of `mainConf` is a log4js configuration object. The content of `httpConf` is a `level` attribute containing the levels offered by log4js and a `format` attribute containing the syntax available for log4js. Both of these attributes must be present.

You can find an [example](../../docker/config/log4js-service.json) of this file in JSON format. This is the one used in docker images.

## cors.json

This file allows you to specify the configuration that you want to apply to the application in terms of CORS. Its content is related to the [CORS](https://www.npmjs.com/package/cors#configuration-options) module configuration of NodeJS.
You can find an [example](../../docker/config/cors.json) of this file in JSON format. This is the one used in docker images.

## The projections

The *service.json* file indicates a projections folder. This folder can contain multiple JSON files. These files will be read, regardless of their extension, to obtain the necessary information allowing [PROJ4](http://proj4js.org/) to perform reprojections.

You can find an [example](../../docker/config/projections/projection.json) of this file and the [model](./projections/projection_model.yaml) in YAML format.

## The sources

In *service.json* type files, it is possible to specify several *sources* folders. Each folder will be read and the `*.source` files will be analyzed by Road2. Each of these files represents a source for Road2.

We can find in {{ '[documentation/configuration/sources]({}/tree/{}/documentation/configuration/sources)'.format(repo_url, repo_branch) }} an example of this kind of file for each type of source available in the Road2 code.

## The resources

In the *service.json* files, it can also point to several *resources* folders. Each folder will be read and the `*.resource` files will be analyzed by Road2. Each of these files represents this time a resource for Road2.

You can find, in this {{ '[documentation/configuration/resources]({}/tree/{}/documentation/configuration/resources)'.format(repo_url, repo_branch) }}, an example of this kind of file for each type of resource available in the Road2 code. Each type follows the same YAML model.

## Files related to some Road2 engines

### PGRouting: Configuring a database

In order to read the data in a database, it is necessary to provide Road2 with a file that gives it the login credentials to the database. This is possible through a json file. An example of this file is provided [here](./pgrouting/configuration_bdd.json). The content of this file corresponds to the options of the NodeJS module `pg`.