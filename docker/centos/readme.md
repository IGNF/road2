# Dockerfile pour utiliser Road2 sous CentOS


# Construction de l'image

Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet Road2:
```
docker build -t centos-road2 -f docker/centos/Dockerfile .
```

Les éléments suivants peuvent être spécifiés:
- DNS (host et IP)
- Proxy

```
docker build -t centos-road2 --build-arg dnsIP=$dnsIP --build-arg dnsHost=$dnsHost --build-arg proxy=$proxy -f docker/centos/Dockerfile .
```

# Lancer l'application

Pour lancer l'application, il suffit d'utiliser la commande suivante:
```
docker run --name centos-road2-server --rm -d -p 8080:8080 centos-road2
```

## Mode DEBUG
```
docker run --name centos-road2-server --rm -it -p 8080:8080 centos-road2 /bin/bash
```

## Pour développer en gardant le code source en local
```
docker run --name centos-road2-server --rm -d -p 8080:8080 -v $src:/home/docker/app/src centos-road2
```

## Pour débugger le mode développement avec les sources en local
```
docker run --name centos-road2-server --rm -it -p 8080:8080 -v $src:/home/docker/app/src centos-road2 /bin/bash
```
# Lancer les tests

Les tests ont été écrits avec Mocha. Pour les lancer, on utilisera la commande suivante:
```
docker run --name centos-road2-server --rm -v $src:/home/docker/app/src -v $test:/home/docker/app/test centos-road2 npm test
```

# Lancer eslint

Pour linter le code, il suffit de lancer la commande suivante:
```
docker run --name centos-road2-server --rm -v $src:/home/docker/app/src centos-road2 npm run lint
```
