<<<<<<< HEAD
<<<<<<< HEAD
# Road2 reviews

This file describes all the tests that can be performed on Road2.

## Test procedures to validate a new version of Road2

When a new development has been made, it is advisable to validate them in the following way:


### Setting up the environment

This is to remove the docker images to be sure to start from scratch:
```
docker-compose down
docker image rm road2 r2gg pgrouting
docker network rm iti-data-network
docker volume rm iti-data-volume pgr-data-volume
```
For the reconstruction of the images, it is advisable to build them one by one:
```
# In the /docker/dev folder
=======
# Tests de Road2
=======
# Road2 reviews
>>>>>>> 5d82734 (second draft of doc)

This file describes all the tests that can be performed on Road2.

## Test procedures to validate a new version of Road2

When a new development has been made, it is advisable to validate them in the following way:


### Setting up the environment

This is to remove the docker images to be sure to start from scratch:
```
docker-compose down
docker image rm road2 r2gg pgrouting
docker network rm iti-data-network
docker volume rm iti-data-volume pgr-data-volume
```
For the reconstruction of the images, it is advisable to build them one by one:
```
<<<<<<< HEAD
# Dans le dossier /docker/dev
>>>>>>> a8e7531 (First draft on english documentation)
=======
# In the /docker/dev folder
>>>>>>> 5d82734 (second draft of doc)
docker-compose build road2
docker-compose build r2gg
docker-compose build pgrouting
```

<<<<<<< HEAD
<<<<<<< HEAD
The road2 image contains data but these are not sufficient to validate the entire application. We will therefore reconstruct data:
```
docker-compose up r2gg # with the .env filled in correctly: once for osrm and once for pgr
```

### Unit test validation

Unit tests are described [here](./unit/readme.md).

To summarize, just run the following command, having taken care to start Road2 via docker-compose:
=======
L'image road2 contient des données mais ces dernières ne sont pas suffisantes pour valider l'ensemble de l'application. On va donc reconstruire des données: 
=======
The road2 image contains data but these are not sufficient to validate the entire application. We will therefore reconstruct data:
>>>>>>> 5d82734 (second draft of doc)
```
docker-compose up r2gg # with the .env filled in correctly: once for osrm and once for pgr
```

### Unit test validation

Unit tests are described [here](./unit/readme.md).

<<<<<<< HEAD
Pour résumer, il suffit de lancer la commande suivante en ayant pris soin de démarrer Road2 via docker-compose: 
>>>>>>> a8e7531 (First draft on english documentation)
=======
To summarize, just run the following command, having taken care to start Road2 via docker-compose:
>>>>>>> 5d82734 (second draft of doc)
```
docker-compose exec road2 npm run utest
```

<<<<<<< HEAD
<<<<<<< HEAD
### Validation of integration tests

Integration tests are described [here](./integration/readme.md).

To summarize, just run the following command, having taken care to start Road2 via docker-compose:
=======
### Validation des tests d'intégration
=======
### Validation of integration tests
>>>>>>> 5d82734 (second draft of doc)

Integration tests are described [here](./integration/readme.md).

<<<<<<< HEAD
Pour résumer, il suffit de lancer la commande suivante en ayant pris soin de démarrer Road2 via docker-compose: 
>>>>>>> a8e7531 (First draft on english documentation)
=======
To summarize, just run the following command, having taken care to start Road2 via docker-compose:
>>>>>>> 5d82734 (second draft of doc)
```
docker-compose exec road2 npm run itest
```

<<<<<<< HEAD
<<<<<<< HEAD
### Validation of functional tests

Functional tests are described [here](./functional/readme.md).

To summarize, just run the following commands, having taken care to start Road2 via docker-compose:
```
docker-compose exec road2 npm run rtest #tests on requests
docker-compose exec road2 npm run artest #tests on admin requests
docker-compose exec road2 npm run crtest # further tests on requests
docker-compose exec road2 npm run drtest #tests that depend on data on requests
docker-compose exec road2 npm run ctest #tests on configuration
docker-compose exec road2 npm run cctest # further tests on the configuration

```

### Performance and load testing

Load tests are described [here](./load/readme.md).

To summarize, just run the following command, having taken care to start Road2 via docker-compose:
```
docker-compose up road2-gatling # with the .env correctly filled in to specify the test you want to do
```

### Code Quality
=======
### Validation des tests fonctionnels 
=======
### Validation of functional tests
>>>>>>> 5d82734 (second draft of doc)

Functional tests are described [here](./functional/readme.md).

To summarize, just run the following commands, having taken care to start Road2 via docker-compose:
```
docker-compose exec road2 npm run rtest #tests on requests
docker-compose exec road2 npm run artest #tests on admin requests
docker-compose exec road2 npm run crtest # further tests on requests
docker-compose exec road2 npm run drtest #tests that depend on data on requests
docker-compose exec road2 npm run ctest #tests on configuration
docker-compose exec road2 npm run cctest # further tests on the configuration

```

### Performance and load testing

Load tests are described [here](./load/readme.md).

To summarize, just run the following command, having taken care to start Road2 via docker-compose:
```
docker-compose up road2-gatling # with the .env correctly filled in to specify the test you want to do
```

<<<<<<< HEAD
### Qualité de code 

>>>>>>> a8e7531 (First draft on english documentation)
=======
### Code Quality
>>>>>>> 5d82734 (second draft of doc)
