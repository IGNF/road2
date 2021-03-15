# Tests fonctionnels de Road2

Cucumber sera utilisé afin de tester les APIs de Road2, et cela, dans leurs aspects fonctionnels. Il sera également utilisé pour tester la configuration de Road2. 

## Utilisation de Cucumber 

Il y a plusieurs features cucumber pour effectuer les tests fonctionnels. On retrouve des features pour tester les requêtes qui peuvent être envoyées sur le serveur. Et on retrouve une feature pour tester les différentes configuration que l'on peut fournir au serveur afin de diffuser les services. 

### Request 

La feature `requestTest.feature` permet de tester les fonctionnalités principales. Elle a l'avantage d'être accessible dès que l'image docker a été construite. La seconde `requestComplementTest.feature` permet de tester plus de fonctionnalités. Pour que cette feature soit testable, il est nécessaire de construire une ressource OSRM et une ressource PGR sur l'île-de-France. C'est pour cette raison que ces features sont séparées. 
Enfin, la troisième `requestDataTest.feature` se concentre sur les tests qui impliquent d'avoir une connaissance plus fine de la donnée. Les résultats dépendront des points de départ, d'arrivée et de la présence de pont par exemple. 

Afin de lancer les tests Cucumber, on suivra la procédure suivante:
- lancer le serveur Road2 via docker-compose 
- exécuter la commande `npm run rtest` via docker-compose (pour tester les fonctionnalités principales de l'api simple 1.0.0)
- exécuter la commande `npm run artest` via docker-compose (pour tester l'api admin 1.0.0)
- générer une ressource OSRM et une ressource PGR sur l'île-de-France via docker-compose 
- exécuter la commande `npm run crtest` via docker-compose 
- exécuter la commande `npm run drtest` via docker-compose

### Configuration 

La feature `configurationTest.feature` permet de tester différentes configuration. Elle a l'avantage d'être accessible dès que l'image docker a été construite. La seconde `configurationComplementTest.feature` permet de tester plus de fonctionnalités. Pour que cette feature soit testable, il est nécessaire de construire une ressource PGR sur l'île-de-France. C'est pour cette raison que ces features sont séparées. 

Afin de lancer les tests Cucumber, on suivra la procédure suivante:
- lancer le serveur Road2 via docker-compose 
- exécuter la commande `npm run ctest` via docker-compose
- générer une ressource PGR sur l'île-de-France via docker-compose 
- exécuter la commande `npm run ccftest` via docker-compose






