<<<<<<< HEAD
# Local demonstration of Road2

This file describes the instructions to follow to have a local demo of Road2 limited to OSRM and PGRouting engines.

## Principle

We offer docker images that allow you to test the service locally. We plan to put these images on DockerHub.

## Using pre-built images available on DockerHub

## Building images locally

These are the same images that we may want to build locally.

To build the image, simply go to the root of the Road2 project and run the following command:
=======
# Démonstration locale de Road2 

Ce fichier décrit les instructions à suivre pour avoir une démonstration locale de Road2 limitée aux moteurs OSRM et PGRouting. 

## Principe 

Nous proposons des images docker qui permettent de tester le service en local. Nous prévoyons de mettre ces images sur DockerHub. 

## Utilisation des images pré-construites et disponibles sur DockerHub

## Construction des images en local 

Ce sont les mêmes images que l'on peut vouloir construire localement. 

Pour construire l'image, il suffit de se placer à la racine du projet Road2 et de lancer la commande suivante : 
>>>>>>> a8e7531 (First draft on english documentation)
```
docker build -t road2-demonstration -f docker/demonstration/Dockerfile .
```

<<<<<<< HEAD
## Use

### Data recovery

Data is required for Road2 to calculate routes.

### Launching the application

You can launch the application with the following command:
=======
## Utilisation 

### Récupération des données 

Il est nécessaire d'avoir des données pour que Road2 puisse calculer des itinéraires. 

### Lancement de l'application 

On pourra lancer l'application avec la commande suivante : 
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --rm road2-demonstration
```

<<<<<<< HEAD
## Documentation

### APIs

It is possible to view API documentation locally. We will run the following command:
```
docker run --rm -p 8083:8080 -e SWAGGER_JSON=/api.json -v {path/to/json/directory}/api.json:/api.json swaggerapi/swagger-ui
=======
## Documentation 

### APIs 

Il est possible de visualiser les documentations des APIs en local. On lancera la commande suivante :
```
docker run --rm -p 8083:8080 -e SWAGGER_JSON=/api.yaml -v {path/to/yaml/directory}/api.yaml:/api.yaml swaggerapi/swagger-ui
>>>>>>> a8e7531 (First draft on english documentation)
```