# Configuration de Road2

## Vue globale 

Pour instancier Road2, il est nécessaire de lui fournir un certain nombre d'informations. Pour cela, il y a un unique point d'entrée qui est le *server.json*. Ce fichier va indiquer l'emplacement des autres: *log4js.json* pour les logs, le dossier des *projections* et les dossiers des *ressources*. 

## server.json

Ce fichier indique quelques informations générales liées à l'instance de Road2. Son principal objectif est l'indication des logs et des ressources du serveur. Néanmoins, il permet de préciser beaucoup plus d'informations, comme les opérations ou les projections disponibles sur l'instance. 

On peut trouver un [exemple](./configuration_example.yaml) de ce fichier et le [modèle](./configuration_model.yaml) au format YAML. 

## log4js.json

Ce fichier permet de spécificier le niveau des logs, l'emplacement des fichiers et le format de leur contenu. Il ne suit pas strictement la syntaxe des JSON employés pour configurer [log4js](https://log4js-node.github.io/log4js-node/).

On peut trouver un [exemple](../../docker/config/log4js.json) de ce fichier au format JSON. C'est celui qui est utilisé dans les images docker.  

## Les projections 

Le fichier *server.json* indique un dossier de projections. Ce dossier peut contenir plusieurs fichiers JSON. Ces fichiers seront lus, indépendamment de leur extension, pour obtenir les informations nécessaires permettant à [PROJ4](http://proj4js.org/) d'effectuer des reprojections. 

On peut trouver un [exemple](./projection_example.yaml) de ce fichier et le [modèle](./projection_model.yaml) au format YAML.

## Les ressources 

Dans le fichier *server.json*, il est possible d'indiquer plusieurs dossiers *resources*. Chaque dossier sera lu et les fichiers `*.resource` seront analysés par Road2. Chacun de ces fichiers représente une ressource pour Road2. 

On peut trouver un [exemple](./resource_example_osrm.yaml) de ce fichier et le [modèle](./resource_model_osrm.yaml) au format YAML pour OSRM. Pour PGRouting, il y a également un [exemple](./resource_example_pgr.yaml) et un [modèle](./resource_model_pgr.yaml). 