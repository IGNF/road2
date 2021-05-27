# Mise en production de Road2 

## Architecture type 

Road2 a été codé pour pouvoir être exposé directement sur internet. Il est cependant conseillé de le considérer comme un middleware, et donc de placer un front classique, comme NGINX, devant. 

Selon le ou les moteurs utilisés, il sera nécessaire d'avoir accès à une base de données. C'est le cas si l'un des moteurs employé est PGRouting. Dans ce cas, il est conseillé de considérer cette base comme un middleware et de la mettre sur une machine différente de Road2. C'est elle qui effectue le calcul des itinéraires et des isochrones. Ce calcul entraîne un usage non négligeable des CPUs. 

L'architecture type dépend, a minima, de la volumétrie des données, de la sollicitation attendue et des moteurs employés. Celle que nous présentons correspond à un service couvrant la France entière et pouvant supporter une charge inférieure à 100 requêtes par seconde pour un temps de réponse inférieur à 100 millisecondes de la part du moteur OSRM. 

![architecture](./documentation/production/architecture.png)

## Éléments de dimensionnement 

## Performances 

## Industrialisation 

### Installation des dépendances spécifiques à chaque moteur 

Par défaut, la commande `npm install` va tenter d'installer toutes les dépendances. Cependant, certaines d'entre elles sont inutiles si un moteur n'est pas utilisé. On pourra donc procéder de la manière suivante : 
```
# Installation des dépendances strictement nécessaires
npm install --no-optional --no-package-lock --no-save
# Ensuite, si on utilise un seul moteur, comme OSRM par exemple
npm install --no-package-lock --no-save osrm
```

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

### Gestion des CORS

Par défaut, une API ne va pas gérer les CORS. Chaque développeur doit préciser s'il souhaite utiliser les CORS au sein de l'API qu'il développe. Ainsi, il est possible de déterminer sur quelle route on souhaite utiliser quels CORS. Par exemple, on pourra autoriser toutes les origines sur certaines routes de calculs et les restreindre sur des routes d'administration.

Pour appliquer des CORS, on utilise le module `cors` qui s'intègre bien à expressJS.

Par défaut, il y a des options qui sont utilisées mais elles peuvent être remplacées. Si on souhaite surchargée les options, on veillera à les ajouter dans un fichier de configuration indépendant du reste de la configuration de l'application, comme cela est précisé dans le paragraphe traitant de l'ajout d'une API.  

### Gestion du HTTPS

Road2 peut être directement interrogé en HTTPS. Pour cela, il utilise le module `https` de NodeJS. Il est donc possible de lui fournir les options disponibles dans ce module. 
