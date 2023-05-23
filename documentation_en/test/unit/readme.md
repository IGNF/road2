# Description of unit tests

To run the unit tests, it is advisable to use docker-compose in order to have a more complete test environment:
```
docker-compose up -d road2
docker-compose exec road2 npm run utest
```

But this should only work with `mocha`. Run the following command from the root of the project:
```
mocha --recursive './test/unit/mocha/**/*.js'
```

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
- server (ExpressJS, log4js)
- topology
- duration
- copyManager
-errorManager
- gisManager
- processManager (log4js)
- simplify.js //TODO
- storageManager (log4js)
- validationManager
- wkt
-serviceAdministered