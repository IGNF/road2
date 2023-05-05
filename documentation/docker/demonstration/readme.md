# Démonstration locale de Road2 

Ce fichier décrit les instructions à suivre pour avoir une démonstration locale de Road2 limitée aux moteurs OSRM et PGRouting. 

## Principe 

Nous proposons des images docker qui permettent de tester le service en local. Nous prévoyons de mettre ces images sur DockerHub. 

## Utilisation des images pré-construites et disponibles sur DockerHub

## Construction des images en local 

Ce sont les mêmes images que l'on peut vouloir construire localement. 

Pour construire l'image, il suffit de se placer à la racine du projet Road2 et de lancer la commande suivante : 
```
docker build -t road2-demonstration -f docker/demonstration/Dockerfile .
```

## Utilisation 

### Récupération des données 

Il est nécessaire d'avoir des données pour que Road2 puisse calculer des itinéraires. 

### Lancement de l'application 

On pourra lancer l'application avec la commande suivante : 
```
docker run --rm road2-demonstration
```

## Documentation 

### APIs 

Il est possible de visualiser les documentations des APIs en local. On lancera la commande suivante :
```
docker run --rm -p 8083:8080 -e SWAGGER_JSON=/api.yaml -v {path/to/yaml/directory}/api.yaml:/api.yaml swaggerapi/swagger-ui
```