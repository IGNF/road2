# Liste des fonctionnalités 

Road2 propose un ensemble de fonctionnalités regroupées dans plusieurs groupes. 



## Groupe de fonctionnalités 1 : Interface pour calculer des itinéraires 

### 1.1 : Définir un point de départ, un point d'arrivée et des points intermédiaires 

Fonctionnalités classiques et inévitables, elles ne seront pas détaillées ici. Précision : il est possible de préciser autant de point intermédaire que l'on souhaite. 

### 1.2 : Définir des contraintes 

La notion de contrainte est définie dans les [concepts](./concepts.md). Pour faire simple, il s'agit de spécifier des conditions que l'itinéraire devra remplir. La plus connue est certainement l'interdiction de prendre des autoroutes. Mais on peut avoir des conditions beaucoup plus complexes et on peut en appliquer plusieurs au calcul d'un itinéraire. 

### 1.3 : Préciser la ressource employée 

Comme précisé dans les [concepts](./concepts.md), Road2 gère des ressources. Chaque requête doit préciser la ressources qu'elle interroge. 

### 1.4 : Préciser le profile voulu

Il est possible de préciser quel moyen de transport, l'itinéraire concerne. 

### 1.5 : Préciser l'optimisation voulue 

Il est possbile de préciser l'optimisation que l'on veut appliquer lors du calcul. 

### 1.6 : Ajouter des informations sur chaque tronçons 

Selon les données présentes dans les graphes, il est possible de choisir les informations que l'on souhaite récupérer dans la réponse du calcul. 

### 1.7 : Préciser le contenu de la réponse 

Par l'intermédiaire de plusieurs paramètres, il est possible de préciser le contenu de la réponse : 
- La présence ou non des étapes du parcours. 
- Le format des géméométrie dans la réponse. Pour le moment, geojson et polyline sont disponibles. 
- La présence ou non d'une bbox dans la réponse. 

### 1.8 : Choisir les unités de la requête et de la réponse 

Grâce à des paramètres de la requête, il est possible d'influencer le format de la requête elle-même, et de la réponse : 
- Il est possible de définir la projection employée. 
- Le format des durées est modifiable. 
- Le format des distances est modifiable.  




## Groupe de fonctionnalités 2 : Interface pour calculer des isochrones et des isodistances 

### 2.1 : Définir un point de départ ou d'arrivée 

Fonctionnalité inévitable pour le calcul d'un isochrone. 

### 2.2 : Préciser la ressource employée 

Comme précisé dans les [concepts](./concepts.md), Road2 gère des ressources. Chaque requête doit préciser la ressources qu'elle interroge. 

### 2.3 : Préciser le type de coût employé 

Divers coûts sont possibles pour le calcul, il s'agit donc de le préciser. 

### 2.4 : Définir la valeur du coût employée 

Fonctionnalités inévitable pour un tel calcul. 

### 2.5 : Préciser le profil voulu 

Il est possible de préciser quel moyen de transport, l'isochrone concerne. 

### 2.6 : Indiquer la direction considérée pour le résultat du calcul

Un isochrone peut se définir dans deux directions : départ ou arrivée. Il s'agit donc de préciser laquelle.

### 2.7 : Définir des contraintes 

La notion de contrainte est définie dans les [concepts](./concepts.md). Elle est limitée aux interdictions, comme par exmple, l'interdiction de prendre des autoroutes. 

### 2.8 : Préciser le contenu de la réponse 

Par l'intermédiaire de plusieurs paramètres, un seul pour le moment, il est possible de préciser le contenu de la réponse : 
- Le format des géméométrie dans la réponse. Pour le moment, geojson et polyline sont disponibles. 

### 2.9 : Choisir les unités de la requête et de la réponse 

Grâce à des paramètres de la requête, il est possible d'influencer le format de la requête elle-même, et de la réponse : 
- Il est possible de définir la projection employée. 
- Le format des durées est modifiable. 
- Le format des distances est modifiable. 




## Groupe de fonctionnalités 3 : Proposer un service web 

Road2 prend la forme d'un serveur web qui fournit un service de calcul d'itinéraire. Il possède donc plusieurs fonctionnalités liées à cela. 

### 3.1 : Utiliser les protocoles HTTP et HTTPS 

Fonctionnalité explicite. 

### 3.2 : Configurer les CORS 

Fonctionnalité explicite. 

### 3.3 : Disposer de plusieurs APIs 

Comme présenté dans les [concepts](./concepts.md), Road2 offre la possibilité de proposer aux clients différentes APIs simultanément. 

### 3.4 : Disposer de plusieurs moteurs 

Comme présenté dans les [concepts](./concepts.md), Road2 offre la possibilité de proposer aux clients différents moteurs simultanément. 




## Groupe de fonctionnalités 4 : Administrer le service 

Le service peut être administrer de deux manières : la configuration et une API dédiée. 

### 4.1 : COnfigurer les ressources via la configuration

Via la configuration fichier du serveur, il est possible de créer des [ressources](./concepts.md) qui se baseront sur une ou plusieurs [sources](./concepts.md).

### 4.2 : Limiter certains usages via la configuration 

Les APIs de Road2 proposent plusieurs options, comme la possibilité de calculer des itinéraires avec des points intermédiaires. Il peut être intéressant de limiter l'usage de ces options afin de ne pas surcharger le service. 

### 4.3 : Obtenir la version du serveur via l'API

Fonctionnalité explicite. 

### 4.4 : Obtenir l'état de santé du serveur via l'API 

Fonctionnalité en cours d'implémentation. L'objectif est de récupèrer l'état de chaque [source](./concepts.md) du serveur et d'en faire un compte-rendu. 



## Groupe de fonctionnalités 5 : Fonctionnalités spécifiques à OSRM 

### 5.1 : Optimisation des graphes pour des réponses plus rapides

Fonctionnalité explicite. 

### 5.2 : Calcul des itinéraires

Fonctionnalité explicite. 

### 5.3 : Gestions des contraintes simples ou exclusions 

Les exclusions sont les contraintes classiques comme l'interdiction d'emprunter certains type de voies (ex. autoroutes). Ce sont les seuls contraintes disponibles via OSRM. 


## Groupe de fonctionnalités 6 : Fonctionnalités spécifiques à PGRouting

### 6.1 : Calcul d'itinéraire

Fonctionnalité explicite. 

### 6.1 : Calcul d'isochrone 

Fonctionnalité explicite. 

### 6.1 : Gestion de contraintes complexes 

PGRouting gère tout les types de contraintes, des plus simples au plus complexes. On peut donc interdire l'accès aux autoroutes ou préférer les routes qui ont une largeur supérieure à 5 mètres. 


## Groupe de fonctionnalités 7 : Fonctionnalités spécifiques à l'API simple/1.0.0

### 7.1 : Obtenir un GetCapabilities 

Le GetCapabilities est une réponse JSON qui décrit les paramètres de chaque opérations et les valeurs disponibles pour une instance de Road2. 

On trouvera un exemple dans la [documentation](../apis/simple/1.0.0/). 