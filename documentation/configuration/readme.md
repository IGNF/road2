# Configuration de Road2

## Vue globale 

Pour instancier Road2, il est nécessaire de lui fournir un certain nombre d'informations. Pour cela, il y a différents JSON. Les fichiers que l'on va remplir vont dépendre de l'usage que l'on veut en faire. Nous allons présenter un usage complet. Ce dernier permettra de comprendre les autres usages. 

Un usage complet des possibilités offertes par le projet Road2 est le suivant : on veut instancier, dès le démarrage, un administrateur et son service. 

Dans ce cas là, nous aurons pour point d'entrée, le fichier *administration.json*. 

Ce fichier va indiquer plusieurs informations et deux éléments : 
- l'emplacement de la configuration des services : un *service.json* par services associés. 
- un *log4js.json* pour les logs de l'administrateur

Chaque *service.json* va indiquer les éléments suivants : 
- un *log4js.json* pour les logs de l'administrateur et un par service, 
- un *cors.json* par service si on souhaite spécifier une politique de CORS, 
- le dossier des *projections*, 
- les dossiers des *ressources*. 

## administration.json

Ce fichier indique quelques informations générales liées à l'instance d'administration. Son principal objectif est l'indication des logs et des services gérés. 

On peut trouver un [exemple](../../docker/config/road2.json) de ce fichier et le [modèle](./admin_model.yaml) au format YAML. 

## service.json

Ce fichier indique quelques informations générales liées à l'instance de Road2. Son principal objectif est l'indication des logs et des ressources du serveur. Néanmoins, il permet de préciser beaucoup plus d'informations, comme les opérations ou les projections disponibles sur l'instance. 

On peut trouver un [exemple](../../docker/config/service.json) de ce fichier et le [modèle](./service_model.yaml) au format YAML. 

## log4js.json

Ce fichier permet de spécifier le niveau des logs, l'emplacement des fichiers et le format de leur contenu. Il ne suit pas strictement la syntaxe des JSON employés pour configurer [log4js](https://log4js-node.github.io/log4js-node/).
Le format est celui d'un JSON qui contient deux objets `mainConf` et `httpConf`. Ces deux objets doivent être présents. 

Le contenu de `mainConf` est un objet de configuration log4js. Le contenu de `httpConf` est un attribut `level` reprenant les niveaux proposés par log4js et un attribut `format` reprenant la syntaxe disponible pour log4js. Ces deux attributs doivent être présents. 

On peut trouver un [exemple](../../docker/config/log4js-service.json) de ce fichier au format JSON. C'est celui qui est utilisé dans les images docker.  

## cors.json 

Ce fichier permet d'indiquer la configuration que l'on veut appliquer à l'application en terme de CORS. Son contenu est lié à la configuration du module [CORS](https://www.npmjs.com/package/cors#configuration-options) de NodeJS. 
On peut trouver un [exemple](../../docker/config/cors.json) de ce fichier au format JSON. C'est celui qui est utilisé dans les images docker.  

## Les projections 

Le fichier *server.json* indique un dossier de projections. Ce dossier peut contenir plusieurs fichiers JSON. Ces fichiers seront lus, indépendamment de leur extension, pour obtenir les informations nécessaires permettant à [PROJ4](http://proj4js.org/) d'effectuer des reprojections. 

On peut trouver un [exemple](../../docker/config/projections/projection.json) de ce fichier et le [modèle](./projection_model.yaml) au format YAML.

## Les ressources 

Dans le fichier *server.json*, il est possible d'indiquer plusieurs dossiers *resources*. Chaque dossier sera lu et les fichiers `*.resource` seront analysés par Road2. Chacun de ces fichiers représente une ressource pour Road2. 

On peut trouver un [exemple](../../docker/config/resources/corse.resource) de ce fichier et le [modèle](./resource_model_osrm.yaml) au format YAML pour OSRM. Pour PGRouting, il y a également un [exemple](./bduni_idf_pgr.resource) et un [modèle](./resource_model_pgr.yaml). 

### Les lua et les json des sources 

Chaque source d'une ressource est rattaché à un profile et une optimisation. Cela détermine un coût pour chaque tronçon du graphe. Pour calculer ces coût, nous utilisons un fichier spécifique qui contient les règles de passage des attributs d'un tronçon à son coût. Ce fichier est un json géré dans le projet route-graph-generator. Cer dernier contient donc au moins un exemple. 
À partir de ce json, un lua est créé pour OSRM. Ce fichier lua est aussi dans le projet route-graph-generator. 

Ces deux fichiers ne sont pas obligatoires dans la configuration mais ils sont fournis pour que l'on puisse retrouver les informations de création des graphes. Il est donc utile de les avoir. Ils devraient être fournis par route-graph-generator lors d'une génération. 

## Les fichiers liés à certains moteurs de Road2

### PGRouting: La configuration d'une base de données 

Afin de lire les données dans un base, il est nécessaire de fournir à Road2 un fichier qui lui donne les identifiants de connexion à la base. Cela est possible via un fichier json. Un exemple de ce fichier est fourni [ici](./configuration_bdd.json). Le contenu de ce fichier correspond aux options du module NodeJS `pg`. 