<<<<<<< HEAD
# Dockerfile to serve web data

This image allows you to:
- test Road2 on a simple web page containing a map.
- view API and code documentation.


## Building the image

To build the image, just run the following command at the root of the Road2 project:
=======
# Dockerfile pour diffuser des données Web

Cette image permet de :
- tester Road2 sur une page web simple contenant une carte.
- visualiser la documentation de l'API et du code.


## Construction de l'image

Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet Road2:
>>>>>>> a8e7531 (First draft on english documentation)
```
docker build -t web-road2 -f docker/web/Dockerfile .
```

<<<<<<< HEAD
## Launch the web server

To launch the web server that makes the page accessible, just use the following command:
=======
## Lancer le serveur web

Pour lancer le serveur web qui rend la page accessible, il suffit d'utiliser la commande suivante:
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --name web-road2-page --rm -d -p 8080:80 web-road2
```

<<<<<<< HEAD
## To develop while keeping the source code local
=======
## Pour développer en gardant le code source en local
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --name web-road2-page --rm -d -p 8080:80 -v $src:/home/docker/web/www/road2 web-road2
```

<<<<<<< HEAD
## Test Road2

We can test Road2 on the following link: http://localhost:8080/road2/

# View API documentation

The API is described via a YAML file which is viewable with Swagger. This file is available via the link http://localhost:8080/api/api.json.

To view or edit it, it is possible to use the dockers offered by Swagger.
```
# For editing
docker run --rm -d -p 8081:8080 swaggerapi/swagger-editor
# OR
# For visualization
docker run --rm -d -p 8081:8080 swaggerapi/swagger-ui
```

Once the swagger docker and the web docker are launched, just go to the following URL: http://localhost:8081/?url=http://localhost:8080/api/api.json.

It is therefore possible to view and edit the documentation. But for the changes to be taken into account, you have to modify the real file manually in the code repository.

# View code documentation

## Create code documentation via jsdoc

The code is documented via comments. These comments can be more or less structured with tags. The jsdoc tool makes it possible to generate a website from these comments and these tags.

To create the documentation, just run the following command:
=======
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
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --rm -v $code:/home/docker/app/documentation/code debian-road2 npm run jsdoc
```

<<<<<<< HEAD
The documentation will then be accessible in the `$code` folder.

## View the documentation created

Once the documentation has been created, it is possible to view it with the image.
```
docker run --name web-road2-page --rm -d -p 8080:80 -v $code:/home/docker/web/www/documentation/code/web-road2
```
The documentation is then visible on the following link: http://localhost:8080/code.
=======
La documentation sera alors accessible dans le dossier `$code`.

## Visualiser la documentation créée

Une fois que la documentation a été créée, il est possible de la visualiser avec l'image.
```
docker run --name web-road2-page --rm -d -p 8080:80 -v $code:/home/docker/web/www/documentation/code/ web-road2
```
La documentation est alors visible sur le lien suivant: http://localhost:8080/code.
>>>>>>> a8e7531 (First draft on english documentation)
