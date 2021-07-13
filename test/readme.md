# Tests de Road2

Ce fichier décrit l'ensemble des tests réalisables sur Road2. 

## Procédures de test pour valider une nouvelle version de Road2 

Lors qu'un nouveau développement a été fait, il est conseillé de les valider de la manière suivante: 


### Mise en place de l'environnement 

Il s'agit de supprimer les images docker pour être sûr de repartir de zéro: 
```
docker-compose down 
docker image rm road2 r2gg pgrouting
docker network rm iti-data-network
docker volume rm iti-data-volume pgr-data-volume 
```
Pour la reconstruction des images, il est conseillé de les construire une par une :
```
# Dans le dossier /docker/dev
docker-compose build road2
docker-compose build r2gg
docker-compose build pgrouting
```

L'image road2 contient des données mais ces dernières ne sont pas suffisantes pour valider l'ensemble de l'application. On va donc reconstruire des données: 
```
docker-compose up r2gg # avec le .env correctement rempli: une fois pour osrm et une fois pour pgr
```

### Validation des tests unitaires 

Les tests unitaires sont décrits [ici](./unit/readme.md). 

Pour résumer, il suffit de lancer la commande suivante en ayant pris soin de démarrer Road2 via docker-compose: 
```
docker-compose exec road2 npm run utest
```

### Validation des tests d'intégration

Les tests d'intégration sont décrits [ici](./integration/readme.md).

Pour résumer, il suffit de lancer la commande suivante en ayant pris soin de démarrer Road2 via docker-compose: 
```
docker-compose exec road2 npm run itest
```

### Validation des tests fonctionnels 

Les tests fonctionnels sont décrits [ici](./functional/readme.md). 

Pour résumer, il suffit de lancer les commandes suivantes en ayant pris soin de démarrer Road2 via docker-compose: 
```
docker-compose exec road2 npm run rtest #tests sur les requêtes
docker-compose exec road2 npm run artest #tests sur les requêtes admin
docker-compose exec road2 npm run crtest #tests complémentaires sur les requêtes
docker-compose exec road2 npm run drtest #tests qui dépendent des données sur les requêtes
docker-compose exec road2 npm run ctest #tests sur la configuration
docker-compose exec road2 npm run cctest #tests complémentaires sur la configuration

```

### Tests de performance et de charge 

Les tests de charges sont décrits [ici](./load/readme.md). 

Pour résumer, il suffit de lancer la commande suivante en ayant pris soin de démarrer Road2 via docker-compose: 
```
docker-compose up road2-gatling # avec le .env correctement rempli pour préciser le test que l'on veut faire 
```

### Qualité de code 

