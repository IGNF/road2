# Concepts utilisés pour Road2 

Ce chapitre décrit plusieurs concepts logiciels utilisés dans Road2. La plupart, si ce n'est tous, se rejoignent par leur objectif : la modularité de l'application. 

## Partie 1 : Modularité de l'application

### Indépendance entre les APIs et les moteurs

C'est le concept de base pour comprendre le code de Road2. 

#### Notions d'API 

**Une API, pour Road2, est un ensemble de routes que le serveur reconnaît et regroupe au sein d'une même appellation**. Pour chaque appellation, il y aura potentiellement plusieurs versions. Et au sein de chaque version, il y aura potentiellement plusieurs routes. 

Par exemple, si on considère une API qui s'appelle `rest` qui ne possède qu'une seule version `1.0.0`. Dans cette API, on pourrait définir une seule route `compute` qui permet de demander un itinéraire avec les paramètres `start` et `end` au minimum. On parlera alors de l'API `rest/1.0.0` qui permet à un utilisateur d'obtenir un itinéraire en faisant la requête `/rest/1.0.0/compute?start=2,48&end=2,48.1`. 

Chaque API est définie dans un dossier distinct des autres. Cela les rend indépendantes les unes des autres. Et pour une même appellation, on a une indépendance entre deux versions différentes. On trouvera des exemples d'implémentation dans le dossier des {{ '[apis du code]({}/tree/{}/src/js/apis)'.format(repo_url, repo_branch) }}. 

#### Notion de moteur 

**Un moteur, pour Road2, est une brique logicielle qui peut effectuer divers calculs**. Cette brique peut être une librairie, un autre service web, une base de données, etc... 

Par exemple, OSRM est un moteur qui est écrit en C++ et qui propose une enveloppe pour une utilisation avec NodeJS, et cela via un module NodeJS. C'est donc une simple dépendance dans le `package.json`. 

Au passage, il semble utile de préciser ici que chaque moteur est indépendant des autres par son implémentation dans le code du projet (cf. la notion de source plus bas).

#### Notion de service 

Road2 a été codé pour faciliter la gestion des APIs et des moteurs. Pour atteindre cet objectif, la partie API et la partie moteur sont séparées et aucune ne voit ce que fait l'autre.

Une API va donc devoir créer un objet requête générique qui sera envoyé à un *service*. Ce *service* renverra la requête vers le moteur concerné. Le moteur va donc recevoir cet objet, effectuer un calcul, et créer un objet réponse générique qui sera alors retourner à l'API. Cette dernière pourra alors la formater si nécessaire pour l'utilisateur. **Le *service* peut être considéré comme un proxy entre les APIs et les moteurs**. 

Cela permet d'ajouter ou supprimer une API sans qu'une telle modification impacte les moteurs. Et inversement.

### Lien entre les ressources et les sources

C'est le second concept le plus important après l'indépendance des APIs et des moteurs. Il est nécessaire de le comprendre pour développer sur le projet. 

#### Notion de graphe 

Il semble utile de passer la notion de *graphe*, selon Road2, pour expliquer ce qui suit. Quand on fait du calcul d'itinéraire, on utilise un moteur qui lit un *graphe* pour générer l'itinéraire. Or, **un *graphe* est une topologie, c'est-à-dire un ensemble de noeuds et d'arcs qui forment un tout navigable, sur laquelle il y a au moins un coût**. 

En effet, à chaque arc est associé au minimum un coût. Ce coût peut être la distance de l'arc ou le temps nécessaire pour le parcourir en voiture. Ainsi, chaque coût peut être vu comme le couple *profile/optimisation*, où *profile* est le moyen de transport (ex. voiture) et *optimisation* est le type de déplacement que l'on souhaite (ex. "plus rapide"). 

Certains graphes peuvent avoir plusieurs coûts par topologie (ex. PGRouting, Valhalla) et d'autres non (ex. OSRM). Mais lors d'un calcul d'itinéraire, un seul coût est utilisé. 

#### Notion de source 

Comme précisé juste au-dessus, pour avoir un itinéraire, il est nécessaire de faire appel à un moteur qui utilise un graphe. La *source*, dans le langage conceptuel de Road2, est l'origine du calcul. **La source contient l'appel à un moteur sur un graphe précis pour obtenir le résultat d'un calcul**. C'est le lien entre l'application et le calcul réel, comme celui d'un itinéraire par exemple. 

Concrètement, une *source* regroupe deux entités : 
- une classe Javascript qui fait le lien entre le reste du code et le moteur. Chaque moteur sera donc lié à Road2 par une classe fille de la classe `Source`. Cette classe fille devra contenir le code qui permet de demander au moteur un itinéraire ou autre chose (ex. isochrone, etc...). C'est ce qui concerne le développeur. 
- chaque instance de la classe, par une configuration qui indique où se trouve le graphe que le moteur peut lire, représente donc un moteur pour un graphe réel. On a alors la possibilité de calculer concrètement un itinéraire. C'est ce qui concerne l'administrateur du service d'itinéraire par l'intermédiaire de la configuration. Par exemple, une source instanciée sera l'appel du moteur OSRM sur un graphe, ctd une dossier, au format osrm. 

De tout ce qui vient d'être dit, on remarque qu'ajouter un moteur revient à ajouter une classe fille de `Source`. Cela génère une indépendance entre chaque moteur. 

De plus, en théorie, une unique source peut faire appel à plusieurs moteurs pour rendre un résultat. L'essentiel est qu'une source ne renvoie qu'un résultat pour une seule requête. 

Au final, une source va prendre prendre en compte une instance de `Request`, faire le calcul et renvoyer une instance de `Response`. Cela permet à la source de rester indépendante du reste du code. 

Lorsque l’on fait du calcul d’itinéraire, il faut à minima une topologie et des coûts associés à cette topologie. Un coût correspond à un seul mode de déplacement et une seule optimisation (ex. le couple Voiture/plus court).

Il se trouve qu'un graphe OSRM ne contient qu’un seul coût par dossier. Il permet donc de calculer des itinéraires uniquement sur un seul mode de déplacement et une seule optimisation. Par contre, PgRouting propose autant de colonnes de coût que l'on souhaite sur une même topologie. On retrouve le même regroupement de couples sur une topologie dans Valhalla. 

#### Notion de ressource 

Cependant, pour l'utilisateur et pour l'administrateur du service, nous avons créé la notion de *ressource*. **Une ressource sera définie comme un ensemble de sources**. C'est elle qui fait le lien entre une requête et la bonne source permettant d'y répondre. 

À l'origine, l'objectif était de pouvoir associer plusieurs sources issues des mêmes données mais ayant un calcul de coût différent, et donc de donner à l’*utilisateur* une vue simplifiée des contraintes techniques. La ressource étant donc le *lien* entre la vue technique et la vue utilisateur. **Une autre manière de voir la ressource est de la voir comme un graphe qui a plusieurs coûts sur chaque arc**. 

Cela est utile pour OSRM par exemple. Dans ce cas, il faut donc être vigilant lors de la génération des données. Lorsque l’on fera une ressource, il est alors impératif d’utiliser une même topologie pour plusieurs calculs de coûts différents. 

Mais depuis le début du projet, nous avons élargi les possibilités en permettant d'associer des sources qui n'ont pas la même topologie. Ainsi, aujourd'hui, une ressource n'est qu'un regroupement de sources. Il peut n'y en avoir qu'une. C'est souvent le cas pour PGRouting. 

Pour l'*administrateur*, une instance de Road2 doit pouvoir gérer plusieurs ressources. Une ressource sera notamment configurable par un fichier. Le serveur lira l’ensemble des fichiers contenus dans un dossier indiqué par la configuration générale. 

Il est à noter que tout cela peut d'ailleurs avoir un impact sur les contraintes, comme les filtres. En effet, les contraintes sont appliquées au niveau de la ressource et non d’une source. C’est un choix qui permet de simplifier la configuration. 

Enfin, précisons que Road2 est codé pour qu'il soit facile d'ajouter de nouveaux types de ressources et de sources indépendamment. Il est donc possible de créer différents types de source et de les associer au sein de divers types de ressources.

### Les opérations

Une opération est un calcul que l'on veut réaliser. Un calcul d'itinéraire, un calcul d'isochrone, un distancier sont des exemples d'opérations attendues. Or, un moteur donné ne peut pas forcément réaliser toutes ces opérations. Il se peut que l'un puisse faire des itinéraires et des distancier mais pas des isochrones. Il est donc nécessaire de savoir ce qu'un moteur peut faire.

De plus, une opération donnée peut être plus ou moins gourmandes en ressource. On voudra donc potentiellement gérer finement les autorisations d'opérations sur le service ou une ressource.

Road2 intègre donc la notion d'opération pour gérer ces différentes problématiques.

#### Les paramètres

Chaque opération possède des paramètres pour pouvoir effectuer un calcul. La plupart des paramètres peuvent se regrouper dans des catégories. Par exemple, un paramètre pourra être un mot clé issue d'une liste ou un point représentant des coordonnées.

Au sein de ces catégories, la vérification de la validité d'un paramètre suivra le même principe. Par exemple, pour un point, on va toujours vérifier s'il est inclue dans une emprise. Pour un mot clé, on va vérifier qu'il fait bien partie d'une liste prédéfinie.

Afin de mutualiser le code, des classes de paramètres ont été créées. Et elles peuvent être utilisées n'importe où dans le code. On trouvera un exemple d'utilisation de ces classes dans l'api `simple/1.0.0`.

### Interface : requests et responses 

Maintenant, il est possible de parler avec plus de détails de l'interface qu'il y a entre une API donnée et un moteur. Comme précisé plus haut, le moteur n'a pas connaissance des APIs et les APIs ne connaissent pas les moteurs. Ainsi, pour communiquer, il y a une interface qui se résume à deux classes d'objets Javascript : `Request` et `Response`. 

#### L'objet Request 

La classe `Request` est considérée comme une classe mère. À partir d'elle, on peut créer autant de classe fille que l'on veut. Chaque instance d'une classe fille `request` est une requête générique qui sera transmise à un moteur. Ce dernier ne saura donc pas quelle API l'a interrogé mais il aura toutes les informations utiles pour effectuer le calcul demandé. 

#### L'objet Response 

Quand un moteur a fini son calcul, il crée un objet qui lui est propre. Mais pour être compris par une API, il doit créer un objet `response`, classe fille de `Response`, qui représente une réponse générique que chaque API peut comprendre. L'API ne sait donc pas quel moteur a fait le calcul mais elle a toutes les informations utiles pour répondre à l'utilisateur selon le formalisme attendu. 

### Les contraintes 

Road2 a développé la notion de contrainte pour permettre de calculs d'itinéraire plus complexes. Une contrainte est une condition que l'on donne à Road2 et qu'il traduit aux différents moteurs qui supportent ces conditions. 

À titre d'exemple, une condition classique que l'on retrouve dans tout les moteurs peut être l'interdiction d'emprunter des autoroutes. 

Ces conditions ont été généralisées. En plus de pouvoir interdire, on peut préférer ou éviter certains types de routes. Et cela ne se limite pas à des types de routes, on peut définir les routes concernées la condition de plusieurs manières. Cela peut être lié à sa largeur, ou à n'importe quelle information présente dans la base. 

## Partie 2 : Fonctionnement général de l'application Road2

Cette partie décrit l'application de ces concepts dans le code au cours d'une exécution classique. 

### Au lancement de l'application

Le projet Road2 propose deux serveurs web, un service et un administrateur. Il donc possède deux points d'entrée selon l'usage que l'on souhaite en faire. On peut lancer uniquement le service et cela fonctionnera très bien. Et on peut aussi lancer un administrateur uniquement. Celui-ci lancera un service quand on le lui demandera. Enfin, on peut lancer les deux d'un coup.  

#### Lancement de l'administrateur 

Le premier point d'entrée possible est le fichier `src/js/road2.js`. Ce fichier va générer une instance de la classe `Administrator`.

Cet administrateur permet plusieurs choses : 
- On peut le lancer uniquement pour vérifier la bonne configuration de l'administrateur et des services associés. Dans ce cas là, le processus s'éteint après la vérification et renvoie un code d'erreur permettant de déterminer s'il y a eu un problème et son type. 
- On peut le lancer en mode serveur pour administrer un ou plusieurs services via une API HTTP(S). Dans ce cas là, il est possible de lui demander de lancer les service à son démarrage. Il sera aussi possible de les démarrer plus tard. 

Un administrateur a été créé pour réaliser des tâches qui auraient gêné la bonne exécution du service. 

L'administrateur a donc été créé pour être indépendant du service. Si l'administrateur a des tâches fastidieuses, cela n'impacte pas le service. Si l'un tombe, l'autre non. 

#### Lancement d'un service 

Le point d'entrée historique est le fichier `src/js/service/main.js`. Ce fichier va générer une instance de la classe `Service`. 

Ce service est l'objet qui permet de gérer les ressources proposées par l'instance en cours. Il contient donc un catalogue de ressources et un manager de ressources.

Chaque ressource contient plusieurs sources. Étant donné que plusieurs ressources peuvent pointer vers des sources communes, le service contient un catalogue de sources uniques et un manager de ces sources.

Lorsque l'application est lancée, on commence par lire la configuration de l'application pour être capable d'instancier le logger. Une fois que le logger est chargé, on vérifie complètement la configuration.

Après cela, on charge les ressources et les sources du service indiquées dans la configuration. C'est à ce moment que les fichiers sont lus, stockés en RAM si nécessaire, et que les connexions aux bases de données sont effectuées. 

Enfin, on finit par charger les APIs exposées par le service. C'est là qu'ExpressJS crée le ou les serveurs Node et charge les routes disponibles.  

#### Zoom sur la vérification de la configuration 

Que ce soit un administrateur ou un service, la configuration sera vérifiée. 

Cela passe généralement par des managers. 

##### Les managers

La plupart des classes ont un manager. Ce manager permet comme précisé juste avant de vérifier les configurations. Mais il permet aussi de créer les instances des classes concernées. Enfin, il garde aussi un trace des différentes instances et permet donc de les gérer. 

Les managers sont conçus pour être utilisés de la manière suivante : on le crée sans configuration. Par contre, il peut avoir d'autres managers en paramètre. 
Une fois créé, ce manager peut être utilisé pour vérifier une configuration. On peut lui donner la configuration d'un objet ou on peut parfois lui donner un ensemble de configuration. Dans ce deuxième cas, il y aura généralement une cohérence à vérifier entre chaque configuration. 
Ensuite, on pourra charger des objets à partir de leur configuration. Il est important de faire un check avant un load. Car les load présupposent la validité de la configuration. Ce qui est connu par un check. De la même manière, on pourra parfois en charger plusieurs par un seul appel au manager. Le fait de charger une seule fois une configuration présente en divers endroits sera géré dans le manager.  

Pour bien fonctionner, le manager aura donc deux listes. Une liste plutôt éphémère qui gardera une trace des configurations déjà vérifiées. Elle servira à vérifier la cohérence de l'ensemble des configurations. Cette liste devra être vidée quand les vérifications seront terminées. 
La deuxième liste sera une liste des configurations déjà chargées. Cette liste est persistante et indique l'état du manager. Elle sert à s'assurer que l'on charge une seule fois chaque configuration même si elle est demandée plusieurs fois. 
Aussi, quand on souhaitera modifier la configuration durant la vie de l'application, c'est cette liste qui sera considérée la première pour vérifier la cohérence. La première liste ne sera réutilisée que si c'est un ensemble censé être cohérent que l'on vérifie. 

### A la réception d'une requête

Lorsqu'une requête arrive, elle est traitée par le router d'ExpressJS de l'API appelée. Il est possible de faire les traitements que l'on veut au sein de ce router. Ces traitements peuvent n'avoir aucun rapport avec le reste de l'application. C'est un router express au sens basique du framework.

On peut supposer que l'objectif sera de faire un calcul d'itinéraire. Road2 intègre donc plusieurs classes et plusieurs fonctions qui permettent d'atteindre cet objectif sans toucher aux moteurs.

S'il y a des pré-traitements à effectuer avant de lancer un calcul, il sera préférable de les définir dans le fichier `index.js` qui contient la définition du router ou dans d'autres fichiers mais qui seront dans le dossier de l'API `${apiName}/${apiVersion}`. On préférera le même fonctionnement pour les post-traitements. Cela permettra de garder un code modulaire. 

Une fois les potentiels pré-traitements faits, il faut nécessairement créer un objet `request` pour l'envoyer au service de l'application via la fonction `service.computeRequest()`. Cette fonction va lancer le calcul et créer un objet `response` que l'API pourra alors ré-écrire pour répondre au client.

NB : Lors du traitement d'une requête `req` issue d'ExpressJS, il sera possible d'accéder à l'instance de la classe `Service` qui contient de nombreuses informations utiles. Cela sera possible par la méthode `req.app.get("service")` qui retourne l'instance du service. 

