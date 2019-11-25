# Documentation développeurs pour Road2

## Présentation de Road2

D'un point de vue développeur, *Road2 est un service web écrit en NodeJS*. Ce service propose le calcul d'itinéraires via des moteurs existants. Road2 est donc une interfaces pour moteurs de calculs d'itinéraires. Les calculs ne sont pas fait dans le code mais via l'appel à des librairies.

Road2 a été codé pour qu'il soit facile d'ajouter des nouvelles APIs d'accès ou des nouveaux moteurs de calcul.

## Modularité de l'application

### Indépendance entre les APIs et les moteurs

Comme précisé plus haut, Road2 a été codé pour faciliter la gestion des APIs et des moteurs. Pour atteindre cet objectif, la partie API et la partie moteur sont séparées et aucune ne voit ce que fait l'autre.

Une API va donc devoir créer un objet requête générique qui sera envoyé à un service. Ce service renverra la requête vers le moteur concerné. Le moteur va donc recevoir cet objet, effectuer un calcul, et créer un objet réponse générique qui sera alors retourner à l'API. Cette dernière pourra alors la formater si nécessaire pour l'utilisateur.

Cela permet d'ajouter ou supprimer une API sans qu'une telle modification impacte les moteurs. Et inversement.

### Lien entre les ressources et les sources

#### Notion de ressource et de source

Il est une contrainte technique qu’il serait préférable de masquer à l’utilisateur. Lorsque l’on fait du calcul d’itinéraire, il faut à minima une topologie et des coûts associés à cette topologie. Un coût correspond à un seul mode de déplacement et une seule optimisation(ex. Voiture/plus court).

Un graphe OSRM ne contient qu’un seul coût. Il permet donc de calculer des itinéraires uniquement sur un seul mode de déplacement et une seule optimisation. De la même manière, une fonction PgRouting utilise une seule colonne de coût à la fois.

Afin de masquer cette contrainte technique, on va regrouper plusieurs graphes issus des mêmes données topologiques mais ayant des coûts différents. Ce regroupement sera une *ressource*. Une ressource sera alors définie comme un ensemble de *sources*. Une source étant un fichier .osrm ou une table PgRouting permettant de calculer des itinéraires. En associant plusieurs sources issues des mêmes données mais ayant un calcul de coût différent, on peut donner à l’utilisateur une vue simplifiée des contraintes techniques. La ressource est donc le *lien* entre la vue technique et la vue utilisateur.

Il faudra donc être vigilant lors de la génération des données. Lorsque l’on fera une ressource, il sera impératif d’utiliser une même topologie pour plusieurs calculs de coûts différents. Cela a un impact sur les contraintes, comme les filtres. Les contraintes sont appliquées au niveau de la ressource et non d’une source. C’est un choix qui permet de simplifier la configuration.

Une ressource sera définie par un fichier. Le serveur lira l’ensemble des fichiers contenus dans un dossier indiqué par la configuration générale. Cet unique fichier permettra de décrire une seule ressource.

#### Gestion des ressources et des sources dans le code

Une instance doit pouvoir gérer plusieurs ressources. Road2 est codé pour qu'il soit facile d'ajouter de nouveaux types de ressources et de sources indépendamment. Il devrait être possible de créer différents types de source et de les associer, ou pas, dans divers types de ressources.

### Lien entre la source et un moteur

Ce qui fait le lien entre un moteur de calcul et le reste de l'application est la *source*. Une source définit un moyen de calculer un itinéraire. Ce peut être un fichier .osrm qui permet donc d'utiliser le moteur OSRM pour faire des calculs. Mais une source pourrait en théorie faire appel à plusieurs moteurs pour rendre un résultat. L'essentiel est de comprendre qu'une source ne renvoie qu'un résultat pour une seule requête.

Pour ajouter un moteur, il faut donc ajouter une source. Cette source peut ensuite être utilisée dans plusieurs ressources. Et cela, conjointement à d'autres types de sources.

### Les opérations

Une opération est un calcul que l'on veut réaliser. Un calcul d'itinéraire, un calcul d'isochrone, un distancier sont des exemples d'opérations attendues. Or, un moteur donné ne peut pas forcément réaliser toutes ces opérations. Il se peut que l'un puisse faire des itinéraires et des distancier mais pas des isochrones. Il est donc nécessaire de savoir ce qu'un moteur peut faire.

De plus, une opération donnée peut être plus ou moins gourmandes en ressource. On voudra donc potentiellement gérer finement les autorisations d'opérations sur le service ou une ressource.

Road2 intègre donc la notion d'opération pour gérer ces différentes problématiques.

#### Les paramètres

Chaque opération possède des paramètres pour pouvoir effectuer un calcul. La plupart des paramètres peuvent se regrouper dans des catégories. Par exemple, un paramètre pourra être un mot clé issue d'une liste ou un point représentant des coordonnées.

Au sein de ces catégories, la vérification de la validité d'un paramètre suivra le même principe. Par exemple, pour un point, on va toujours vérifier s'il est inclue dans une emprise. Pour un mot clé, on va vérifier qu'il fait bien partie d'une liste prédéfinie.

Afin de mutualiser le code, des classes de paramètres ont été créées. Et elles peuvent être utilisées n'importe où dans le code. On trouvera un exemple dans l'api simple.

## Modification du code

### API

La gestion des APIs se fait dans le dossier `src/js/apis`. Ce dossier suit l'arborescence suivante `${apiName}/${apiVersion}/index.js`. Le fichier `index.js` contient la définition de l'API. Ce fichier correspond à la définition d'un router expressJS.

L'ensemble des APIs est chargé par `src/js/utils/apisManager.js`. Ce fichier permet la lecture du dossier des APIs et leurs prises en compte dans l'application.

Il est parfois utile d'effectuer des traitements lors du chargement de l'application. On voudra par exemple générer un getCapabilities. On pourra également vouloir le mettre à jour durant la vie de l'application. Un router ExpressJS ne permet pas de stocker des objets, ni d'effectuer des traitements avant la mise en place du serveur, ni pendant la vie de l'application.
Pour gérer de telles problématiques, il est possible de créer les fichiers `init.js` et `update.js` qui seront dans dans le dossier de l'api. Ces fichiers devront être des modules NodeJS qui exportent une fonction `run(app, uid)`. C'est cette fonction qui sera appelée lors de l'initialisation de l'application et lors des mises à jours nécessaires. Le paramètre `app` est l'instance d'ExpressJS qui permet de stocker des références à des objets. Et le paramètre `uid` est un identifiant propre à chaque api qui permet de stocker des objets avec un faible risque de le perdre écrasé par un autre.

#### Modifier une API existante

Il suffit de modifier les fichiers contenus dans le dossier `${apiName}/${apiVersion}`.

#### Ajouter une API

Il suffit de créer l'arborescence `${apiName}/${apiVersion}/index.js` dans le dossier `src/js/apis`.

#### Supprimer une API

Pour supprimer une API, il suffit de supprimer le dossier qui contient sa définition.

#### Fichiers de configuration pour une API

Si on souhaite ajouter une configuration, on veillera à les ajouter dans un fichier de configuration indépendant du reste de la configuration de l'application. Par exemple, on pourra créer un fichier `src/config/apis/${apiName}/${apiVersion}/config.json` contenant la configuration nécessaire.

### Resource

Le dossier `src/js/resources` contient un manager de ressource qui permet à l'application de gérer l'ensemble de ces ressources, et la définition des ressources utilisables.

Chaque ressource est une classe qui dérive de la classe mère `resource.js`. Cette classe définit une ressource comme l'ensemble d'un id unique à l'instance et un type.

Chaque ressource peut alors contenir autant d'information supplémentaire qu'on le souhaite. Mais elle permet surtout de faire le lien avec une source, ou plusieurs, lors d'une requête. Chaque ressource doit implémenter la fonction `getSourceIdFromRequest()`.

#### Ajouter une ressource

Pour ajouter une ressource, il suffit donc d'ajouter un fichier dans le dossier `src/js/resources`. Ce fichier sera la définition d'une classe fille de `resource.js`.

Pour que cette ressource soit prise en compte dans l'application, il suffit de modifier le manager de ressources `src/js/resources/resourceManager.js`. Ce fichier permet à l'application de savoir que cette nouvelle ressource est disponible. Il suffira de copier et coller certaines parties du code et de les adapter.

#### Supprimer une ressource

Pour supprimer une ressource, il suffit de supprimer le fichier qui contient sa définition et les parties du code qui la concerne dans le manager de ressources.

### Source

Le dossier `src/js/sources` contient un manager de source qui permet à l'application de gérer l'ensemble de ces sources, et la définition des sources utilisables.

Chaque source est une classe qui dérive de la classe mère `source.js`. Cette classe définit une source comme l'ensemble d'un id unique à l'instance, d'un type et d'un état de connexion.

Chaque source peut alors contenir autant d'information supplémentaire qu'on le souhaite. Mais elle permet surtout de faire le lien avec un moteur, ou plusieurs, lors d'une requête. Chaque ressource doit implémenter les fonctions `connect()`, `disconnect()` et `computeRequest()`.

#### Ajouter une source

Pour ajouter une source, il suffit donc d'ajouter un fichier dans le dossier `src/js/sources`. Ce fichier sera la définition d'une classe fille de `source.js`.

Pour que cette source soit prise en compte dans l'application, il suffit de modifier le manager de sources `src/js/sources/sourceManager.js`. Ce fichier permet à l'application de savoir que cette nouvelle source est disponible. Il suffira de copier et coller certaines parties du code et de les adapter.

Ensuite, il faut créer ou modifier une ressource pour qu'elle utilise cette nouvelle source.

#### Supprimer une source

Pour supprimer une source, il suffit de supprimer le fichier qui contient sa définition et les parties du code qui la concerne dans le manager de sources et les ressources qui l'utilisent.

### Request

Le dossier `src/js/requests` contient la définition des classes `Request` et toutes celles qui en dérivent. Lorsqu'une requête arrive, une API doit utiliser l'une de ces classes filles pour interroger un moteur via le service. Par exemple, il existe déjà une classe fille pour calculer des itinéraires: `routeRequest`.

Chaque classe fille contient des informations utiles pour que les moteurs puissent traiter la requête. Ces informations sont nécessaires pour certaines et facultatives pour d'autres. Néanmoins, pour une raison quelconque, on souhaitera parfois ajouter une nouvelle classe fille. Par exemple, pour traiter une nouvelle opération ou pour traiter autrement une opération déjà existante. Cela évitera de modifier une classe existante et tous les impacts que cela peut avoir sur la gestion des moteurs.

#### Modifier une Request

Une `Request` est un élément central dans Road2 car il fait le lien entre une API et un moteur. Pour cette raison, modifier une telle classe aura des impacts sur les APIs et les sources qui l'utilisent.

#### Supprimer une Request

Il suffit de supprimer la classe concernée et ses usages dans les APIs et les sources concernés.

#### Ajouter une Request

Il suffit de créer une classe fille de `Request` et d'implémenter son usage dans une ou plusieurs APIs et sources.

### Operation

Une opération est définie par un id et des paramètres. Un paramètre est quant à lui définie par un id et d'autres attributs. Tout cela se définit via des fichiers de configuration JSON. Ces documents doivent être placés dans deux dossiers: un pour les opérations et un pour les paramètres. Actuellement, ils sont dans `src/resources/`. Ces dossiers sont précisés dans le fichier de configuration de l'application.

Les dossiers `src/js/operations` et `src/js/parameters` contiennent le code nécessaire à la gestion des opérations et des paramètres.

Il y a une distinction à faire entre les opérations de service et les opérations de ressource. Les opérations de services sont les opérations permises sur le service. Elles sont décrites par les JSON de `src/resources/`. Les opérations de ressource sont la déclinaison de ces opérations avec des paramètres spécifiques à chaque ressource. Ils sont décrits dans le fichier ressource.
Par exemple, on peut déclarer une opération de service que l'on nommera `route`. Pour le service, cette opération existe, est disponible et est décrite via des fichiers JSON. Cette opération peut nécessiter un paramètre `start`. À ce niveau, on sait que l'opération, que le paramètre existe et est obligatoire. Mais on ne sait pas quelles valeurs il peut prendre. Cela dépend de la ressource. Chaque ressource peut avoir une emprise différente.

#### Ajouter/modifier/supprimer une opération

Il suffit de travailler sur les fichiers JSON qui décrivent les opérations.

#### Ajouter/modifier/supprimer un type de paramètre

Il suffit de travailler sur les classes filles de `resourceParameter` et le `parameterManager`.

## Fonctionnement du code

### Au lancement de l'application

Road2 est un serveur web. Son point d'entrée est donc `src/js/road2.js`.

Ce serveur propose un service. Le service est l'objet qui permet de gérer les ressources proposées par l'instance en cours. Il contient donc un catalogue de ressources et un manager de ressources.

Chaque ressource contient plusieurs sources. Étant donné que plusieurs ressources peuvent pointer vers des sources communes, le service contient un catalogue de sources uniques et un manager de sources.

Lorsque l'application est lancée, on commence par charger la configuration de l'application pour être capable d'instancier le logger. Une fois que le logger est chargé, on vérifie complètement la configuration.

Après cela, on charge les ressources et les sources du service indiquées dans la configuration. On finit par charger les APIs exposées par le service.

### A la réception d'une requête

Lorsqu'une requête arrive, elle est traitée par le router expressJS de l'API appelée. Il est possible de faire les traitements que l'on veut au sein de ce router. Ces traitements peuvent n'avoir aucun rapport avec le reste de l'application. C'est un router express au sens basique du framework.

On peut supposer que l'objectif sera de faire un calcul d'itinéraire. Road2 intègre donc plusieurs classes et plusieurs fonctions qui permettent d'atteindre cet objectif sans toucher aux moteurs.

S'il y a des pré-traitements à effectuer avant de lancer un calcul, il sera préférable de les définir dans le fichier `index.js` qui contient la définition du router ou dans d'autres fichiers mais qui seront dans le dossier de l'API `${apiName}/${apiVersion}`. On préférera le même fonctionnement pour les post-traitements. Cela permettra de garder un code modulaire. Par exemple, la suppression d'une API n'entraînera pas la mort de certaines parties du code.

Une fois les potentiels pré-traitements faits, il faut nécessairement créer un objet `request` pour l'envoyer au service de l'application via la fonction `service.computeRequest()`. Cette fonction va lancer le calcul et créer un objet `response` que l'API pourra alors ré-écrire pour répondre au client.

Lors du traitement d'une requête `req` issue d'ExpressJS, il sera possible d'accéder à l'instance de la classe `Service` qui contient de nombreuses informations utiles. Cela sera possible par la méthode `req.app.get("service")` qui retourne l'instance du service.

#### Gestion des CORS

Par défaut, une API ne va pas gérer les CORS. Chaque développeur doit préciser s'il souhaite utiliser les CORS au sein de l'API qu'il développe. Ainsi, il est possible de déterminer sur quelle route on souhaite utiliser quels CORS. Par exemple, on pourra autoriser toutes les origines sur certaines routes de calculs et les restreindre sur des routes d'administration.

Pour appliquer des CORS, on utilise le module `cors` qui s'intègre bien à expressJS.

Par défaut, il y a des options qui sont utilisées mais elles peuvent être remplacées. Si on souhaite surchargée les options, on veillera à les ajouter dans un fichier de configuration indépendant du reste de la configuration de l'application, comme cela est précisé dans le paragraphe traitant de l'ajout d'une API.  

#### Gestion du HTTPS

Road2 peut être directement interrogé en HTTPS. Pour cela, il utilise le module `https` de NodeJS. Il est donc possible de lui fournir les options disponibles dans ce module. 

### Gestion des géométries dans le code

#### Pour la gestion d'une requête

L'objet `request`, qui est transmis au service, pourra contenir des coordonnées dans la projection de la topologie source, ou une autre. Et l'objet `response`, qui sera rendu, contiendra des géométries exprimées dans la projection des points demandés. 

## Optimisations pour une mise en production 

### Affichage des erreurs

Par défaut, si Road2 rencontre une erreur, il va renvoyer au client le contenu de cette erreur. C'est un comportement adapté lors des développements. Mais en production, il est préférable de renvoyer une erreur générique. Pour cela, il suffit de lancer Road2 avec la variable `NODE_ENV` à `production`.  

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

## Outils pour le développement

### Sonakube 

Il est possible d'analyser régulièrement le code avec Sonarkube. On pourra utiliser un container pour le serveur: 
```
docker run -d --name sonarqube -p 9000:9000 sonarqube
```

Cela demande d'installer le binaire `sonar-scanner` sur la machine. 

Pour une analyse continue lors des développements, il est possible d'installer l'extension Sonarlint dans certains IDE. 