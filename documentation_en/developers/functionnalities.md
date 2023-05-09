<<<<<<< HEAD
# List of features

Road2 offers a set of features spread across several groups.



## Function group 1: Interface for calculating routes

### Define a start point, an end point and intermediate points

Classic and unavoidable functionalities, they will not be detailed here. Precision: it is possible to specify as many intermediate points as desired.

### Define Constraints

The notion of constraint is defined in the [concepts](./concepts.md). Basically, it's about specifying conditions that the route must meet. The best known is certainly the prohibition to take highways. But we can have much more complex conditions and we can apply several of them to the calculation of a route.

### Specify the resource used

As specified in the [concepts](./concepts.md), Road2 manages resources. Each request must specify the resources it is querying.

### Specify the desired profile

It is possible to specify which means of transport the itinerary concerns.

### Specify the desired optimization

It is possible to specify the optimization to be applied during the calculation.

### Add information on each section

Depending on the data present in the graphs, it is possible to choose the information to be retrieved in the calculation response.

### Specify the content of the response

Via several parameters, it is possible to specify the content of the response:
- The presence or not of the steps of the course.
- The format of the geometries in the response. At the moment, geojson, polyline and wkt are available.
- Whether or not a bbox is present in the response.

### Choose request and response units

Using request parameters, it is possible to influence the format of the request itself, and of the response:
- You can define the projection used.
- The format of the durations can be modified.
- The format of the distances is modifiable.
=======
# Liste des fonctionnalités 

Road2 propose un ensemble de fonctionnalités regroupées dans plusieurs groupes. 



## Groupe de fonctionnalités 1 : Interface pour calculer des itinéraires 

### Définir un point de départ, un point d'arrivée et des points intermédiaires 

Fonctionnalités classiques et inévitables, elles ne seront pas détaillées ici. Précision : il est possible de préciser autant de point intermédiaire que l'on souhaite. 

### Définir des contraintes 

La notion de contrainte est définie dans les [concepts](./concepts.md). Pour faire simple, il s'agit de spécifier des conditions que l'itinéraire devra remplir. La plus connue est certainement l'interdiction de prendre des autoroutes. Mais on peut avoir des conditions beaucoup plus complexes et on peut en appliquer plusieurs au calcul d'un itinéraire. 

### Préciser la ressource employée 

Comme précisé dans les [concepts](./concepts.md), Road2 gère des ressources. Chaque requête doit préciser la ressources qu'elle interroge. 

### Préciser le profile voulu

Il est possible de préciser quel moyen de transport, l'itinéraire concerne. 

### Préciser l'optimisation voulue 

Il est possible de préciser l'optimisation que l'on veut appliquer lors du calcul. 

### Ajouter des informations sur chaque tronçons 

Selon les données présentes dans les graphes, il est possible de choisir les informations que l'on souhaite récupérer dans la réponse du calcul. 

### Préciser le contenu de la réponse 

Par l'intermédiaire de plusieurs paramètres, il est possible de préciser le contenu de la réponse : 
- La présence ou non des étapes du parcours. 
- Le format des géométries dans la réponse. Pour le moment, geojson, polyline et wkt sont disponibles. 
- La présence ou non d'une bbox dans la réponse. 

### Choisir les unités de la requête et de la réponse 

Grâce à des paramètres de la requête, il est possible d'influencer le format de la requête elle-même, et de la réponse : 
- Il est possible de définir la projection employée. 
- Le format des durées est modifiable. 
- Le format des distances est modifiable.  
>>>>>>> a8e7531 (First draft on english documentation)




<<<<<<< HEAD
## Feature group 2: Interface for calculating isochrones and isodistances

### Define a start or end point

Inevitable functionality for the calculation of an isochrone.

### Specify the resource used

As specified in the [concepts](./concepts.md), Road2 manages resources. Each request must specify the resources it is querying.

### Specify the type of cost used

Various costs are possible for the calculation, so it should be specified.

### Set cost value used

Inevitable features for such a calculation.

### Specify the desired profile

It is possible to specify which means of transport the isochrone concerns.

### Indicate the direction considered for the calculation result

An isochrone can be defined in two directions: departure or arrival. It is therefore a question of specifying which one.

### Define Constraints

The notion of constraint is defined in the [concepts](./concepts.md). It is limited to prohibitions, such as, for example, the prohibition to take motorways.

### Specify the content of the response

Via several parameters, only one for the moment, it is possible to specify the content of the response:
- The format of the geometries in the response. At the moment, geojson, polyline and wkt are available.

### Choose request and response units

Using request parameters, it is possible to influence the format of the request itself, and of the response:
- It is possible to define the projection used.
- The format of the durations can be modified.
- The format of the distances is modifiable.


## Feature group 3: Provide a web service

Road2 takes the form of a web server which provides a route calculation service. So it has several features related to that.

### Use HTTP and HTTPS protocols

Self-explanatory feature.

### Configure CORS

Self-explanatory feature.

### Have several APIs

As presented in the [concepts](./concepts.md), Road2 offers the possibility of offering customers different APIs simultaneously.

### Have multiple engines

As presented in the [concepts](./concepts.md), Road2 offers the possibility of offering customers different engines simultaneously.


## Feature Group 4: Administer Service

The service can be administered in two ways: configuration and a dedicated API.

### Configure resources via configuration

Via the configuration file of the server, it is possible to create [resources](./concepts.md) which will be based on one or more [sources](./concepts.md).

### Limit certain uses via configuration

Road2's APIs offer several options, such as the ability to calculate routes with intermediate points. It may be interesting to limit the usage of these options so as not to overload the service.

### Get server version via API

Self-explanatory feature.

### Get server health status via API

Feature being implemented. The goal is to retrieve the status of each [source](./concepts.md) from each service and report it.

### Get administrator configuration

### Get configuration for services managed by an administrator

### Obtain the configuration of a service via its id

### Restart a service via its id

### Obtain the list of projections managed by a service

### Obtain the presence of a projection via its id

## Feature Group 5: OSRM Specific Features

### Graph optimization for faster responses

Self-explanatory feature.

### Route calculation

Self-explanatory feature.

### Management of simple constraints or exclusions

The exclusions are the classic constraints such as the prohibition to use certain types of roads (eg motorways). These are the only constraints available through OSRM.

### Determine the nearest graph point

For a given point, OSRM can return the nearest points of the graph.

## Feature Group 6: PGRouting Specific Features

### Route calculation

Self-explanatory feature.

### Isochrone calculation

Self-explanatory feature.

### Management of complex constraints

PGRouting manages all types of constraints, from the simplest to the most complex. We can therefore prohibit access to motorways or prefer roads that have a width greater than 5 meters.


## Feature Group 7: Simple API/1.0.0 Specific Features

### Getting a GetCapabilities

The GetCapabilities is a JSON response that describes the parameters for each operation and the values available for an instance of Road2.

An example can be found in {{ '[documentation]({}/tree/{}/documentation/apis/simple/1.0.0/)'.format(repo_url, repo_branch) }}.
=======
## Groupe de fonctionnalités 2 : Interface pour calculer des isochrones et des isodistances 

### Définir un point de départ ou d'arrivée 

Fonctionnalité inévitable pour le calcul d'un isochrone. 

### Préciser la ressource employée 

Comme précisé dans les [concepts](./concepts.md), Road2 gère des ressources. Chaque requête doit préciser la ressources qu'elle interroge. 

### Préciser le type de coût employé 

Divers coûts sont possibles pour le calcul, il s'agit donc de le préciser. 

### Définir la valeur du coût employée 

Fonctionnalités inévitable pour un tel calcul. 

### Préciser le profil voulu 

Il est possible de préciser quel moyen de transport, l'isochrone concerne. 

### Indiquer la direction considérée pour le résultat du calcul

Un isochrone peut se définir dans deux directions : départ ou arrivée. Il s'agit donc de préciser laquelle.

### Définir des contraintes 

La notion de contrainte est définie dans les [concepts](./concepts.md). Elle est limitée aux interdictions, comme par exemple, l'interdiction de prendre des autoroutes. 

### Préciser le contenu de la réponse 

Par l'intermédiaire de plusieurs paramètres, un seul pour le moment, il est possible de préciser le contenu de la réponse : 
- Le format des géométrie dans la réponse. Pour le moment, geojson, polyline et wkt sont disponibles. 

### Choisir les unités de la requête et de la réponse 

Grâce à des paramètres de la requête, il est possible d'influencer le format de la requête elle-même, et de la réponse : 
- Il est possible de définir la projection employée. 
- Le format des durées est modifiable. 
- Le format des distances est modifiable. 


## Groupe de fonctionnalités 3 : Proposer un service web 

Road2 prend la forme d'un serveur web qui fournit un service de calcul d'itinéraire. Il possède donc plusieurs fonctionnalités liées à cela. 

### Utiliser les protocoles HTTP et HTTPS 

Fonctionnalité explicite. 

### Configurer les CORS 

Fonctionnalité explicite. 

### Disposer de plusieurs APIs 

Comme présenté dans les [concepts](./concepts.md), Road2 offre la possibilité de proposer aux clients différentes APIs simultanément. 

### Disposer de plusieurs moteurs 

Comme présenté dans les [concepts](./concepts.md), Road2 offre la possibilité de proposer aux clients différents moteurs simultanément. 


## Groupe de fonctionnalités 4 : Administrer le service 

Le service peut être administrer de deux manières : la configuration et une API dédiée. 

### Configurer les ressources via la configuration

Via la configuration fichier du serveur, il est possible de créer des [ressources](./concepts.md) qui se baseront sur une ou plusieurs [sources](./concepts.md).

### Limiter certains usages via la configuration 

Les APIs de Road2 proposent plusieurs options, comme la possibilité de calculer des itinéraires avec des points intermédiaires. Il peut être intéressant de limiter l'usage de ces options afin de ne pas surcharger le service. 

### Obtenir la version du serveur via l'API

Fonctionnalité explicite. 

### Obtenir l'état de santé du serveur via l'API 

Fonctionnalité en cours d'implémentation. L'objectif est de récupérer l'état de chaque [source](./concepts.md) du serveur et d'en faire un compte-rendu. 



## Groupe de fonctionnalités 5 : Fonctionnalités spécifiques à OSRM 

### Optimisation des graphes pour des réponses plus rapides

Fonctionnalité explicite. 

### Calcul des itinéraires

Fonctionnalité explicite. 

### Gestions des contraintes simples ou exclusions 

Les exclusions sont les contraintes classiques comme l'interdiction d'emprunter certains type de voies (ex. autoroutes). Ce sont les seuls contraintes disponibles via OSRM. 

### Déterminer le point du graphe le plus proche

Pour un point donnée, OSRM peut renovyer les points les plus proches du graphe. 



## Groupe de fonctionnalités 6 : Fonctionnalités spécifiques à PGRouting

### Calcul d'itinéraire

Fonctionnalité explicite. 

### Calcul d'isochrone 

Fonctionnalité explicite. 

### Gestion de contraintes complexes 

PGRouting gère tout les types de contraintes, des plus simples au plus complexes. On peut donc interdire l'accès aux autoroutes ou préférer les routes qui ont une largeur supérieure à 5 mètres. 


## Groupe de fonctionnalités 7 : Fonctionnalités spécifiques à l'API simple/1.0.0

### Obtenir un GetCapabilities 

Le GetCapabilities est une réponse JSON qui décrit les paramètres de chaque opérations et les valeurs disponibles pour une instance de Road2. 

On trouvera un exemple dans la {{ '[documentation]({}/tree/{}/documentation/apis/simple/1.0.0/)'.format(repo_url, repo_branch) }}. 
>>>>>>> a8e7531 (First draft on english documentation)
