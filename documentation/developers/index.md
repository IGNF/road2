# Documentation développeurs pour Road2

## Présentation de Road2

D'un point de vue développeur, Road2 est un service web écrit en NodeJS. Ce service propose le calcul d'itinéraires via des moteurs existants. Road2 est donc une interfaces pour moteurs de calculs d'itinéraires. Les calculs ne sont pas fait dans le code mais via l'appel à des librairies.

Road2 a été codé pour qu'il soit facile d'ajouter une nouvelle API d'accès ou un nouveau moteur de calcul.

## Principes d'organisation du code

Road2 est un serveur web. Son point d'entrée est donc `src/js/server.js`.

Ce serveur propose un service. Le service est l'objet qui permet de gérer les ressources proposées par l'instance en cours. Il contient donc un catalogue de ressources et un manager de ressources.

Chaque ressource contient plusieurs sources. Étant donné que plusieurs ressources peuvent pointer vers des sources communes, le service contient un catalogue de sources uniques et un manager de sources.

## Modularité de l'application

Comme précisé plus haut, Road2 a été codé pour faciliter la gestion des APIs et des moteurs. Pour atteindre cet objectif, la partie API et la partie moteur sont séparées et aucune ne voit ce que fait l'autre.

Une API va donc devoir créer un objet requête générique qui sera envoyé à un proxy. Ce proxy saura vers quel moteur rediriger la requête. Le moteur va donc recevoir cet objet, effectuer un calcul, et créer un objet réponse générique qui sera alors retourner à l'API. Cette dernière pourra alors la formater si nécessaire pour l'utilisateur.

Cela permet d'ajouter ou supprimer une API sans qu'une telle modification impacte les moteurs. Et inversement.

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

### Moteur
