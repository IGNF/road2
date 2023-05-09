<<<<<<< HEAD
# Release of Road2

Road2 is of course usable in production. This is already the case at IGN. The objective of this document is to provide elements that can help in making certain architecture and scaling choices. Of course, the elements that will be exposed depend on the expected stress and the size of the graphs made available.


## Architectural elements

Road2 has been coded to be exposed directly on the internet. However, it is advisable to consider it as middleware, and therefore to use a classic front, like NGINX.

Depending on the engine(s) used, it will be necessary to have access to a database. This is the case if one of the engines used is PGRouting. In this case, it is advisable to consider this database as middleware and to put it on a different machine from Road2. In fact, it is what performs the calculation of routes and isochrones and this calculation involves a significant use of CPUs.

## Scaling Elements

### CPU

As it is, Road2 runs on a single thread. An evolution is planned to modify this behavior. However, this part of the code performs little computation. On the other hand, the engines use the CPUs a lot in parallel. This will therefore be the first resource to monitor to establish the scaling. An example of use in production will be given in the [Performances](#Performances) section to illustrate this.

### RAM

Road2 doesn't really need RAM. Here too, the need will depend on the motors used.

OSRM can require a lot of RAM (cf. [OSRM notes](https://github.com/Project-OSRM/osrm-backend/wiki/Disk-and-Memory-Requirements)), but it is not necessary to operate. Also, it may depend on how the graphs are loaded into memory. The NodeJS binding we use does not load the entire graph into memory. A system administrator will certainly know how to optimize the use of RAM according to the data processed and the expected performance.

PGRouting is a database that has indexes. RAM usage is managed by PostgreSQL according to the parameters provided in the database configuration. We advise asking a database administrator to perform optimizations.

## Performance

Performance depends directly on the engine used, and of course on the machine used to host the service. It is the calculation carried out by the engine which takes the most time and gives the order of magnitude of the response time.

The following information is given as examples. If we consider a graph that covers the whole of France (~25GB for OSRM and 16GB for PGRouting) and two servers with 8 cpu and 32 GB of RAM, one for Road2 (+OSRM bindings) and one for the PGRouting database, we obtain the following performance:
- route via OSRM < 100 ms
- route via PGR < 2000 ms. Of course, the results are highly variable. For example, if we consider a small route, we will have performances < 1000 ms without problem.
- isochronous via PGR have results that are too variable to be averaged: less than one second for small isochronous (<30min) and several seconds for larger ones. Knowing that the response time does not follow linearly the increase in the duration of the isochrone but rather it seems to have an exponential evolution.

## Industrialization

This part covers some useful topics for the industrialization of Road2.

### Installation of dependencies specific to each engine

By default, the `npm install` command will attempt to install all dependencies. However, some of them are useless if a motor is not used. We can therefore proceed as follows:
```
# Install strictly necessary dependencies
npm install --no-optional --no-package-lock --no-save
# Then, if we use a single engine, like OSRM for example
npm install --no-package-lock --no-save osrm
```

### Pack

It is possible to make an archive of Road2 via the classic `npm pack` command launched at the root of the GIT project. The package will only contain the `src` folder and the `package.json`. If the `node_modules` are already present, then they are added to the archive.

## Other Items

### Error display

By default, if Road2 encounters an error, it will return the content of that error to the client. This is a suitable behavior during developments. But in production it is better to return a generic error. To do this, simply launch Road2 with the variable `NODE_ENV` at `production`.

### CORS management

By default, an API will not handle CORS. Each developer must specify if they want to use CORS within the API they are developing. Thus, it is possible to determine on which route one wishes to use which CORS. For example, we can authorize all origins on certain calculation routes and restrict them on administration routes.

To apply CORS, we use the `cors` module which integrates well with expressJS.

By default there are options that are used but they can be overridden. If you want to overload the options, you will make sure to add them in a configuration file independent of the rest of the application configuration, as specified in the paragraph dealing with adding an API.

### HTTPS management

Road2 can be queried directly over HTTPS. For this, it uses the `https` module of NodeJS. It is therefore possible to provide it with the [options](https://nodejs.org/docs/latest-v12.x/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) available in this module.
=======
# Mise en production de Road2 

Road2 est bien évidemment utilisable en production. C'est déjà le cas à l'IGN. L'objectif de ce document est de fournir des éléments qui peuvent aider à faire certains choix d'architecture et de dimensionnement. Bien évidemment, les éléments qui vont être exposés dépendent de la sollicitation attendue et de la taille des graphes mis à disposition. 


## Éléments d'architecture 

Road2 a été codé pour pouvoir être exposé directement sur internet. Il est cependant conseillé de le considérer comme un middleware, et donc de placer un front classique, comme NGINX, devant. 

Selon le ou les moteurs utilisés, il sera nécessaire d'avoir accès à une base de données. C'est le cas si l'un des moteurs employé est PGRouting. Dans ce cas, il est conseillé de considérer cette base comme un middleware et de la mettre sur une machine différente de Road2. En effet, c'est elle qui effectue le calcul des itinéraires et des isochrones et ce calcul entraîne un usage non négligeable des CPUs. 

## Éléments de dimensionnement 

### CPU

En l'état, Road2 fonctionne sur un seul thread. Une évolution est prévue pour modifier ce comportement. Cependant, cette partie du code effectue peu de calcul. Par contre, les moteurs utilisent beaucoup les CPUs en parallèle. Ce sera donc la première ressource à surveiller pour établir le dimensionnement. Un exemple d'usage en production sera donné dans la partie [Performances](#Performances) afin d'illustrer cela. 

### RAM 

Road2 n'a pas vraiment besoin de RAM. Ici aussi, le besoin va dépendre des moteurs utilisés. 

OSRM peut demander beaucoup de RAM (cf. [notes d'OSRM](https://github.com/Project-OSRM/osrm-backend/wiki/Disk-and-Memory-Requirements)), mais elle n'est pas nécessaire pour fonctionner. De plus, cela peut dépendre de la manière dont sont chargés les graphes en mémoire. Le binding NodeJS que nous utilisons ne charge pas l'ensemble du graphe en mémoire. Un administrateur système saura certainement comment optimiser l'usage de la RAM en fonction de la donnée traitée et des performances attendues. 

PGRouting est une base de données qui a des indexes. L'usage de la RAM est géré par PostgreSQL en fonction des paramètres fournis dans la configuration de la base. Nous conseillons l'appel à un administrateur de base de données pour effectuer des optimisations.  

## Performances 

Les performances dépendent directement du moteur employé, et bien évidemment de la machine utilisée pour héberger le service. C'est le calcul effectué par le moteur qui prend le plus de temps et donne l'ordre de grandeur du temps de réponse. 

Les informations suivantes sont données à titre d'exemples. Si on considère un graphe qui couvre l'ensemble du territoire français (~25Go pour OSRM et 16Go pour PGRouting) et deux serveurs de 8 cpu et 32 Go de RAM, un pour Road2 (+bindings OSRM) et un pour la base PGRouting, on obtient les performances suivantes : 
- itinéraire via OSRM < 100 ms
- itinéraire via PGR < 2000 ms. Bien sûr, les résultats sont très variables. Par exemple, si on considère un petit itinéraire, on aura des performances < 1000 ms sans problème. 
- isochrone via PGR ont des résultats trop variables pour être moyenné : moins d'une seconde pour des petits isochrones (<30min) et plusieurs secondes pour des plus grands. Sachant que le temps de réponse ne suit pas linéairement l'augmentation de la durée de l'isochrone mais il semble plutôt avoir une évolution exponentielle. 

## Industrialisation 

Cette partie aborde certains sujets utiles à l'industrialisation de Road2. 

### Installation des dépendances spécifiques à chaque moteur 

Par défaut, la commande `npm install` va tenter d'installer toutes les dépendances. Cependant, certaines d'entre elles sont inutiles si un moteur n'est pas utilisé. On pourra donc procéder de la manière suivante : 
```
# Installation des dépendances strictement nécessaires
npm install --no-optional --no-package-lock --no-save
# Ensuite, si on utilise un seul moteur, comme OSRM par exemple
npm install --no-package-lock --no-save osrm
```

### Paquet

Il est possible de faire une archive de Road2 via la commande classique `npm pack` lancée à la racine du projet GIT. Le paquet ne contiendra que le dossier `src` et le `package.json`. Si les `node_modules` sont déjà présents, alors ils sont ajoutés à l'archive. 

## Autres éléments 

### Affichage des erreurs

Par défaut, si Road2 rencontre une erreur, il va renvoyer au client le contenu de cette erreur. C'est un comportement adapté lors des développements. Mais en production, il est préférable de renvoyer une erreur générique. Pour cela, il suffit de lancer Road2 avec la variable `NODE_ENV` à `production`. 

### Gestion des CORS

Par défaut, une API ne va pas gérer les CORS. Chaque développeur doit préciser s'il souhaite utiliser les CORS au sein de l'API qu'il développe. Ainsi, il est possible de déterminer sur quelle route on souhaite utiliser quels CORS. Par exemple, on pourra autoriser toutes les origines sur certaines routes de calculs et les restreindre sur des routes d'administration.

Pour appliquer des CORS, on utilise le module `cors` qui s'intègre bien à expressJS.

Par défaut, il y a des options qui sont utilisées mais elles peuvent être remplacées. Si on souhaite surchargée les options, on veillera à les ajouter dans un fichier de configuration indépendant du reste de la configuration de l'application, comme cela est précisé dans le paragraphe traitant de l'ajout d'une API.  

### Gestion du HTTPS

Road2 peut être directement interrogé en HTTPS. Pour cela, il utilise le module `https` de NodeJS. Il est donc possible de lui fournir les [options](https://nodejs.org/docs/latest-v12.x/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) disponibles dans ce module. 
>>>>>>> a8e7531 (First draft on english documentation)
