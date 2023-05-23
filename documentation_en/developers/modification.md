# Code changes in practice

It is strongly advised to read the chapter dealing with [concepts](./concepts.md) before reading this one.

## General principle

The main principle for Road2 is modularity. This principle can be seen as an objective to be achieved during developments.

## Procedures for certain types of modifications

### Engines

Adding an engine is relatively simple. As stated in [concepts](./concepts.md), an engine is the equivalent of a `source` in Road2. We will therefore refer to the [source](#Source) part to see the possible modifications to the engines.

### API

It is possible to add, remove and modify an API. All APIs are defined in the `src/js/apis` folder. This folder follows the following tree `${apiName}/${apiVersion}/index.js`. The `index.js` file contains the API definition. This file corresponds to the definition of an expressJS [router](https://expressjs.com/fr/4x/api.html#router).

All APIs are loaded by `src/js/apis/apisManager.js`. This file is used to read the APIs folder and their inclusion in the application.

It is sometimes useful to perform processing when the application is loaded. For example, we want to generate a getCapabilities. We may also want to update it during the life of the application. An ExpressJS router does not store objects, nor perform processing before setting up the server, nor during the life of the application.
To manage such issues, it is possible to create the `init.js` and `update.js` files which will be in the API folder. These files will need to be NodeJS modules that export a `run(app, uid)` function. It is this function that will be called when initializing the application and during the necessary updates. The `app` parameter is the instance of ExpressJS that is used to store references to objects. And the `uid` parameter is an identifier specific to each API which makes it possible to store objects with a low risk of losing it by being overwritten by another.

#### Modify an existing API

Just modify the files contained in the `${apiName}/${apiVersion}` folder.

#### Add an API

Just create the `${apiName}/${apiVersion}/index.js` tree in the `src/js/apis` folder and add the `init.js` and `update.js` files.

#### Delete an API

To delete an API, simply delete the folder that contains its definition.

### Resource

The `src/js/resources` folder contains the definition of usable resources and a resource manager that allows the application to manage all of these resources.

Each resource is a class that derives from the parent `resource.js` class. This class defines a resource as the set of an instance-unique id and a type.

Each resource can then contain as much additional information as desired. But above all, it makes it possible to make the link with a source, or several, during a request. Each resource must implement the `getSourceIdFromRequest()` function.

#### Add Resource

To add a resource, all you have to do is add a file to the `src/js/resources` folder. This file will be the definition of a child class of `resource.js`.

For this resource to be taken into account in the application, it is enough to modify the resource manager `src/js/resources/resourceManager.js`. This file lets the application know that this new resource is available. It will be enough to copy and paste some parts of the code and adapt them.

#### Delete a resource

To delete a resource, simply delete the file that contains its definition and the parts of the code that concerns it in the resource manager.

### Source

The `src/js/sources` folder contains a source manager that allows the application to manage all of these sources, and the definition of the sources that can be used.

Each source is a class that derives from the parent `source.js` class. This class defines a source as the set of an instance-unique id, type, and connection state.

Each source can then contain as much additional information as desired. But above all, it makes it possible to make the link with one engine, or several, during a request. Each resource must implement the `connect()`, `disconnect()` and `computeRequest()` functions.

#### Add source

To add a source, all you have to do is add a file in the `src/js/sources` folder. This file will be the definition of a child class of `source.js`.

For this source to be taken into account in the application, you just have to modify the sources manager `src/js/sources/sourceManager.js`. This file lets the application know that this new source is available. It will be enough to copy and paste some parts of the code and adapt them.

Then, you must create or modify a resource so that it uses this new source.

#### Delete source

To delete a source, all you have to do is delete the file that contains its definition and the parts of the code that concerns it in the source manager and the resources that use it.

### Request

The `src/js/requests` folder contains the definition of the `Request` classes and all those derived from them. When a request arrives, an API must use one of these child classes to query an engine through the service. For example, there is already a child class for calculating routes: `routeRequest`.

Each child class contains useful information so that the engines can process the request. This information is necessary for some and optional for others. However, for some reason, we sometimes want to add a new child class. For example, to process a new transaction or to otherwise process an existing transaction. This will avoid modifying an existing class and all the impacts it may have on engine management.

#### Modify a Request

A `Request` is a central element in Road2 because it makes the link between an API and an engine. For this reason, modifying such a class will have impacts on the APIs and sources that use it.

#### Delete a Request

All you have to do is delete the class concerned and its uses in the APIs and sources concerned.

#### Add a Request

All you have to do is create a child class of `Request` and implement its use in one or more APIs and sources.

### Operation

An operation is defined by an id and parameters. A parameter is defined by an id and other attributes. All of this is defined via JSON configuration files. These documents should be placed in two folders: one for operations and one for settings. Currently they are in `src/resources/`. These folders are specified in the application configuration file.

The `src/js/operations` and `src/js/parameters` folders contain the code needed to manage operations and parameters.

There is a distinction between service operations and resource operations. Service operations are the operations permitted on the service. They are described by the JSON of `src/resources/`. Resource operations are the variation of these operations with parameters specific to each resource. They are described in the resource file.
For example, we can declare a service operation that we will name `route`. For the service, this operation exists, is available, and is described via JSON files. This operation may require a `start` parameter. At this level, we know that the operation is available and that the parameter exists and is mandatory. But we do not know what values it can take. It depends on the resource. Each resource can have a different bounding box.

#### Add/modify/delete an operation

It is enough to work on the JSON files which describe the operations.

#### Add/edit/delete a parameter type

It is enough to work on the child classes of `resourceParameter` and the `parameterManager`.