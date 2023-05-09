<<<<<<< HEAD
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
=======
# Modifications du code en pratique 

Il est vivement conseillé de lire le chapitre qui traite des [concepts](./concepts.md) avant de lire celui-ci. 

## Principe générale 

Le principe le plus important pour Road2 est la modularité. Ce principe peut être vu comme un objectif à atteindre lors des développements. 

## Procédures pour certains types de modifications

### Moteurs 

Ajouter un moteur est relativement simple. Comme précisé dans les [concepts](./concepts.md), un moteur est l'équivalent d'une `source` dans Road2. On se refera donc à la partie [source](#Source) pour voir les modifications possibles sur les moteurs.

### API

Il est possible d'ajouter, d'enlever et de modifier une API. Toutes les APIs sont définies dans le dossier `src/js/apis`. Ce dossier suit l'arborescence suivante `${apiName}/${apiVersion}/index.js`. Le fichier `index.js` contient la définition de l'API. Ce fichier correspond à la définition d'un [router](https://expressjs.com/fr/4x/api.html#router) expressJS.

L'ensemble des APIs est chargé par `src/js/apis/apisManager.js`. Ce fichier permet la lecture du dossier des APIs et leurs prises en compte dans l'application.

Il est parfois utile d'effectuer des traitements lors du chargement de l'application. On voudra par exemple générer un getCapabilities. On pourra également vouloir le mettre à jour durant la vie de l'application. Un router ExpressJS ne permet pas de stocker des objets, ni d'effectuer des traitements avant la mise en place du serveur, ni pendant la vie de l'application.
Pour gérer de telles problématiques, il est possible de créer les fichiers `init.js` et `update.js` qui seront dans dans le dossier de l'api. Ces fichiers devront être des modules NodeJS qui exportent une fonction `run(app, uid)`. C'est cette fonction qui sera appelée lors de l'initialisation de l'application et lors des mises à jours nécessaires. Le paramètre `app` est l'instance d'ExpressJS qui permet de stocker des références à des objets. Et le paramètre `uid` est un identifiant propre à chaque api qui permet de stocker des objets avec un faible risque de le perdre en étant écrasés par un autre.

#### Modifier une API existante

Il suffit de modifier les fichiers contenus dans le dossier `${apiName}/${apiVersion}`.

#### Ajouter une API

Il suffit de créer l'arborescence `${apiName}/${apiVersion}/index.js` dans le dossier `src/js/apis` et d'ajouter les fichiers `init.js` et `update.js`. 

#### Supprimer une API

Pour supprimer une API, il suffit de supprimer le dossier qui contient sa définition.

### Resource

Le dossier `src/js/resources` contient la définition des ressources utilisables et un manager de ressource qui permet à l'application de gérer l'ensemble de ces ressources. 

Chaque ressource est une classe qui dérive de la classe mère `resource.js`. Cette classe définit une ressource comme l'ensemble d'un id unique à l'instance et un type.

Chaque ressource peut alors contenir autant d'information supplémentaire qu'on le souhaite. Mais elle permet surtout de faire le lien avec une source, ou plusieurs, lors d'une requête. Chaque ressource doit implémenter la fonction `getSourceIdFromRequest()`.

#### Ajouter une ressource

Pour ajouter une ressource, il suffit donc d'ajouter un fichier dans le dossier `src/js/resources`. Ce fichier sera la définition d'une classe fille de `resource.js`.

Pour que cette ressource soit prise en compte dans l'application, il suffit de modifier le manager de ressources `src/js/resources/resourceManager.js`. Ce fichier permet à l'application de savoir que cette nouvelle ressource est disponible. Il suffira de copier et coller certaines parties du code et de les adapter.

#### Supprimer une ressource

Pour supprimer une ressource, il suffit de supprimer le fichier qui contient sa définition et les parties du code qui la concerne dans le manager de ressources.

### Source

Le dossier `src/js/sources` contient un manager de source qui permet à l'application de gérer l'ensemble de ces sources, et la définition des sources utilisables.

Chaque source est une classe qui dérive de la classe mère `source.js`. Cette classe définit une source comme l'ensemble d'un id unique à l'instance, d'un type et d'un état de connexion.

Chaque source peut alors contenir autant d'information supplémentaire qu'on le souhaite. Mais elle permet surtout de faire le lien avec un moteur, ou plusieurs, lors d'une requête. Chaque ressource doit implémenter les fonctions `connect()`, `disconnect()` et `computeRequest()`.

#### Ajouter une source

Pour ajouter une source, il suffit donc d'ajouter un fichier dans le dossier `src/js/sources`. Ce fichier sera la définition d'une classe fille de `source.js`.

Pour que cette source soit prise en compte dans l'application, il suffit de modifier le manager de sources `src/js/sources/sourceManager.js`. Ce fichier permet à l'application de savoir que cette nouvelle source est disponible. Il suffira de copier et coller certaines parties du code et de les adapter.

Ensuite, il faut créer ou modifier une ressource pour qu'elle utilise cette nouvelle source.

#### Supprimer une source

Pour supprimer une source, il suffit de supprimer le fichier qui contient sa définition et les parties du code qui la concerne dans le manager de sources et les ressources qui l'utilisent.

### Request

Le dossier `src/js/requests` contient la définition des classes `Request` et toutes celles qui en dérivent. Lorsqu'une requête arrive, une API doit utiliser l'une de ces classes filles pour interroger un moteur via le service. Par exemple, il existe déjà une classe fille pour calculer des itinéraires: `routeRequest`.

Chaque classe fille contient des informations utiles pour que les moteurs puissent traiter la requête. Ces informations sont nécessaires pour certaines et facultatives pour d'autres. Néanmoins, pour une raison quelconque, on souhaitera parfois ajouter une nouvelle classe fille. Par exemple, pour traiter une nouvelle opération ou pour traiter autrement une opération déjà existante. Cela évitera de modifier une classe existante et tous les impacts que cela peut avoir sur la gestion des moteurs.

#### Modifier une Request

Une `Request` est un élément central dans Road2 car il fait le lien entre une API et un moteur. Pour cette raison, modifier une telle classe aura des impacts sur les APIs et les sources qui l'utilisent.

#### Supprimer une Request

Il suffit de supprimer la classe concernée et ses usages dans les APIs et les sources concernés.

#### Ajouter une Request

Il suffit de créer une classe fille de `Request` et d'implémenter son usage dans une ou plusieurs APIs et sources.

### Operation

Une opération est définie par un id et des paramètres. Un paramètre est quant à lui définie par un id et d'autres attributs. Tout cela se définit via des fichiers de configuration JSON. Ces documents doivent être placés dans deux dossiers: un pour les opérations et un pour les paramètres. Actuellement, ils sont dans `src/resources/`. Ces dossiers sont précisés dans le fichier de configuration de l'application.

Les dossiers `src/js/operations` et `src/js/parameters` contiennent le code nécessaire à la gestion des opérations et des paramètres.

Il y a une distinction à faire entre les opérations de service et les opérations de ressource. Les opérations de services sont les opérations permises sur le service. Elles sont décrites par les JSON de `src/resources/`. Les opérations de ressource sont la déclinaison de ces opérations avec des paramètres spécifiques à chaque ressource. Ils sont décrits dans le fichier ressource.
Par exemple, on peut déclarer une opération de service que l'on nommera `route`. Pour le service, cette opération existe, est disponible et est décrite via des fichiers JSON. Cette opération peut nécessiter un paramètre `start`. À ce niveau, on sait que l'opération, que le paramètre existe et est obligatoire. Mais on ne sait pas quelles valeurs il peut prendre. Cela dépend de la ressource. Chaque ressource peut avoir une emprise différente.

#### Ajouter/modifier/supprimer une opération

Il suffit de travailler sur les fichiers JSON qui décrivent les opérations.

#### Ajouter/modifier/supprimer un type de paramètre

Il suffit de travailler sur les classes filles de `resourceParameter` et le `parameterManager`.
>>>>>>> a8e7531 (First draft on english documentation)
