# Docker pour faire des tests de charge

# Construction et utilisation avec docker-compose 

## Pré-requis

Pour utiliser `docker-compose`, il suffit de :
- installer `docker`.
- se placer dans le dossier `/docker/load/` du projet Road2.
- créer un fichier `.env` à côté du `docker-compose.yml` qui sera une copie adaptée du `compose.env.example`

## Construction des images

Il possible d'utiliser les Dockerfiles de chaque projet pour builder les images unes par une. Mais cela peut se faire automatiquement via docker-compose.

Il suffit de lancer la commande `docker-compose build`.

## Démarrage des services

Pour lancer un service, il suffit d'exécuter la commande `docker-compose up $service` avec :
- `$service=load-road2` pour lancer les tests.
