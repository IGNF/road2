# Concepts utilisés pour Road2 


## Modularité de l'application

### Indépendance entre les APIs et les moteurs

Road2 a été codé pour faciliter la gestion des APIs et des moteurs. Pour atteindre cet objectif, la partie API et la partie moteur sont séparées et aucune ne voit ce que fait l'autre.

Une API va donc devoir créer un objet requête générique qui sera envoyé à un service. Ce service renverra la requête vers le moteur concerné. Le moteur va donc recevoir cet objet, effectuer un calcul, et créer un objet réponse générique qui sera alors retourner à l'API. Cette dernière pourra alors la formater si nécessaire pour l'utilisateur.

Cela permet d'ajouter ou supprimer une API sans qu'une telle modification impacte les moteurs. Et inversement.

### Lien entre les ressources et les sources

#### Notion de ressource et de source

Il est une contrainte technique qu’il serait préférable de masquer à l’utilisateur. Lorsque l’on fait du calcul d’itinéraire, il faut à minima une topologie et des coûts associés à cette topologie. Un coût correspond à un seul mode de déplacement et une seule optimisation(ex. Voiture/plus court).

Par exemple, un graphe OSRM ne contient qu’un seul coût. Il permet donc de calculer des itinéraires uniquement sur un seul mode de déplacement et une seule optimisation. De la même manière, une fonction PgRouting utilise une seule colonne de coût à la fois.

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


## Fonctionnement général de l'application Road2

### Au lancement de l'application

Road2 est un serveur web. Son point d'entrée est le fichier `src/js/road2.js`.

Ce serveur propose un service. Le service est l'objet qui permet de gérer les ressources proposées par l'instance en cours. Il contient donc un catalogue de ressources et un manager de ressources.

Chaque ressource contient plusieurs sources. Étant donné que plusieurs ressources peuvent pointer vers des sources communes, le service contient un catalogue de sources uniques et un manager de ces sources.

Lorsque l'application est lancée, on commence par lire la configuration de l'application pour être capable d'instancier le logger. Une fois que le logger est chargé, on vérifie complètement la configuration.

Après cela, on charge les ressources et les sources du service indiquées dans la configuration. On finit par charger les APIs exposées par le service.

### A la réception d'une requête

Lorsqu'une requête arrive, elle est traitée par le router expressJS de l'API appelée. Il est possible de faire les traitements que l'on veut au sein de ce router. Ces traitements peuvent n'avoir aucun rapport avec le reste de l'application. C'est un router express au sens basique du framework.

On peut supposer que l'objectif sera de faire un calcul d'itinéraire. Road2 intègre donc plusieurs classes et plusieurs fonctions qui permettent d'atteindre cet objectif sans toucher aux moteurs.

S'il y a des pré-traitements à effectuer avant de lancer un calcul, il sera préférable de les définir dans le fichier `index.js` qui contient la définition du router ou dans d'autres fichiers mais qui seront dans le dossier de l'API `${apiName}/${apiVersion}`. On préférera le même fonctionnement pour les post-traitements. Cela permettra de garder un code modulaire. Par exemple, la suppression d'une API n'entraînera pas la mort de certaines parties du code.

Une fois les potentiels pré-traitements faits, il faut nécessairement créer un objet `request` pour l'envoyer au service de l'application via la fonction `service.computeRequest()`. Cette fonction va lancer le calcul et créer un objet `response` que l'API pourra alors ré-écrire pour répondre au client.

NB : Lors du traitement d'une requête `req` issue d'ExpressJS, il sera possible d'accéder à l'instance de la classe `Service` qui contient de nombreuses informations utiles. Cela sera possible par la méthode `req.app.get("service")` qui retourne l'instance du service. 

