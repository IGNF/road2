<<<<<<< HEAD
<<<<<<< HEAD
# Description of unit tests

To run the unit tests, it is advisable to use docker-compose in order to have a more complete test environment:
=======
# Description des tests unitaires 

Pour lancer les tests unitaires, il est conseillé d'utiliser docker-compose afin de disposer d'un environnement de test plus complet:
>>>>>>> a8e7531 (First draft on english documentation)
=======
# Description of unit tests

To run the unit tests, it is advisable to use docker-compose in order to have a more complete test environment:
>>>>>>> 5d82734 (second draft of doc)
```
docker-compose up -d road2
docker-compose exec road2 npm run utest
```

<<<<<<< HEAD
<<<<<<< HEAD
But this should only work with `mocha`. Run the following command from the root of the project:
=======
Mais cela devrait fonctionner uniquement avec `mocha`. Lancer la commande suivante depuis la racine du projet:
>>>>>>> a8e7531 (First draft on english documentation)
=======
But this should only work with `mocha`. Run the following command from the root of the project:
>>>>>>> 5d82734 (second draft of doc)
```
mocha --recursive './test/unit/mocha/**/*.js'
```

<<<<<<< HEAD
<<<<<<< HEAD
Unit tests are for classes that do not depend on another class in the project to function. The other classes are tested in the integration tests [here](../integration/readme.md).

We will therefore find the following classes or files:
- api (ExpressJS, log4js)
- basic (pg, log4js)
- constraint
- distance
- projectionManager (proj4, log4js)
-geometry
- parameter
-request
-answer
=======
Les tests unitaires concernent les classes qui ne dépendent pas d'une autre classe du projet pour fonctionner. Les autres classes sont testées dans les tests d'intégration [ici](../integration/readme.md). 
=======
Unit tests are for classes that do not depend on another class in the project to function. The other classes are tested in the integration tests [here](../integration/readme.md).
>>>>>>> 5d82734 (second draft of doc)

We will therefore find the following classes or files:
- api (ExpressJS, log4js)
- basic (pg, log4js)
- constraint
- distance
- projectionManager (proj4, log4js)
-geometry
- parameter
<<<<<<< HEAD
- request
- response
>>>>>>> a8e7531 (First draft on english documentation)
=======
-request
-answer
>>>>>>> 5d82734 (second draft of doc)
- server (ExpressJS, log4js)
- topology
- duration
- copyManager
<<<<<<< HEAD
<<<<<<< HEAD
-errorManager
=======
- errorManager
>>>>>>> a8e7531 (First draft on english documentation)
=======
-errorManager
>>>>>>> 5d82734 (second draft of doc)
- gisManager
- processManager (log4js)
- simplify.js //TODO
- storageManager (log4js)
- validationManager
- wkt
<<<<<<< HEAD
<<<<<<< HEAD
-serviceAdministered
=======
- serviceAdministered
>>>>>>> a8e7531 (First draft on english documentation)
=======
-serviceAdministered
>>>>>>> 5d82734 (second draft of doc)
