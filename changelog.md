# 1.O.14
FIXED:
  - Mauvaise ligne pour un log

# 1.O.13
ADDED:
  - Pas d'erreur si certificat auto-signé ou périmé

# 1.O.12
FIXED:
  - got dans bundledDependencies
  - http-proxy-agent dans bundledDependencies

# 1.0.11
FIXED:
  - wkt dans bundledDependencies

# 1.0.10
ADDED:
  - Ressource hybride smartrouting / pgr pour l'isochrone

# 1.0.6

ADDED:
 - chaque source peut donner l'état de sa connexion
 - Attribut `instruction` dans les `step`. Vide pour les sources PGR, rempli pour les sources osrm avec la norme OSRM : http://project-osrm.org/docs/v5.5.1/api/#stepmaneuver-object

CHANGED:
 - passage à OSRM 5.25.0

FIXED:
 - géométrie des itinéraires invalide lorsqu'après être passé par un point intermédiaire, l'itinéraire doit reprendre le même tronçon en sens inverse

# 1.0.5

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

# 1.0.4

CHANGED:
 - suppresion des dossiers temporaires dans les tests fonctionnels

FIXED:
 - Plus d'erreur dans l'isochrone quand la costValue est trop basse pour avoir un polygone
 - min et max de costValue n'etaient pas dans l'objet values

# 1.0.3

CHANGED:
 - Le port HTTPS peut être n'import quel port
 - Lorsqu'une erreur identifiée (par un code) est remontée, cela écrit un log debug et plus error.

FIXED:
 - La vérification des sources est plus fine quant au type des opérations possibles (ajout de l'isochrone).

# 1.0.2

ADDED:
 - Modification du server.json: emplacement du fichier de configuration des CORS
 - Création d'un fichier de configuration des CORS
 - L'utilisation de cors et helmet se fait au niveau du service et plus de l'API
 - Ajout d'une API d'admin 1.0.0 qui permet déjà d'avoir la version de Road2

CHANGED:
 - L'API simple 1.0.0 utilse donc la configuration des CORS indiquée dans le fichier de configuration du serveur
 - Passage à OSRM 5.24.0
