<<<<<<< HEAD
<<<<<<< HEAD
# Dockerfile to serve web data

This image allows you to:
- test Road2 on a simple web page containing a map.
- view API and code documentation.


## Building the image

To build the image, just run the following command at the root of the Road2 project:
=======
# Dockerfile pour diffuser des données Web
=======
# Dockerfile to serve web data
>>>>>>> 5d82734 (second draft of doc)

This image allows you to:
- test Road2 on a simple web page containing a map.
- view API and code documentation.


## Building the image

<<<<<<< HEAD
Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet Road2:
>>>>>>> a8e7531 (First draft on english documentation)
=======
To build the image, just run the following command at the root of the Road2 project:
>>>>>>> 5d82734 (second draft of doc)
```
docker build -t web-road2 -f docker/web/Dockerfile .
```

<<<<<<< HEAD
<<<<<<< HEAD
## Launch the web server

To launch the web server that makes the page accessible, just use the following command:
=======
## Lancer le serveur web

Pour lancer le serveur web qui rend la page accessible, il suffit d'utiliser la commande suivante:
>>>>>>> a8e7531 (First draft on english documentation)
=======
## Launch the web server

To launch the web server that makes the page accessible, just use the following command:
>>>>>>> 5d82734 (second draft of doc)
```
docker run --name web-road2-page --rm -d -p 8080:80 web-road2
```

<<<<<<< HEAD
<<<<<<< HEAD
## To develop while keeping the source code local
=======
## Pour développer en gardant le code source en local
>>>>>>> a8e7531 (First draft on english documentation)
=======
## To develop while keeping the source code local
>>>>>>> 5d82734 (second draft of doc)
```
docker run --name web-road2-page --rm -d -p 8080:80 -v $src:/home/docker/web/www/road2 web-road2
```

<<<<<<< HEAD
<<<<<<< HEAD
## Test Road2

We can test Road2 on the following link: http://localhost:8080/road2/

# View API documentation

The API is described via a YAML file which is viewable with Swagger. This file is available via the link http://localhost:8080/api/api.json.
<<<<<<< HEAD

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
=======
## Test Road2
>>>>>>> 5d82734 (second draft of doc)

We can test Road2 on the following link: http://localhost:8080/road2/

# View API documentation

The API is described via a YAML file which is viewable with Swagger. This file is available via the link http://localhost:8080/api/api.yaml.
=======
>>>>>>> d01080c (Adding modifications from fr develop doc)

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

<<<<<<< HEAD
Pour créer la documentation, il suffit de lancer la commande suivante:
>>>>>>> a8e7531 (First draft on english documentation)
=======
To create the documentation, just run the following command:
>>>>>>> 5d82734 (second draft of doc)
```
docker run --rm -v $code:/home/docker/app/documentation/code debian-road2 npm run jsdoc
```

<<<<<<< HEAD
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
=======
The documentation will then be accessible in the `$code` folder.
>>>>>>> 5d82734 (second draft of doc)

## View the documentation created

Once the documentation has been created, it is possible to view it with the image.
```
docker run --name web-road2-page --rm -d -p 8080:80 -v $code:/home/docker/web/www/documentation/code/web-road2
```
<<<<<<< HEAD
La documentation est alors visible sur le lien suivant: http://localhost:8080/code.
>>>>>>> a8e7531 (First draft on english documentation)
=======
The documentation is then visible on the following link: http://localhost:8080/code.
>>>>>>> 5d82734 (second draft of doc)
