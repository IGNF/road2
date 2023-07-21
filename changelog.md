# CHANGELOG

## 2.2.0

CHANGED:
  - GET /admin/1.0.0/services/{service}/projections/{projection} renvoit aussi les paramétres de la projection
  - Projections were added for France and a file was created to separate them from the world wide projections
  - Github issue templates were modified
  - Use swagger-ui-express to display simple and administration openapi documentation

ADDED:
  - A Github PR template was added
  - A code of conduct was adapted from the contributor covenant 
  - A contributing was added

## 2.1.1

CHANGED: 
  - reference de la doc à la branche master
  - modification de la ci github pour prendre en compte la branche master

FIXED:
- correction pour éviter de publier github pages sur un tag

## 2.1.0

ADDED:
  - Ajout de la route GET /admin/1.0.0/services dans l'API d'administration
  - Ajout de la route GET /admin/1.0.0/services/{service} dans l'API d'administration
  - Ajout de la route GET /admin/1.0.0/services/{service}/restart dans l'API d'administration
  - Ajout de la route GET /admin/1.0.0/services/{service}/projections/{projection} dans l'API d'administration
  - Ajout de la route GET /admin/1.0.0/configuration dans l'API d'administration
  - Il est maintenant possible démarrer un administrateur sans services pré-configurés

CHANGED:
  - La documentation de l'API d'administration a été grandement enrichie. 
  - La route /health a une réponse plus complète et est vraiment codée pour prendre en compte l'état de chaque service et chaque source disponibles.
  - Les dossiers de sources et de resources des services peuvent maintenant être vide à l'initialisation. 

DELETED:
  - L'option onStart de la configuration admin est supprimée 

## 2.0.0

ADDED:
  - La classe Administrator permet de gérer le service via une API. Notamment la création, la suppression et la modification d'un service seront possible. 
    - Cette classe est configurée par un nouveau fichier de configuration. 
    - Les classes service* sont des interfaces pour permettre à l'administrateur de gérer les services associés. Elles permettent de gérer un service dans le même processus ou dans un nouveau (méthode conseillée). 
  - Ajout du moteur Valhalla pour les itinéraires et les isochrones
  - Le module `wkt` a été remplacé par une implémentation interne
  - Le format wkt est disponible pour le paramètre geometryFormat de l'API simple/1.0.0

CHANGED:
  - L'option --configCheck au démarrage de Road2 n'a plus exactement le même comportement. 
  - Le fichier server.json permet maintenant de configurer l'administrateur et donc n'a plus le même contenu. Ce dernier est dans service.json. 
  - Les sources ne sont plus configurées dans le même fichier que les ressources. Chaque source est configurée dans son fichier. L'ensemble est placé dans un dossier de sources. Il peut y en avoir plusieurs. 
  - Les sources PGRouting et Valhalla ne sont plus configurées de la même manière : chaque source de ces types peut contenir plusieurs coûts. 

FIXED:
  - Les reprojections des isochrones fonctionnent

UPDATED:
  - Passage à `osrm` 5.26.0
  - Passage à `pg` 8.8.0
  - Passage à `turf` 6.5.0
  - Passage à `express` 4.18.2
  - Passage à `helmet` 6.0.1
  - Passage à `https-proxy-agent` 5.0.1
  - Passage à `log4js` 6.7.1
  - Passage à `nconf` 0.12.0
  - Passage à `proj4` 2.8.0
  - Utilisation de NodeJS 16 dans docker
  - Passage à `pgrouting-procedures` 2.0.0
  - Passage à `route-graph-generator` 1.2.3

## 1.1.2

FIXED:
  - Géométries reprojetées pour les requêtes sur PGRouting

## 1.1.1

FIXED:
  - Géométrie étrange quand on est dans une raquette

## 1.1.0

ADDED:
  - Ajout de la fonctionnalité nearest via OSRM

## 1.0.14
FIXED:
  - Mauvaise ligne pour un log

## 1.0.13
ADDED:
  - Pas d'erreur si certificat auto-signé ou périmé

## 1.0.12
FIXED:
  - got dans bundledDependencies
  - http-proxy-agent dans bundledDependencies

## 1.0.11
FIXED:
  - wkt dans bundledDependencies

## 1.0.10
ADDED:
  - Ressource hybride smartrouting / pgr pour l'isochrone

## 1.0.6

ADDED:
 - chaque source peut donner l'état de sa connexion
 - Attribut `instruction` dans les `step`. Vide pour les sources PGR, rempli pour les sources osrm avec la norme OSRM : http://project-osrm.org/docs/v5.5.1/api/#stepmaneuver-object

CHANGED:
 - passage à OSRM 5.25.0

FIXED:
 - géométrie des itinéraires invalide lorsqu'après être passé par un point intermédiaire, l'itinéraire doit reprendre le même tronçon en sens inverse

## 1.0.5

FIXED:
 - gestion d'une erreur PGR si aucun isochrone n'est trouvé.
 - le min d'un paramètre peut être à 0 dans le getcapabilities
 - la description de getsteps est complète dans le getcapabilities

CHANGED:
 - log des erreurs pgr et osrm seulement si ce n'est pas un "path/iso not found"
 - les tests fonctionnels peuvent être joués en https ou http selon la configuration
 - Tests fonctionnels: gestion de la config au début du fichier cucumber
 - descriptions modifiées des operations et parametres (fichiers json)
 - package.json : passage des dépendances osrm et pg en optionnel

ADDED:
 - gestion des proxy http pour les tests fonctionnels
 - lecture du hostname dans la request et adaptation du getcapabilities

## 1.0.4

CHANGED:
 - suppresion des dossiers temporaires dans les tests fonctionnels

FIXED:
 - Plus d'erreur dans l'isochrone quand la costValue est trop basse pour avoir un polygone
 - min et max de costValue n'etaient pas dans l'objet values

## 1.0.3

CHANGED:
 - Le port HTTPS peut être n'import quel port
 - Lorsqu'une erreur identifiée (par un code) est remontée, cela écrit un log debug et plus error.

FIXED:
 - La vérification des sources est plus fine quant au type des opérations possibles (ajout de l'isochrone).

## 1.0.2

ADDED:
 - Modification du server.json: emplacement du fichier de configuration des CORS
 - Création d'un fichier de configuration des CORS
 - L'utilisation de cors et helmet se fait au niveau du service et plus de l'API
 - Ajout d'une API d'admin 1.0.0 qui permet déjà d'avoir la version de Road2

CHANGED:
 - L'API simple 1.0.0 utilse donc la configuration des CORS indiquée dans le fichier de configuration du serveur
 - Passage à OSRM 5.24.0
