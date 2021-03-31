# Road2

Road2 est un serveur de calcul d'itinéraire écrit avec NodeJS. Ce serveur propose le calcul d'itinéraires via des moteurs existants, comme OSRM ou PGRouting. Road2 est donc une interface pour moteurs de calculs d'itinéraires. Les calculs ne sont pas fait dans le code mais via l'appel à des librairies.

Road2 a été conçu dans l'idée de pouvoir facilement ajouter des nouveaux moteurs, pour les calculs, et de nouvelles APIs, pour accéder au service.

## Installation

Cette partie détaille l'installation sur un serveur. Pour des tests rapides sur des données déjà intégrées, utilisez les images docker de Road2 sur [Centos](./docker/centos/readme.md) ou [Debian](./docker/debian/readme.md), ou encore via [docker-compose](./docker/readme.md).

### Pré-recquis

Pour utiliser ce projet, il est nécessaire d'avoir installé NodeJS sur la machine utilisée. La version de NodeJS utilisée est *10.18.0*.

Il est également fortement conseillé d'installer [OSRM](https://github.com/Project-OSRM/osrm-backend) sur la même machine si ce moteur sera utilisé par la suite. La version utilisée dans Road2 est *5.24.0*.

### Installation des modules

L'installation des modules est effectuée via NPM. En se plaçant dans la racine du projet:
```
npm install
```

### Configuration

Afin que le serveur fonctionne, il est nécessaire de le [configurer](./documentation/io/readme.md). Il s'agit de créer une arborescence de quelques fichiers JSON, au minimum quatre, permettants l'instanciation du serveur avec des ressources.

## Utilisation via Docker

Il est possible d'utiliser directement des images docker pour tester le serveur. Il existe une image sous [Centos](./docker/centos/readme.md) et une autre pour [Debian](./docker/debian/readme.md).

## Utilisation via docker-compose

Il est conseillé d'utiliser [docker-compose](./docker/readme.md) pour tester et développer ce serveur.

## Développements 

On trouvera une documentation dédiée aux développeurs [ici](./documentation/index.md). 

## APIs

Les APIs disponibles sont documentées [ici](./documentation/apis/). 

Pour le moment, il y a une seule API utilisateur qui est documentée via un [fichier](./documentation/apis/simple/1.0.0/api.yaml) YAML utilisant openapi 3.0.0. 

## Versions

Cette version de Road2 fonctionne avec les versions suivantes:
- route-graph-generator 1.0.3-DEVELOP
- pgrouting-procedures 1.0.2-DEVELOP
