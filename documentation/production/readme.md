# Mise en production de Road2 

## Architecture type 

Road2 a été codé pour pouvoir être exposé directement sur internet. Il est cependant conseillé de le considérer comme un middleware, et donc de placer un front classique, comme NGINX, devant. 

Selon le ou les moteurs utilisés, il sera nécessaire d'avoir accès à une base de données. C'est le cas si l'un des moteurs employé est PGRouting. Dans ce cas, il est conseillé de considérer cette base comme un middleware et de la mettre sur une machine différente de Road2. C'est elle qui effectue le calcul des itinéraires et des isochrones. Ce calcul entraîne un usage non négligeable des CPUs. 

L'architecture type dépend, a minima, de la volumétrie des données, de la sollicitation attendue et des moteurs employés. Celle que nous présentons correspond à un service couvrant la France entière et pouvant supporter une charge inférieure à 100 requêtes par seconde pour un temps de réponse inférieur à 100 millisecondes de la part du moteur OSRM. 

![architecture](./documentation/production/architecture.png)

## Éléments de dimensionnement 

## Performances 

## Optimisations envisageables

### Utilisation de la RAM 

#### Dans le cas d'OSRM 

Le binaire d'OSRM  `osrm-routed` met en RAM les graphes chargés, par défaut. Mais le binding NodeJS ne le fait pas. Il peut donc être intéressant de mettre en RAM les graphes mannuellement. Et ensuite, on peut faire pointer le binding sur les fichiers déjà en RAM. 

Pour cela, il suffit d'utiliser `tmpfs`. Tout d'abord en créant le dossier qui contiendra ce qui sera chargé en RAM:

```
sudo mkdir /media/virtuelram
sudo chmod 777 /media/virtuelram
sudo chmod 1777 /media/virtuelram
```

Puis de charger ce nouveau volume temporrairement:
``` 
sudo mount -t tmpfs -o size=512M tmpfs /media/virtuelram
```

Ou de manière définitive en éditant le fichier `/etc/fstab` avec le contenu suivant:
```
tmpfs /media/virtuelram tmpfs defaults,size=512M 0 0
```

## Autres détails 

### Affichage des erreurs

Par défaut, si Road2 rencontre une erreur, il va renvoyer au client le contenu de cette erreur. C'est un comportement adapté lors des développements. Mais en production, il est préférable de renvoyer une erreur générique. Pour cela, il suffit de lancer Road2 avec la variable `NODE_ENV` à `production`.  
