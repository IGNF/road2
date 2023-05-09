<<<<<<< HEAD
# Docker-compose for testing

## Building and using with docker-compose

### Prerequisites

To use `docker-compose`, just:
- install `docker`.
- go to the `/docker/test/` folder of the Road2 project.
- create a `.env` file next to the `docker-compose.yml` which will be an adapted copy of the `compose.env.example`

### Building images

It is possible to use the Dockerfiles of each project to build the images one by one. But it can be done automatically via docker-compose.

Just run the `docker-compose build` command.

## Run tests

### Load testing with gatling

After filling in the `.env` by pointing, for example, to the `user-files` of this {{ '[repository]({}/tree/{}/test/load/gatling/user-files/)' .format(repo_url, repo_branch) }} and having taken care to choose a scenario, just run the command:
```
# Once the .env has been modified to choose the particular scenario
# Choose the scenario (warning road2Docker does not work until docker-compose up generate-load-data has been called at least once)
docker-compose up load-road2
```

## Generate data for testing

### Load testing with gatling

By default, the r2gg docker image allows to generate data for Road2 which comes from OSM data. In this case, this repository already contains queries and gatling scenarios to test Road2 on this data.

But if r2gg's docker image was used to create a resource pointing to a different location, it will need to generate data for testing.

To do this, simply modify the bbox of the `.env` and run the following command:
```
# Once the .env has been modified
docker-compose up generate-load-data
```

This command starts the generation of an `ssv` file in a docker volume. This file is then proposed in the gatling scenarios under the name of `dataOsm`. Moreover, this scenario will not work until a data has been generated with this docker-compose.
```
# After generating via this docker-compose
# Modify the .env to choose the 'dataOsm' scenario
docker-compose up load-road2
```

### Use data and scenarios from the host machine

If you want to use data and scenarios stored on the host machine, you just have to modify the `.env` to point to another `user-files`.
=======
# Docker-compose pour faire des tests

## Construction et utilisation avec docker-compose 

### Pré-requis

Pour utiliser `docker-compose`, il suffit de :
- installer `docker`.
- se placer dans le dossier `/docker/test/` du projet Road2.
- créer un fichier `.env` à côté du `docker-compose.yml` qui sera une copie adaptée du `compose.env.example`

### Construction des images

Il possible d'utiliser les Dockerfiles de chaque projet pour builder les images une par une. Mais cela peut se faire automatiquement via docker-compose.

Il suffit de lancer la commande `docker-compose build`.

## Lancer des tests

### Tests de charge avec gatling

Après avoir rempli le `.env` en pointant, par exemple, sur le `user-files` de ce {{ '[dépôt]({}/tree/{}/test/load/gatling/user-files/)'.format(repo_url, repo_branch) }} et en ayant pris soin de choisir un scénario, il suffit d'exécuter la commande :
```
# Une fois le .env modifié pour choisir le scénario notamment
# Choisir le scénario (attention road2Docker ne fonctionne pas tant que docker-compose up generate-load-data n'a pas été appelé au moins une fois)
docker-compose up load-road2
```

## Générer des données pour les tests

### Tests de charge avec gatling

Par défaut, l'image docker de r2gg permet de générer des données pour Road2 qui sont issues de données OSM. Dans ce cas, ce dépôt contient déjà des requêtes et des scénarii gatling permettant de tester Road2 sur ces données. 

Mais si l'image docker de r2gg a été utilisée pour créer une ressource pointant sur un endroit différent, il sera nécessaire de générer des données pour les tests. 

Pour cela, il suffira de modifier la bbox du `.env` et de lancer la commande suivante : 
```
# Une fois le .env modifié
docker-compose up generate-load-data
```

Cette commande lance la génération d'un fichier `ssv` dans un volume docker. Ce fichier est ensuite proposé dans les scénarii gatling sous le nom de `dataOsm`. Par ailleurs, ce scénario ne fonctionnera donc pas tant qu'une donnée n'aura pas été générée avec ce docker-compose. 
```
# Après la génération via ce docker-compose
# Modifier le .env pour choisir le scénario 'dataOsm'
docker-compose up load-road2
```

### Utiliser des données et scénarii de la machine hôte

Si on souhaite utiliser des données et des scénarii stockés sur la machine hôte, il suffira de modifier le `.env` pour pointer vers un autre `user-files`. 
>>>>>>> a8e7531 (First draft on english documentation)
