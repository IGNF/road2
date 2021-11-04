# Road2

## Présentation générale 

Road2 est un serveur de calcul d'itinéraires et d'isochrones écrit en Javascript et conçu pour fonctionner avec NodeJS. Ce serveur propose le calcul d'itinéraires et d'isochrones via des moteurs existants comme [OSRM](https://github.com/Project-OSRM/osrm-backend) ou [PGRouting](https://pgrouting.org/). Road2 est donc une interface pour moteurs de calculs. Ces derniers ne sont pas fait dans le code de Road2 mais via des appels à ses moteurs. Cela peut se traduire par l'appel à une librairie, ou à une base de données, ou encore à un autre service web. 

Road2 a été conçu dans l'idée de pouvoir facilement ajouter des nouveaux moteurs et de nouvelles APIs, et cela, de manière totalement transparente les uns pour autres. Autrement dit, ajouter un moteur n'a pas d'impact sur les APIs déjà existantes. L'objectif est de faciliter l'ajout de nouvelles fonctionnalités tout en pérennisant l'accès au service. Pour une plus longue discussion sur les concepts logiciels introduits dans Road2, on pourra se référer à la documentation [suivante](./documentation/developers/concepts.md).

Actuellement, Road2 propose deux moteurs, OSRM et PGRouting, via une unique API REST. 

## Fonctionnalités disponibles 

Road2 propose plusieurs grandes familles de fonctionnalités : 
- Calculer des itinéraires
- Calculer des isochrones et des isodistances 
- Administrer le service 
- etc... 

Ces familles regroupent l'ensemble des fonctionnalités et sont détaillées [ici](./documentation/developers/functionnalities.md).

## Licence 

Road2 est diffusé sous la licence GPL v3. 

## Découverte du service

### Démonstrateur 

L'IGN propose un démonstrateur pour [l'itinéraire](https://geoservices.ign.fr/documentation/services_betas/itineraires.html) et [l'isochrone](https://geoservices.ign.fr/documentation/services_betas/isochrones.html). Ces démonstrateurs permettent de construire des requêtes via une carte et de visualiser les résultats. 

Autrement, pour une première prise en main du service en local, il est possible d'utiliser l'image [alpine](./docker/demonstration/Dockerfile) de Road2. Cela permettra d'avoir localement une instance du service et une page web permettant de le tester. Les instructions de mise en place sont données [ici](./docker/demonstration/readme.md). 

### Les APIs du service 

L'IGN propose également une visualisation de l'API utilisateur pour [l'itinéraire](https://geoservices.ign.fr/documentation/services_betas/swagger-itineraire.html) et [l'isochrone](https://geoservices.ign.fr/documentation/services_betas/swagger-isochrones.html). 

Autrement, l'ensemble des APIs disponibles sont documentées dans ce [dossier](./documentation/apis/). Pour le moment, il y a une seule API utilisateur qui est documentée via un [fichier](./documentation/apis/simple/1.0.0/api.yaml) YAML utilisant openapi 3.0.0, et une API d'administration documentée via un autre [fichier](./documentation/apis/admin/1.0.0/api.yaml) YAML suivant le même formalisme. 

Il est possible de visualiser ces documentations d'API localement en suivant les instructions qui sont [ici](./docker/demonstration/readme.md). 

## Installation et utilisation de Road2 

### Pré-requis

Pour utiliser ce projet, il est nécessaire d'avoir installé NodeJS sur la machine utilisée. La version de NodeJS utilisée pendant les développements est *12.14.0*. 

### Installation des modules

L'installation des modules est effectuée via NPM. En se plaçant dans la racine du projet:
```
npm install
```

NB : Il y a des dépendances optionnelles pour gérer celles de chaque moteur. Pour plus d'informations, voir ce [document](./documentation/production/readme.md).

### Génération de données  

Qu'importe la source des données, il est nécessaire de les fournir dans l'un des formats utilisables par Road2. Étant donné que ce dernier peut utiliser plusieurs moteurs les calculs, il accepte plusieurs formats de données:
- OSRM 5.25.0 rend possible l'utilisation de données OSRM générées avec cette version. 
- PGRouting 3.1.3 rend possible l'utilisation d'une base de données utilisant cette version. Il sera nécessaire d'y ajouter les procédures du projet pgrouting-procedures afin que Road2 puisse communiquer avec la base. 

Ces données peuvent donc être générées à partir d'une base de données quelconque, ou de fichiers OSM. Le projet route-graph-generator propose des outils pour générer les graphes à partir de n'importe quelle base de données ou fichier osm. Si la base de données ne correspondant pas au format de la base attendue par route-graph-generator, il suffira de la dériver. 

Pour une discussion détaillée sur les données attendues, on pourra se référer à cette [documentation](./documentation/data/readme.md). 

### Configuration

Afin que le serveur fonctionne, il est nécessaire de le [configurer](./documentation/configuration/readme.md). Il s'agit de créer une arborescence de quelques fichiers JSON, au minimum quatre, permettant l'instanciation du serveur avec des ressources. 

### Lancement 

Une fois configuré, il est possible de lancer le serveur avec la commande: 
```
node ${road2}/src/js/road2.js --ROAD2_CONF_FILE=${configuration}/server.json
```

### Pour plus de détails

On trouvera dans le dossier [docker/distrubutions](./docker/distributions) différents Dockerfiles qui permettent de voir l'installation et de tester le service sur différentes plateformes. Pour le moment, Centos 7 et Debian 10 sont disponibles. 

## Participer aux développements 

On trouvera une documentation dédiée aux développeurs [ici](./documentation/developers/readme.md). Elle indique les concepts utiles pour effectuer des développements sur Road2. 

De plus, il est possible d'utiliser ce [docker-compose](./docker/dev/readme.md) pour avoir un environnement de développement incluant la construction des binaires, des modules et la génération des données. 

## Utilisation en production

Afin d'utiliser Road2 en production, plusieurs informations sont données dans ce [document](./documentation/production/readme.md). Il s'agit principalement des besoins déjà observés pour une mise en production du service couvrant l'ensemble du territoire français. 
