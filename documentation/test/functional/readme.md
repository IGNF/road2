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






