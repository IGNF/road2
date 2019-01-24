# Documentation développeurs pour Road2

## Présentation de Road2

D'un point de vue développeur, *Road2 est un service web écrit en NodeJS*. Ce service propose le calcul d'itinéraires via des moteurs existants. Road2 est donc une interfaces pour moteurs de calculs d'itinéraires. Les calculs ne sont pas fait dans le code mais via l'appel à des librairies.

Road2 a été codé pour qu'il soit facile d'ajouter des nouvelles APIs d'accès ou des nouveaux moteurs de calcul.

## Principes d'organisation du code

Road2 est un serveur web. Son point d'entrée est donc `src/js/server.js`.

Ce serveur propose un service. Le service est l'objet qui permet de gérer les ressources proposées par l'instance en cours. Il contient donc un catalogue de ressources et un manager de ressources.

Chaque ressource contient plusieurs sources. Étant donné que plusieurs ressources peuvent pointer vers des sources communes, le service contient un catalogue de sources uniques et un manager de sources.

## Modularité de l'application

### Indépendance entre les APIs et les moteurs

Comme précisé plus haut, Road2 a été codé pour faciliter la gestion des APIs et des moteurs. Pour atteindre cet objectif, la partie API et la partie moteur sont séparées et aucune ne voit ce que fait l'autre.

Une API va donc devoir créer un objet requête générique qui sera envoyé à un proxy. Ce proxy saura vers quel moteur rediriger la requête. Le moteur va donc recevoir cet objet, effectuer un calcul, et créer un objet réponse générique qui sera alors retourner à l'API. Cette dernière pourra alors la formater si nécessaire pour l'utilisateur.

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

## Modification du code

### API

La gestion des APIs se fait dans le dossier `src/js/apis`. Ce dossier suit l'arborescence suivante `${apiName}/${apiVersion}/index.js`. Le fichier `index.js` contient la définition de l'API. Ce fichier correspond à la définition d'un router expressJS.

L'ensemble des APIs est chargé par `src/js/utils/apisManager.js`. Ce fichier permet la lecture du dossier des APIs et leurs prises en compte dans l'application.

#### Modifier une API existante

Il suffit de modifier les fichiers contenus dans le dossier `${apiName}/${apiVersion}`.

#### Ajouter une API

Il suffit de créer l'arborescence `${apiName}/${apiVersion}/index.js` dans le dossier `src/js/apis`.

#### Supprimer une API

Pour supprimer une API, il suffit de supprimer le dossier qui contient sa définition.

### Resource

Le dossier `src/js/resources` contient un manager de ressource qui permet à l'application de gérer l'ensemble de ces ressources, et la définition des ressources utilisables.

Chaque ressource est une classe qui dérive de la classe mère `resource.js`. Cette classe définit une ressource comme l'ensemble d'un id unique à l'instance et un type.

Chaque ressource peut alors contenir autant d'information supplémentaire qu'on le souhaite.

#### Ajouter une ressource

Pour ajouter une ressource, il suffit donc d'ajouter un fichier dans le dossier `src/js/resources`. Ce fichier sera la définition d'une classe fille de `resource.js`.

Pour que cette ressource soit prise en compte dans l'application, il suffit de modifier le manager de ressources `src/js/resources/resourceManager.js`. Ce fichier permet à l'application de savoir que cette nouvelle ressource est disponible. Il suffira de copier et coller certaines parties du code et de les adapter.

#### Supprimer une ressource

Pour supprimer une ressource, il suffit de supprimer le fichier qui contient sa définition et les parties du code qui la concerne dans le manager de ressources.

### Source