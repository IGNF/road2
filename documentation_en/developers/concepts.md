# Concepts used for Road2

This chapter describes several software concepts used in Road2. Most, if not all, are united by their objective: the modularity of the application.

## Part 1: Modularity of the application

### Independence between APIs and engines

This is the basic concept for understanding Road2's code.

#### API concepts

**An API, for Road2, is a set of routes that the server recognizes and groups within the same name**. For each name, there will potentially be several versions. And within each version there will potentially be multiple routes.

For example, if we consider an API called `rest` which only has one version `1.0.0`. In this API, one could define a single `compute` route which allows to request a route with minimal `start` and `end` parameters. We will then talk about the `rest/1.0.0` API which allows a user to obtain a route by making the request `/rest/1.0.0/compute?start=2,48&end=2,48.1`.

Each API is defined in a separate folder from the others. This makes them independent of each other. And for the same name, there is independence between two different versions. Implementation examples can be found in the {{ '[code apis]({}/tree/{}/src/js/apis)'.format(repo_url, repo_branch) }} folder.

#### Engine concept

**An engine, for Road2, is a software component that can perform various calculations**. This component can be a library, another web service, a database, etc...

For example, OSRM is an engine which is written in C++ and which offers a wrapper for use with NodeJS, and this via a NodeJS module. So it's a simple dependency in the `package.json`.

Incidentally, it seems useful to specify here that each engine is independent of the others through its implementation in the project code (see the notion of source below).

#### Concept of service

Road2 was coded to facilitate the management of APIs and engines. To achieve this goal, the API part and the engine part are separated and neither sees what the other is doing.

An API will therefore have to create a generic request object which will be sent to a *service*. This *service* will send the request to the engine concerned. The engine will therefore receive this object, perform a calculation, and create a generic response object which will then be returned to the API. The API can then format it if necessary for the user. **The *service* can be considered as a proxy between APIs and engines**.

This makes it possible to add or remove an API without such a modification impacting the engines. And vice versa.

### Link between resources and sources

It is the second most important concept after the independence of APIs and engines. It is necessary to understand it to develop on the project.

#### Notion of graph

It seems useful to discuss the notion of *graph*, according to Road2, to explain the following. When we do route calculation, we use an engine that reads a *graph* to generate the route. However, **a *graph* is a topology, ie a set of nodes and arcs that form a navigable whole, on which there is at least one cost**.

Indeed, each arc is associated with at least one cost. This cost can be the distance to the arc or the time it takes to drive across it. Thus, each cost can be seen as the couple *profile/optimization*, where *profile* is the means of transport (ex. car) and *optimization* is the type of travel that one wishes (ex. "faster ").

Some graphs can have multiple costs per topology (eg PGRouting, Valhalla) and others not (eg OSRM). But when calculating a route, only one cost is used.

#### Notion of source

As specified just above, to have a route, it is necessary to use an engine that uses a graph. The *source*, in the conceptual language of Road2, is the origin of the calculation. **The source contains the call to an engine on a specific graph to obtain the result of a calculation**. It is the link between the application and the real calculation, such as that of a route for example.

Concretely, a *source* gathers two entities:
- a Javascript class which makes the link between the rest of the code and the engine. Each engine will therefore be linked to Road2 by a child class of the `Source` class. This child class must contain the code that allows you to ask the engine for a route or something else (eg isochrone, etc...). This is what concerns the developer.
- each instance of the class, by a configuration which indicates where is the graph that the engine can read, therefore represents an engine for a real graph. We then have the possibility of concretely calculating a route. (C'est ce qui concerne l'administrateur du service d'itinéraire par l'intermédiaire de la configuration)#TODO. For example, an instantiated source will be the call to the OSRM engine on a graph, (ctd a file)#TODO, in osrm format.


From all that has just been said, we notice that adding an engine amounts to adding a child class of `Source`. This generates independence between each engine.

Moreover, in theory, a single source can call upon several engines to return a result. The bottom line is that a source only returns one result for a single query.

In the end, a source will take into account an instance of `Request`, do the calculation and return an instance of `Response`. This allows the source to remain independent from the rest of the code.

When calculating a route, you need at least a topology and the costs associated with this topology. A cost corresponds to a single travel mode and a single optimization (eg the Car/shorter couple).

It turns out that an OSRM graph contains only one cost per folder. It therefore makes it possible to calculate routes only on a single mode of travel and a single optimization. On the other hand, PgRouting offers as many cost columns as you want on the same topology. We find the same grouping of couples on a topology in Valhalla.

#### Notion of resource

However, for the user and for the service administrator, we have created the notion of *resource*. **A resource will be defined as a set of sources**. It is the resource that makes the link between a request and the right source to answer it.

Originally, the objective was to be able to combine several sources from the same data but with a different cost calculation, and therefore to give the *user* a simplified view of the technical constraints. The resource therefore being the *link* between the technical view and the user view. **Another way to view the resource is to view it as a graph that has multiple costs on each arc**.

This is useful for OSRM for example. In this case, care must therefore be taken when generating the data. When a resource is made, it is then imperative to use the same topology for several different cost calculations.

But since the beginning of the project, we have extended the possibilities by allowing to associate sources which do not have the same topology. Thus, today, a resource is only a collection of sources. There may only be one. This is often the case for PGRouting.

For the *administrator*, an instance of Road2 must be able to manage several resources. A resource will notably be configurable by a file. The server will read all the files contained in a folder indicated by the general configuration.

It should be noted that all this can also have an impact on constraints, such as filters. This is because the constraints are applied at the resource level and not at a source. This is a choice that simplifies the configuration.

Finally, note that Road2 is coded to make it easy to add new types of resources and sources independently. It is therefore possible to create different types of source and associate them within various types of resources.

### The operations

An operation is a calculation that we want to perform. A route calculation, an isochrone calculation, a distance calculation are examples of expected operations. However, a given engine cannot necessarily perform all these operations. One may be able to do routes and distance but not isochrones. It is therefore necessary to know what an engine can do.

Moreover, a given operation can be more or less resource-intensive. We will therefore potentially want to finely manage the authorizations for operations on the service or a resource.

Road2 therefore integrates the notion of operation to manage these different issues.

#### The settings

Each operation has parameters to perform a calculation. Most parameters can be grouped into categories. For example, a parameter could be a keyword from a list or a point representing coordinates.

Within these categories, checking the validity of a parameter will follow the same principle. For example, for a point, we will always check if it is included in a bounding box. For a keyword, we will check that it is indeed part of a predefined list.

In order to (pool)#TODO the code, classes of parameters have been created. And they can be used anywhere in the code. An example of using these classes can be found in the `simple/1.0.0` API.

### Interface: requests and responses

Now it is possible to talk in more detail about the interface between a given API and an engine. As specified above, the engine does not know the APIs and the APIs do not know the engines. Thus, to communicate, there is an interface which boils down to two classes of Javascript objects: `Request` and `Response`.

#### The Request Object

The `Request` class is considered a parent class. From it, you can create as many child classes as you want. Each instance of a `request` child class is a generic request that will be passed to an engine. The engine will therefore not know which API queried it, but it will have all the useful information to perform the requested calculation.

#### The Response object

When an engine has finished its calculation, it creates an object of its own. But to be understood by an API, it must create a `response` object, child class of `Response`, which represents a generic response that each API can understand. The API therefore does not know which engine made the calculation but it has all the useful information to respond to the user according to the expected format.

### Constraints

Road2 has developed the concept of constraint to allow more complex route calculations. A constraint is a condition that we give to Road2 and that it translates to the different engines that support these conditions.

For example, a classic condition found in all engines may be the prohibition to use highways.

These conditions have been generalized. In addition to being able to prohibit, one can prefer or avoid certain types of roads. And it is not limited to road types, we can define the roads concerned the condition in several ways. This can be related to its width, or to any information present in the database.

## Part 2: General operation of the Road2 app

This part describes the application of these concepts in the code during a classic execution.

### When launching the application

The Road2 project offers two web servers, a service and an administrator. It therefore has two entry points depending on the use you want to make of it. You can run just the service and it will work just fine. And we can also launch an administrator only. This will launch a service when asked to do so. Finally, you can launch both at once.

#### Admin launch

The first possible entry point is the `src/js/road2.js` file. This file will generate an instance of the `Administrator` class.

This administrator allows several things:
- It can be launched only to check the correct configuration of the administrator and the associated services. In this case, the process stops after the check and returns an error code to determine if there was a problem and its type.
- It can be launched in server mode to administer one or more services via an HTTP(S) API. In this case, the administrator will launch all the services already configured. It will also be possible to create others later.
- You can create an administrator without configuring a service. It will be possible to configure them later.

An administrator was created to perform tasks that would have interfered with the proper execution of the service.

The administrator was therefore created to be independent of the service. In their writing, they were thought to be launched into different processes. Thus, if the administrator has tedious tasks, it does not impact the service. If one falls, the other does not.

However, it is possible to start a service in the same process as its administrator.

#### Launching a service

The historical entry point is the `src/js/service/main.js` file. This file will generate an instance of the `Service` class.

This service is the object used to manage the resources offered by the current instance. It therefore contains a resource catalog and a resource manager.

Each resource contains multiple sources. Since several resources can point to common sources, the service contains a catalog of unique sources and a manager of these sources.

When the application is launched, we start by reading the configuration of the application to be able to instantiate the logger.

Once the logger is loaded, the configuration is completely checked. It is possible to configure a service with empty sources and resources folders. They can be filled in later. However, these folders must be specified when configuring the service.

After that, we load the resources and sources of the service indicated in the configuration if there are any. This is when files are read, stored in RAM if necessary, and database connections are made.

Finally, we end up loading the APIs exposed by the service. This is where ExpressJS creates the Node server(s) and loads the available routes.

#### Focus on configuration verification

Whether it is an administrator or a service, the configuration will be checked.

This usually goes through managers.

##### Managers

Most classes have a manager. This manager allows as specified just before to check the configurations. But it also allows you to create instances of the classes concerned. Finally, it also keeps track of the different instances and therefore allows them to be managed.

Managers are designed to be used in the following way: you create it without configuration. On the other hand, it can have other managers in parameter.
Once created, this manager can be used to verify a configuration. We can give it the configuration of an object or we can sometimes give it a set of configuration. In this second case, there will generally be consistency to be checked between each configuration.
Then, we can load objects from their configuration. It is important to check before loading. Because the loading assumes the validity of the configuration. Which is known by a check. In the same way, it is sometimes possible to load several objects with a single call to the manager. The fact of loading only once a configuration present in various places will be managed in the manager.

To work well, the manager will therefore have two lists. A rather short-lived list that will keep track of already verified configurations. It will be used to check the consistency of all the configurations. This list will have to be emptied when the verifications are finished.
The second list will be a list of already loaded configurations. This list is persistent and indicates the state of the manager. It is used to ensure that each configuration is loaded only once even if it is requested several times.
Also, when you want to modify the configuration during the life of the application, it is this list that will be considered first to check consistency. The first list will only be reused if it is a supposedly consistent set that is checked.

### When receiving a request

When a request arrives, it is processed by the ExpressJS router of the called API. It is possible to do the processing you want within this router. These treatments may have no relation to the rest of the application. It is an express router in the basic framework sense.

We can assume that the objective will be to make a route calculation. Road2 thus integrates several classes and several functions which make it possible to achieve this objective without touching the engines.

If there are pre-processings to be performed before launching a calculation, it will be preferable to define them in the `index.js` file which contains the definition of the router or in other files but which will be in the the API folder: `${apiName}/${apiVersion}`. The same operation will be preferred for the post-processings. This will keep the code modular.

Once the potential pre-processing has been done, it is necessary to create a `request` object to send it to the application service via the `service.computeRequest()` function. This function will launch the calculation and create a `response` object that the API can then rewrite to respond to the client.

NB: When processing a `req` request from ExpressJS, it will be possible to access the instance of the `Service` class which contains a lot of useful information. This will be possible by the `req.app.get("service")` method which returns the instance of the service.