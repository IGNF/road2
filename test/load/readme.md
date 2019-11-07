# Tests de charges 

Ce dossier contient les scripts utiles aux tests de charges. Ces tests sont effectués avec Gatling. 

## Gatling 

Le dossier `gatling` contient le dossier `user-files` nécessaire à Getling pour effectuer les tests. On y retrouve donc la définition des simulations et les ressources nécessaire. En l'état, il est possible de lancer le scénario contenu dans `gatling/user-files/simulations/road2.scala` qui utilise la ressource `gatling/user-files/resources/road2_parameters.ssv`. 

Si Gatling est installé sur la machine, on pourra pointer le dossier `user-files`. De la même manière, il est possible d'utiliser Docker. 

Avec le `docker-compose` du repository, il est possible de lancer les tests de charge avec les données déjà disponibles:
`docker-compose up gatling-road2`

Pour utiliser le `docker-compose` avec d'autres données, il suffira de modifier le `.env` associé et ainsi de pointer vers un autre `user-files`. On priviligiera cette approche à celle modifiant les fichiers de ce repository.  

## random-route-generator 

Il s'agit d'un script R qui permet de générer des ssv pour les tests de charges. Il suffit de lancer de la manière suivante:
`R -f routeGenerator.R --args "/home/user/out.ssv" 100 "bduni" 8 41 9 42`

L'option `-f` indique le script à exécuter. Ce qui suit `--args` sont les options du script. Les arguments doivent être dans le bon ordre:
- fichier de sortie ssv
- nombre de lignes 
- ressource Road2 testée 
- xmin
- ymin 
- xmax 
- ymax

## random-iso-generator 

Il s'agit d'un script R qui permet de générer des ssv pour les tests de charges sur le calcul d'isochrone. Il suffit de lancer de la manière suivante:
`R -f isoGenerator.R --args "/home/user/out.ssv" 100 "bduni" 8 41 9 42`

L'option `-f` indique le script à exécuter. Ce qui suit `--args` sont les options du script. Les arguments doivent être dans le bon ordre:
- fichier de sortie ssv
- nombre de lignes 
- ressource Road2 testée 
- xmin
- ymin 
- xmax 
- ymax