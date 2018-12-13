# Dockerfile pour tester Road2 sur une page web cartographique

Cette image permet de tester Road2 sur une page web simple contenant une carte.


# Construction de l'image

Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet Road2:
```
docker build -t web-road2 -f docker/web/Dockerfile .
```

Les éléments suivants peuvent être spécifiés:
- DNS (host et IP)
- Proxy

```
docker build -t web-road2 --build-arg dnsIP=$dnsIP --build-arg dnsHost=$dnsHost --build-arg proxy=$proxy -f docker/web/Dockerfile .
```

# Lancer l'application

Pour lancer le serveur web qui rend la page accessible, il suffit d'utiliser la commande suivante:
```
docker run --name web-road2-page --rm -d -p 8080:80 web-road2
```

## Mode DEBUG
```
docker run --name web-road2-page --rm -it -p 8080:80 web-road2 /bin/bash
```

## Pour développer en gardant le code source en local
```
docker run --name web-road2-page --rm -d -p 8080:80 -v $src:/home/docker/web/www web-road2
```

## Pour débugger le mode développement avec les sources en local
```
docker run --name web-road2-page --rm -it -p 8080:80 -v $src:/home/docker/web/www web-road2 /bin/bash
```
