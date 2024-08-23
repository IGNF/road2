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
Par exemple, on peut déclarer une opération de service que l'on nommera `route`. Pour le service, cette opération existe, est disponible et est décrite via des fichiers JSON. Cette opération peut nécessiter un paramètre `start`. À ce niveau, on sait que l'opération est disponible, que le paramètre existe et est obligatoire. Mais on ne sait pas quelles valeurs il peut prendre. Cela dépend de la ressource. Chaque ressource peut avoir une emprise différente.

#### Ajouter/modifier/supprimer une opération

Il suffit de travailler sur les fichiers JSON qui décrivent les opérations.

#### Ajouter/modifier/supprimer un type de paramètre

Il suffit de travailler sur les classes filles de `resourceParameter` et le `parameterManager`.
