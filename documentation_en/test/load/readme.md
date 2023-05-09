<<<<<<< HEAD
# Load testing

This folder contains scripts useful for load testing. These tests are performed with Gatling.

## Gatling

The `gatling` folder contains the `user-files` folder needed by Getling to perform the tests. We therefore find the definition of the simulations and the necessary resources. As it is, it is possible to launch the scenario contained in `gatling/user-files/simulations/road2.scala` which uses the resource `gatling/user-files/resources/road2_parameters.ssv`.

If Gatling is installed on the machine, we can point to the `user-files` folder. For more information, see the [official] site (https://gatling.io/).

Otherwise, it is possible to use the docker image available on [dockerhub](https://hub.docker.com/r/denvazh/gatling).

This is done in the {{ '[docker-compose]({}/tree/{}/docker/test/)'.format(repo_url, repo_branch) }} dedicated to testing in this repository. See the [readme](../../docker/test/readme.md) for its usage.

## random-route-generator

This is an R script that generates ssvs for load testing. Just run in the following way:
`R -f routeGenerator.R --args "/home/user/out.ssv" 100 "bduni" 8 41 9 42`

The `-f` option specifies the script to run. Each element following `--args` is a script option. These must be in the correct order:
- ssv output file
- number of lines
- Road2 resource tested
-xmin
-ymin
-xmax
-ymax

## random-iso-generator

This is an R script that allows you to generate ssvs for load tests on the isochrone calculation. Just run in the following way:
`R -f isoGenerator.R --args "/home/user/out.ssv" 100 "bduni" 8 41 9 42`

The `-f` option specifies the script to run. Each element following `--args` is a script option. These must be in the correct order:
- ssv output file
- number of lines
- Road2 resource tested
-xmin
-ymin
-xmax
-ymax
=======
# Tests de charges 

Ce dossier contient les scripts utiles aux tests de charges. Ces tests sont effectués avec Gatling. 

## Gatling 

Le dossier `gatling` contient le dossier `user-files` nécessaire à Getling pour effectuer les tests. On y retrouve donc la définition des simulations et les ressources nécessaire. En l'état, il est possible de lancer le scénario contenu dans `gatling/user-files/simulations/road2.scala` qui utilise la ressource `gatling/user-files/resources/road2_parameters.ssv`. 

Si Gatling est installé sur la machine, on pourra pointer le dossier `user-files`. Pour plus d'informations, voir le site [officiel](https://gatling.io/). 

Autrement, il est possible d'utiliser l'image docker disponible sur [dockerhub](https://hub.docker.com/r/denvazh/gatling). 

C'est ce qui est fait dans le {{ '[docker-compose]({}/tree/{}/docker/test/)'.format(repo_url, repo_branch) }} dédié aux tests dans ce dépôt. Voir le [readme](../../docker/test/readme.md) pour son utilisation. 

## random-route-generator 

Il s'agit d'un script R qui permet de générer des ssv pour les tests de charges. Il suffit de lancer de la manière suivante:
`R -f routeGenerator.R --args "/home/user/out.ssv" 100 "bduni" 8 41 9 42`

L'option `-f` indique le script à exécuter. Chaque élément ce qui suit `--args` est une options du script. Ces derniers doivent être dans le bon ordre:
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

L'option `-f` indique le script à exécuter. Chaque élément ce qui suit `--args` est une options du script. Ces derniers doivent être dans le bon ordre:
- fichier de sortie ssv
- nombre de lignes 
- ressource Road2 testée 
- xmin
- ymin 
- xmax 
- ymax
>>>>>>> a8e7531 (First draft on english documentation)
