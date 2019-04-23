# Docker-Compose pour utiliser Road2, Route-Graph-Generator et PGRouting-Procedures

## Introduction

Road2 est un service de calcul d'itinéraires. Pour fonctionner, il doit avoir accès à un volume qui contient les données générées par Route-Graph-Generator et à une base de donnée PGRouting.

## Pré-requis

Pour utiliser ce `docker-compose.yml`, il suffit de :
- télécharger les trois projets dans le même dossier.
- installer `docker`.
- se placer dans le dossier `/docker/` du projet Road2.

## Construction des images

Il possible d'utiliser les Dockerfiles de chaque projet pour builder les images unes par une. Mais cela peut se faire automatiquement via docker-compose.

Il suffit de lancer la commande `docker-compose build`.

## Démarrage des services

Pour lancer un service, il suffit d'exécuter la commande `docker-compose up $service` avec :
- `$service=road2-centos` pour Road2. Cela va également instancier un PGRouting.
- `$service=pgrouting-procedures-centos` pour PGRouting.
- `$service=route-graph-generator-centos` pour Route-Graph-Generator. Cela va également instancier un PGRouting.

On pourra utiliser l'option `-d` pour lancer en tâche de fond.

## Ordre de démarrage des services

Pour faire marcher la pipeline complète, il faut pour l'instant lancer les services dans l'ordre suivant :
`docker-compose up -d pgrouting-procedures-centos`
`docker-compose up route-graph-generator-centos`
`docker-compose up road2`
