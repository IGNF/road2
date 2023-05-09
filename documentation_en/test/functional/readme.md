<<<<<<< HEAD
# Functional tests of Road2

Cucumber will be used to test the APIs of Road2, and this, in their functional aspects. It will also be used to test the Road2 configuration.

## Using Cucumber

There are several cucumber features to perform functional testing. There are features to test the requests that can be sent to the server. And there are features to test the different configurations that can be provided to the server in order to distribute the services.

### Request

The `request/cucumber/features/req*.feature` features are used to test features accessible via requests. To work, it is necessary to have generated data for each engine on the Ile-de-France.

In order to launch these tests, we will follow the following procedure:
- generate data for each engine in Ile-de-France
- launch the Road2 server via docker-compose
- run `npm run rtest` command via docker-compose.

### Setup

The features `configuration/cucumber/features/conf*.feature` allow to test the functionalities related to the loading of a Road2 configuration.

In order to launch these tests, we will follow the following procedure:
- launch the Road2 server via docker-compose
- run `npm run ctest` command via docker-compose.
=======
# Tests fonctionnels de Road2

Cucumber sera utilisé afin de tester les APIs de Road2, et cela, dans leurs aspects fonctionnels. Il sera également utilisé pour tester la configuration de Road2. 

## Utilisation de Cucumber 

Il y a plusieurs features cucumber pour effectuer les tests fonctionnels. On retrouve des features pour tester les requêtes qui peuvent être envoyées sur le serveur. Et on retrouve des features pour tester les différentes configurations que l'on peut fournir au serveur afin de diffuser les services. 

### Request 

Les features `request/cucumber/features/req*.feature` permettent de tester les fonctionnalités accessibles via des requêtes. Pour fonctionner, il est nécessaire d'avoir généré des données pour chaque moteur sur l'île-de-France. 

Afin de lancer ces tests, on suivra la procédure suivante:
- générer des données pour chaque moteur sur l'île-de-France
- lancer le serveur Road2 via docker-compose 
- exécuter la commande `npm run rtest` via docker-compose. 

### Configuration 

Les features `configuration/cucumber/features/conf*.feature` permettent de tester les fonctionnalités liées au chargement d'une configuration de Road2. 

Afin de lancer ces tests, on suivra la procédure suivante:
- lancer le serveur Road2 via docker-compose 
- exécuter la commande `npm run ctest` via docker-compose. 






>>>>>>> a8e7531 (First draft on english documentation)
