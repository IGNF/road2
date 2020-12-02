# Tests fonctionnels de Road2

Cucumber sera utilisé afin de tester les APIs de Road2, et cela, dans leurs aspects fonctionnels. On pourra utiliser Ansible pour les déploiement, ainsi que pour la gestion de la vie du service (start, restart, stop). 

## Cucumber pour les APIs

Il y a deux features cucumber pour effectuer les tests fonctionnels. La première `road2.feature` permet de tester les fonctionnalités principales. Elle a l'avantage d'être accessible dès que l'image docker a été construite. La seconde `road2-complement.feature` permet de tester plus de fonctionnalités. Pour que cette feature soit testable, il est nécessaire de construire une ressource OSRM et une ressource PGR sur l'île-de-France. C'est pour cette raison que ces features sont séparées. 

Afin de lancer les tests Cucumber, on suivra la procédure suivante:
- lancer le serveur Road2 via docker-compose 
- exécuter la commande `npm run ftest` via docker-compose
- générer une ressource OSRM et une ressource PGR sur l'île-de-France via docker-compose 
- exécuter la commande `npm run cftest` via docker-compose


## Ansible pour la gestion du service

## Cahier des tests fonctionnels 

Ce cahier contient la description des tests fonctionnels. 

### Gestion du service 

Une partie des tests concerne la gestion du service. Il s'agit de déployer le service puis de gérer sa vie. 

#### Déploiement 

Le service peut être déployé sur plusieurs OS. Chacun d'entre eux va être testé:
- Debian
- Centos 

#### Start 

#### Restart 

#### Stop 

### APIs et moteurs

Road2 se compose de plusieurs APIs et de plusieurs moteurs. On va effectuer les tests par API et pour chaque test, on pourra tester une ressource pointant vers un moteur différent. 

### Route principale 

### API simple 

#### 1.0.0

##### GetCapabilities 

##### Route 




