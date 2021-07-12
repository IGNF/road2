# Dockerfile pour utiliser Road2 sous CentOS mais sans faire appel à AWS

Il est possible d'installer OSRM, et plus particulièrement le binding NodeJS, depuis les sources sans faire appel aux binaires hébergés sur AWS. Ce dockerfile en est un exemple. Voici la procèdure à suivre: 

1. Installer un compilateur pour Boost et GCC 6: gcc-c++
2. Installer les dépendances pour GCC 6.3.0 afin de compiler OSRM: GMP 4.2+, MPFR 2.4.0+ and MPC 0.8.0+
3. Installer les dépendances pour OSRM: boost 1.65.1; expat 2.2.0; lua 5.2.4; bzip2 1.0.6; tbb 
4. Installer les dépendances pour Boost: openmpi-devel python-devel
5. Installer les dépendances pour LUA: readline-devel
6. Compiler et installer gcc 6.2.0 pour compiler OSRM 
7. Compiler et installer boost 1.65.1
8. Compiler et installer lua 5.2.4
9. Compiler et installer OSRM 5.25.0 (cf Dockerfile)
10. Ajouter la variable LD_LIBRARY_PATH=/opt/gcc-6/home/docker/gcc/objdir/lib64:$LD_LIBRARY_PATH pour que les binaires trouvent les librairies utilisées lors de la compilation. 
11. Créer le module NodeJS d'OSRM (cf. Dockerfile)


# Construction de l'image

Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet Road2:
```
docker build -t road2-centos -f docker/centos/Dockerfile .
```

# Lancer l'application

Pour lancer l'application, il suffit d'utiliser la commande suivante:
```
docker run --name road2-centos-server --rm -d -p 8080:8080 road2-centos
```

## Mode DEBUG
```
docker run --name road2-centos-server --rm -it -p 8080:8080 road2-centos /bin/bash
```

## Pour développer en gardant le code source en local
```
docker run --name road2-centos-server --rm -d -p 8080:8080 -v $src:/home/docker/app/src road2-centos
```

## Pour débugger le mode développement avec les sources en local
```
docker run --name road2-centos-server --rm -it -p 8080:8080 -v $src:/home/docker/app/src road2-centos /bin/bash
```
# Lancer les tests

Les tests unitaires ont été écrits avec Mocha. Pour les lancer, on utilisera la commande suivante:
```
docker run --name road2-centos-server --rm -v $src:/home/docker/app/src -v $test:/home/docker/app/test road2-centos npm run utest
```

# Lancer eslint

Pour linter le code, il suffit de lancer la commande suivante:
```
docker run --name road2-centos-server --rm -v $src:/home/docker/app/src road2-centos npm run lint
```

# Créer la documentation du code via jsdoc

Le code est documenté via des commentaires. Ces commentaires peuvent être plus ou moins structurés avec des tags. L'outil jsdoc permet de générer un site web à partir de ces commentaires et de ces tags.

Pour créer la documentation, il suffit de lancer la commande suivante:
```
docker run --name road2-centos-server --rm -v $doc:/home/docker/app/documentation/code road2-centos npm run jsdoc
```

La documentation sera alors accessible dans `$doc`.
