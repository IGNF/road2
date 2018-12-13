# Dockerfile pour utiliser Road2 sous Debian


# Construction de l'image

Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet Road2:
```
docker build -t debian-road2 -f docker/debian/Dockerfile .
```

Les éléments suivants peuvent être spécifiés:
- DNS (host et IP)
- Proxy

```
docker build -t debian-road2 --build-arg dnsIP=$dnsIP --build-arg dnsHost=$dnsHost --build-arg proxy=$proxy -f docker/debian/Dockerfile .
```

# Lancer l'application

Pour lancer l'application, il suffit d'utiliser la commande suivante:
```
docker run --name debian-road2-server --rm -d -p 8080:8080 debian-road2
```

## Mode DEBUG
```
docker run --name debian-road2-server --rm -it -p 8080:8080 debian-road2 /bin/bash
```

## Pour développer en gardant le code source en local
```
docker run --name debian-road2-server --rm -d -p 8080:8080 -v $src:/home/docker/app/src debian-road2
```

## Pour débugger le mode développement avec les sources en local
```
docker run --name debian-road2-server --rm -it -p 8080:8080 -v $src:/home/docker/app/src debian-road2 /bin/bash
```
