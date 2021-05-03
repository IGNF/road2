# 1.0.5-DEVELOP

FIXED:
 - gestion d'une erreur PGR si aucun isochrone n'est trouvé. 

CHANGED:
 - log des erreurs pgr et osrm seulement si ce n'est pas un "path/iso not found"

ADDED: 
 - Gestion des proxy http pour les tests fonctionnels

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
