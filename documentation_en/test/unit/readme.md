# Description des tests unitaires 

Pour lancer les tests unitaires, il est conseillé d'utiliser docker-compose afin de disposer d'un environnement de test plus complet:
```
docker-compose up -d road2
docker-compose exec road2 npm run utest
```

Mais cela devrait fonctionner uniquement avec `mocha`. Lancer la commande suivante depuis la racine du projet:
```
mocha --recursive './test/unit/mocha/**/*.js'
```

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
- server (ExpressJS, log4js)
- topology
- duration
- copyManager
- errorManager
- gisManager
- processManager (log4js)
- simplify.js //TODO
- storageManager (log4js)
- validationManager
- wkt
- serviceAdministered
