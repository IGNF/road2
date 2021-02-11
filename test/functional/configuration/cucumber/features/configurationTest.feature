# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: Configuration correcte
    Given a valid configuration 
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "La vérification de la configuration est terminée"
    Then the server log should not contain error

  Scenario: Mauvais argument de la ligne de commande (valeur vide)
    Given a valid configuration 
    And with "" for command line parameter "ROAD2_CONF_FILE"
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Impossible de recuperer le chemin absolu du fichier de configuration"

  Scenario: Mauvais argument de la ligne de commande (fichier qui n'existe pas)
    Given a valid configuration 
    And with "test1" for command line parameter "ROAD2_CONF_FILE"
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: fichier de configuration global inexistant"
  
  #TODO Fix: root peut toujours lire un fichier même si chmod 000
  #Scenario: Mauvais argument de la ligne de commande (fichier qui ne peut être lu)
  #  Given a valid configuration 
  #  And a server configuration non readable
  #  When I test the configuration
  #  Then the configuration analysis should give an exit code 1
  #  Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration de Road2"

  Scenario: Pas d'argument ROAD2_CONF_FILE dans la ligne de commande 
    Given a valid configuration 
    And without parameter "ROAD2_CONF_FILE" in command line
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Aucun fichier de configuration. Utiliser la variable d'environnement $ROAD2_CONF_FILE ou l'option --ROAD2_CONF_FILE lors de l'initialisation du serveur."

  Scenario: Argument inutile dans la ligne de commande 
    Given a valid configuration 
    And with "test" for command line parameter "ROAD2_TEST"
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "La vérification de la configuration est terminée"
    Then the server log should not contain error

  Scenario: [server.json] (application different)
    Given a valid configuration 
    And with parameter "test" for attribute "application" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs' absent"

  Scenario: [server.json] (application vide)
    Given a valid configuration 
    And with parameter "" for attribute "application" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application' absent"

  Scenario: [server.json] (application absent)
    Given a valid configuration 
    And without attribute "application" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application' absent"

  Scenario: [server.json] (application.logs different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.logs" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs.configuration' absent"

  Scenario: [server.json] (application.logs vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.logs" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs' absent"

  Scenario: [server.json] (application.logs absent)
    Given a valid configuration 
    And without attribute "application.logs" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs' absent"

  Scenario: [server.json] (application.logs.configuration different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: fichier de configuration des logs inexistant"

  Scenario: [server.json] (application.logs.configuration vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs.configuration' absent"

  Scenario: [server.json] (application.logs.configuration absent)
    Given a valid configuration 
    And without attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvais configuration: 'application.logs.configuration' absent"

  Scenario: [server.json] (application.logs.configuration sur un fichier non lisible)
    Given a valid configuration 
    And a file "file.json" non readable
    And with parameter "file.json" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs"

  Scenario: [server.json] (application.logs.configuration sur un fichier vide)
    Given a valid configuration 
    And a file "file.json" 
    And with parameter "file.json" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs"

  Scenario: [server.json] (application.logs.configuration sur un fichier incorrect)
    Given a valid configuration 
    And a wrong JSON file "file.json" 
    And with parameter "file.json" for attribute "application.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs"

  Scenario: [server.json] (name different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [server.json] (name vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1

  Scenario: [server.json] (name absent)
    Given a valid configuration 
    And without attribute "application.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1

  Scenario: [server.json] (title different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.title" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should not contain error

  Scenario: [server.json] (title vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.title" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:title' manquant !"

  Scenario: [server.json] (title absent)
    Given a valid configuration 
    And without attribute "application.title" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:title' manquant !"

  Scenario: [server.json] (description different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.description" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should not contain error

  Scenario: [server.json] (description vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.description" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:description' manquant !"

  Scenario: [server.json] (description absent)
    Given a valid configuration 
    And without attribute "application.description" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:description' manquant !"

  Scenario: [server.json] (provider different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.provider" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:name' manquant !"

  Scenario: [server.json] (provider vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.provider" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should not contain error
    Then the server log should contain "Configuration incomplete: Objet 'application:provider' manquant !"

  Scenario: [server.json] (provider absent)
    Given a valid configuration 
    And without attribute "application.provider" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should not contain error
    Then the server log should contain "Configuration incomplete: Objet 'application:provider' manquant !"
  
  Scenario: [server.json] (provider.name different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.provider.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should not contain error

  Scenario: [server.json] (provider.name vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.provider.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:name' manquant !"

  Scenario: [server.json] (provider.name absent)
    Given a valid configuration 
    And without attribute "application.provider.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:name' manquant !"

  Scenario: [server.json] (provider.site different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.provider.site" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should not contain error

  Scenario: [server.json] (provider.site vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.provider.site" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le champ 'application:provider:site' n'est pas renseigne."

  Scenario: [server.json] (provider.site absent)
    Given a valid configuration 
    And without attribute "application.provider.site" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le champ 'application:provider:site' n'est pas renseigne."

  Scenario: [server.json] (provider.mail different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.provider.mail" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should not contain error

  Scenario: [server.json] (provider.mail vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.provider.mail" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:mail' manquant !"

  Scenario: [server.json] (provider.mail absent)
    Given a valid configuration 
    And without attribute "application.provider.mail" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:mail' manquant !"

  Scenario: [server.json] (operations different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.operations" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:directory' manquant !"

  Scenario: [server.json] (operations vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.operations" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:operations' manquant !"

  Scenario: [server.json] (operations absent)
    Given a valid configuration 
    And without attribute "application.operations" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:operations' manquant !"

  Scenario: [server.json] (operations.directory sur un dossier qui n'existe pas)
    Given a valid configuration 
    And with parameter "test" for attribute "application.operations.directory" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Le dossier des operations n'existe pas"

  Scenario: [server.json] (operations.directory vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.operations.directory" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:directory' manquant !"

  Scenario: [server.json] (operations.directory absent)
    Given a valid configuration 
    And without attribute "application.operations.directory" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:directory' manquant !"

  # TODO 
  # Faire un scénario qui teste si les fichiers de operations.directory ne sont pas lisibles 

  Scenario: [server.json] (operations.parameters different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.operations.parameters" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:parameters:directory' manquant !"

  Scenario: [server.json] (operations.parameters vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.operations.parameters" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:operations:parameters' manquant !"

  Scenario: [server.json] (operations.parameters absent)
    Given a valid configuration 
    And without attribute "application.operations.parameters" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:operations:parameters' manquant !"

  Scenario: [server.json] (operations.parameters.directory sur un dossier qui n'existe pas)
    Given a valid configuration 
    And with parameter "test" for attribute "application.operations.parameters.directory" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Le dossier des parametres n'existe pas"

  Scenario: [server.json] (operations.parameters.directory vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.operations.parameters.directory" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:parameters:directory' manquant !"

  Scenario: [server.json] (operations.parameters.directory absent)
    Given a valid configuration 
    And without attribute "application.operations.parameters.directory" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:parameters:directory' manquant !"

  # TODO 
  # Faire un scénario qui teste si les fichiers de operations.parameters.directory ne sont pas lisibles 

  Scenario: [server.json] (resources different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.resources" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' manquant !"

  Scenario: [server.json] (resources vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.resources" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:resources' manquant !"

  Scenario: [server.json] (resources absent)
    Given a valid configuration 
    And without attribute "application.resources" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:resources' manquant !"

  Scenario: [server.json] (resources.directories est une chaine de caracteres)
    Given a valid configuration 
    And with parameter "test" for attribute "application.resources.directories" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' n'est pas un tableau !"

  # TODO 
  # Tester le paramètre resources.directories sur un tableau vide 

  Scenario: [server.json] (resources.directories sur un dossier qui n'existe pas et en chemin relatif)
    Given a valid configuration 
    And with parameter "test" for attribute "application.resources.directories.[0]" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Mauvaise configuration: Le dossier n'existe pas:"

    Scenario: [server.json] (resources.directories sur deux dossiers qui n'existent pas et en chemins relatifs)
    Given a valid configuration 
    And with parameter "test" for attribute "application.resources.directories.[0]" in server configuration
    And with parameter "test1" for attribute "application.resources.directories.[1]" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' ne pointe vers aucune ressource disponible !"

  Scenario: [server.json] (resources.directories contient un élément vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.resources.directories.[0]" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' contient un élément vide"

  Scenario: [server.json] (resources.directories contient que des éléments vides)
    Given a valid configuration 
    And with parameter "" for attribute "application.resources.directories.[0]" in server configuration
    And with parameter "" for attribute "application.resources.directories.[1]" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' ne pointe vers aucune ressource disponible !"

  Scenario: [server.json] (resources.directories absent)
    Given a valid configuration 
    And without attribute "application.resources.directories" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' manquant !"

  # TODO 
  # Tester un dossier de ressources dont une des ressources ne peut être lues 

  Scenario: [server.json] (network different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network:servers' manquant !"

  Scenario: [server.json] (network vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network' manquant !"

  Scenario: [server.json] (network absent)
    Given a valid configuration 
    And without attribute "application.network" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network' manquant !"

  Scenario: [server.json] (network.servers different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network:servers' n'est pas un tableau !"

  Scenario: [server.json] (network.servers vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.servers" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network:servers' manquant !"

  Scenario: [server.json] (network.servers absent)
    Given a valid configuration 
    And without attribute "application.network.servers" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network:servers' manquant !"

  # TODO: tester le tableau vide pour network.servers

  Scenario: [server.json] (network.servers contient une chaîne de caractères)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0]" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration d'un serveur !"

  Scenario: [server.json] (network.servers contient que des chaînes de caractères)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0]" in server configuration
    And with parameter "test" for attribute "application.network.servers.[1]" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration d'un serveur !"

  Scenario: [server.json] (serveur http avec id different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0].id" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should not contain error

  Scenario: [server.json] (serveur http sans id)
    Given a valid configuration 
    And without attribute "application.network.servers.[0].id" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration du serveur n'indique aucun id"

  Scenario: [server.json] (serveur http avec un mauvais https)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0].https" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre https est mal renseigné. Valeurs disponibles: 'true' ou 'false'."
  
  Scenario: [server.json] (serveur http sans https)
    Given a valid configuration 
    And without attribute "application.network.servers.[0].https" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration du serveur n'indique pas la securisation du serveur"

  Scenario: [server.json] (serveur http avec un mauvais host)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0].host" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'host du serveur est mal renseigne."

  Scenario: [server.json] (serveur http avec un autre host)
    Given a valid configuration 
    And with parameter "127.0.0.1" for attribute "application.network.servers.[0].host" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [server.json] (serveur http sans host)
    Given a valid configuration 
    And without attribute "application.network.servers.[0].host" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration du serveur n'indique aucun host"

  Scenario: [server.json] (serveur http avec un mauvais port)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0].port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le port est mal renseigne."

  Scenario: [server.json] (serveur http avec un port trop eleve)
    Given a valid configuration 
    And with parameter "65537" for attribute "application.network.servers.[0].port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le port est mal renseigne: Numero de port invalide"

  Scenario: [server.json] (serveur http avec un autre port)
    Given a valid configuration 
    And with parameter "8888" for attribute "application.network.servers.[0].port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [server.json] (serveur http sans port)
    Given a valid configuration 
    And without attribute "application.network.servers.[0].port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration du serveur n'indique aucun port"

 Scenario: [server.json] (serveur https avec un mauvais port)
    Given a valid configuration 
    And with parameter "445" for attribute "application.network.servers.[1].port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le port est different de 443 pour un serveur HTTPS"

  Scenario: [server.json] (serveur https sans options)
    Given a valid configuration 
    And without attribute "application.network.servers.[1].options" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Serveur https sans options."
  
  Scenario: [server.json] (server https avec options vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.servers.[1].options" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Serveur https sans options."

  Scenario: [server.json] (serveur https avec un mauvais options)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[1].options" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'objet options doit contenir un key pour le HTTPS."

  Scenario: [server.json] (server https avec options.key vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.servers.[1].options.key" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'objet options doit contenir un key pour le HTTPS."

  Scenario: [server.json] (serveur https avec un mauvais options.key)
    Given a valid configuration 
    And with parameter "test.key" for attribute "application.network.servers.[1].options.key" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le fichier ne peut etre lu"

  Scenario: [server.json] (server https avec options.cert vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.servers.[1].options.cert" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'objet options doit contenir un cert pour le HTTPS."

  Scenario: [server.json] (serveur https avec un mauvais options.cert)
    Given a valid configuration 
    And with parameter "test.cert" for attribute "application.network.servers.[1].options.cert" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le fichier ne peut etre lu"

  Scenario: [server.json] (network.cors absent)
    Given a valid configuration 
    And without attribute "application.network.cors" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Configuration incomplete: Objet 'application:network:cors' manquant !"

  Scenario: [server.json] (network.cors vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.cors" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Configuration incomplete: Objet 'application:network:cors' manquant !"

  Scenario: [server.json] (network.cors mauvais)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.cors" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:network:cors:configuration' manquant !"
    
  Scenario: [server.json] (network.cors.configuration vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.cors.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:network:cors:configuration' manquant !"

  Scenario: [server.json] (network.cors.configuration mauvais)
    Given a valid configuration 
    And with parameter "test.json" for attribute "application.network.cors.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Fichier de cors inexistant"
    
  Scenario: [server.json] (application.network.cors.configuration sur un fichier incorrect)
    Given a valid configuration 
    And a wrong JSON file "file.json" 
    And with parameter "file.json" for attribute "application.network.cors.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de cors de Road2"

  Scenario: [server.json] (projections different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.projections" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:projections:directory' manquant !"

  Scenario: [server.json] (projections vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.projections" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:projections' manquant !"

  Scenario: [server.json] (projections absent)
    Given a valid configuration 
    And without attribute "application.projections" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:projections' manquant !"

  Scenario: [server.json] (projections.directory sur un dossier qui n'existe pas)
    Given a valid configuration 
    And with parameter "test" for attribute "application.projections.directory" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Dossier de projections inexistant"

  Scenario: [server.json] (projections.directory vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.projections.directory" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:projections:directory' manquant !"

  Scenario: [server.json] (projections.directory absent)
    Given a valid configuration 
    And without attribute "application.projections.directory" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:projections:directory' manquant !"

  # TODO 
  # Faire un scénario qui teste si les fichiers de projections.directory ne sont pas lisibles 

  Scenario: [log.json] (mainConf different)
    Given a valid configuration 
    And with parameter "test" for attribute "mainConf" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration des logs dans mainConf"

  Scenario: [log.json] (mainConf vide)
    Given a valid configuration 
    And with parameter "" for attribute "mainConf" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'mainConf' absent"

  Scenario: [log.json] (mainConf absent)
    Given a valid configuration 
    And without attribute "mainConf" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'mainConf' absent"

  Scenario: [log.json] (httpConf different)
    Given a valid configuration 
    And with parameter "test" for attribute "httpConf" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.level' absent"

  Scenario: [log.json] (httpConf vide)
    Given a valid configuration 
    And with parameter "" for attribute "httpConf" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf' absent"

  Scenario: [log.json] (httpConf absent)
    Given a valid configuration 
    And without attribute "httpConf" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf' absent"

  Scenario: [log.json] (httpConf.level different)
    Given a valid configuration 
    And with parameter "test" for attribute "httpConf.level" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [log.json] (httpConf.level vide)
    Given a valid configuration 
    And with parameter "" for attribute "httpConf.level" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.level' absent"

  Scenario: [log.json] (httpConf.level absent)
    Given a valid configuration 
    And without attribute "httpConf.level" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.level' absent"

  Scenario: [log.json] (httpConf.format different)
    Given a valid configuration 
    And with parameter "test" for attribute "httpConf.format" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [log.json] (httpConf.format vide)
    Given a valid configuration 
    And with parameter "" for attribute "httpConf.format" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.format' absent"

  Scenario: [log.json] (httpConf.format absent)
    Given a valid configuration 
    And without attribute "httpConf.format" in log configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mausvaise configuration pour les logs: 'httpConf.format' absent"

  Scenario: [cors.json] Contenu different
    Given a valid configuration 
    And with parameter "127.0.0.1" for attribute "origin" in cors configuration
    And with parameter "GET,POST" for attribute "methods" in cors configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    And the server log should not contain error

  Scenario: [cors.json] Contenu mauvais
    Given a valid configuration 
    And with parameter "TEST" for attribute "methods" in cors configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    And the server log should not contain error

