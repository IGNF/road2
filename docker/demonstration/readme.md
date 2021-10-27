# Démonstration locale de Road2 

Ce fichier décrit les instructions à suivre pour avoir une démonstration locale de Road2. 

## Principe 

Nous proposons des images docker qui permettent de tester le service en local. Ces images pourront bientôt être récupérées sur DockerHub. 

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