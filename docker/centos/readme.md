# Dockerfile pour utiliser Road2 sous CentOS


# Construction de l'image

Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet Road2:
```
docker build -t road2-centos -f docker/centos/Dockerfile .
```

Les éléments suivants peuvent être spécifiés:
- DNS (host et IP)
- Proxy

```
docker build -t road2-centos --build-arg dnsIP=$dnsIP --build-arg dnsHost=$dnsHost --build-arg proxy=$proxy -f docker/centos/Dockerfile .
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
