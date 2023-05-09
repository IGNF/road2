<<<<<<< HEAD
# Dockerfile to use Road2 on Debian


## Building the image

To build the image, just run the following command at the root of the Road2 project:
=======
# Dockerfile pour utiliser Road2 sous Debian


## Construction de l'image

Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet Road2:
>>>>>>> a8e7531 (First draft on english documentation)
```
docker build -t road2-debian -f docker/debian/Dockerfile .
```

<<<<<<< HEAD
## Launch the application

To launch the application, just use the following command:
=======
## Lancer l'application

Pour lancer l'application, il suffit d'utiliser la commande suivante:
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --name road2-debian-server --rm -d -p 8080:8080 road2-debian
```

<<<<<<< HEAD
### DEBUG mode
=======
### Mode DEBUG
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --name road2-debian-server --rm -it -p 8080:8080 road2-debian /bin/bash
```

<<<<<<< HEAD
## To develop while keeping the source code local
=======
## Pour développer en gardant le code source en local
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --name road2-debian-server --rm -d -p 8080:8080 -v $src:/home/docker/app/src road2-debian
```

<<<<<<< HEAD
## To debug development mode with local sources
=======
## Pour débugger le mode développement avec les sources en local
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --name road2-debian-server --rm -it -p 8080:8080 -v $src:/home/docker/app/src road2-debian /bin/bash
```

<<<<<<< HEAD
## Run the tests

Unit tests were written with Mocha. To run them, use the following command:
=======
## Lancer les tests

Les tests unitaires ont été écrits avec Mocha. Pour les lancer, on utilisera la commande suivante:
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --name road2-debian-server --rm -v $src:/home/docker/app/src -v $test:/home/docker/app/test road2-debian npm run utest
```

<<<<<<< HEAD
## Run eslint

To linter the code, just run the following command:
=======
## Lancer eslint

Pour linter le code, il suffit de lancer la commande suivante:
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --name road2-debian-server --rm -v $src:/home/docker/app/src road2-debian npm run lint
```

<<<<<<< HEAD
## Create code documentation via jsdoc

The code is documented via comments. These comments can be more or less structured with tags. The jsdoc tool makes it possible to generate a website from these comments and these tags.

To create the documentation, just run the following command:
=======
## Créer la documentation du code via jsdoc

Le code est documenté via des commentaires. Ces commentaires peuvent être plus ou moins structurés avec des tags. L'outil jsdoc permet de générer un site web à partir de ces commentaires et de ces tags.

Pour créer la documentation, il suffit de lancer la commande suivante:
>>>>>>> a8e7531 (First draft on english documentation)
```
docker run --name road2-debian-server --rm -v $doc:/home/docker/app/documentation/code road2-debian npm run jsdoc
```

<<<<<<< HEAD
The documentation will then be accessible in `$doc`.
=======
La documentation sera alors accessible dans `$doc`.
>>>>>>> a8e7531 (First draft on english documentation)
