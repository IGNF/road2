<<<<<<< HEAD
# Description of unit tests

To run the unit tests, it is advisable to use docker-compose in order to have a more complete test environment:
=======
# Description des tests unitaires 

Pour lancer les tests unitaires, il est conseillé d'utiliser docker-compose afin de disposer d'un environnement de test plus complet:
>>>>>>> a8e7531 (First draft on english documentation)
```
docker-compose up -d road2
docker-compose exec road2 npm run utest
```

<<<<<<< HEAD
But this should only work with `mocha`. Run the following command from the root of the project:
=======
Mais cela devrait fonctionner uniquement avec `mocha`. Lancer la commande suivante depuis la racine du projet:
>>>>>>> a8e7531 (First draft on english documentation)
```
mocha --recursive './test/unit/mocha/**/*.js'
```

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

On trouvera donc les classes ou les fichiers suivants: 
- api (ExpressJS, log4js)
- base (pg, log4js)
- constraint
- distance
- projectionManager (proj4, log4js)
- geometry 
- parameter
- request
- response
>>>>>>> a8e7531 (First draft on english documentation)
- server (ExpressJS, log4js)
- topology
- duration
- copyManager
<<<<<<< HEAD
-errorManager
=======
- errorManager
>>>>>>> a8e7531 (First draft on english documentation)
- gisManager
- processManager (log4js)
- simplify.js //TODO
- storageManager (log4js)
- validationManager
- wkt
<<<<<<< HEAD
-serviceAdministered
=======
- serviceAdministered
>>>>>>> a8e7531 (First draft on english documentation)
