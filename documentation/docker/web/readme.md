# Dockerfile pour diffuser des données Web

Cette image permet de :
- tester Road2 sur une page web simple contenant une carte.
- visualiser la documentation de l'API et du code.


## Construction de l'image

Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet Road2:
```
docker build -t web-road2 -f docker/web/Dockerfile .
```

## Lancer le serveur web

Pour lancer le serveur web qui rend la page accessible, il suffit d'utiliser la commande suivante:
```
docker run --name web-road2-page --rm -d -p 8080:80 web-road2
```

## Pour développer en gardant le code source en local
```
docker run --name web-road2-page --rm -d -p 8080:80 -v $src:/home/docker/web/www/road2 web-road2
```

## Tester Road2

On pourra tester Road2 sur le lien suivant: http://localhost:8080/road2/

# Visualiser la documentation de l'API

L'API est décrite via un fichier YAML qui est visualisable avec Swagger. Ce fichier est disponible via le lien http://localhost:8080/api/api.yaml.

Pour le visualiser ou l'éditer, il est possible d'utiliser les dockers proposés par Swagger.
```
# Pour de l'édition
docker run --rm -d -p 8081:8080 swaggerapi/swagger-editor
# OU
# Pour de la visualisation
docker run --rm -d -p 8081:8080 swaggerapi/swagger-ui
```

Une fois le docker swagger et le docker web lancés, il suffit de se rendre sur l'URL suivante: http://localhost:8081/?url=http://localhost:8080/api/api.yaml.

Il est donc possible de visualiser et d'éditer la documentation. Mais pour que les changements soient pris en compte, il faut modifier le vrai fichier manuellement dans de dépôt de code. 

# Visualiser la documentation du code

## Créer la documentation du code via jsdoc

Le code est documenté via des commentaires. Ces commentaires peuvent être plus ou moins structurés avec des tags. L'outil jsdoc permet de générer un site web à partir de ces commentaires et de ces tags.

Pour créer la documentation, il suffit de lancer la commande suivante:
```
docker run --rm -v $code:/home/docker/app/documentation/code debian-road2 npm run jsdoc
```

La documentation sera alors accessible dans le dossier `$code`.

## Visualiser la documentation créée

Une fois que la documentation a été créée, il est possible de la visualiser avec l'image.
```
docker run --name web-road2-page --rm -d -p 8080:80 -v $code:/home/docker/web/www/documentation/code/ web-road2
```
La documentation est alors visible sur le lien suivant: http://localhost:8080/code.
