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
    And with parameter "" for attribute "application.resources.directories.[1]" in server configuration
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

 Scenario: [server.json] (serveur https avec un port different)
    Given a valid configuration 
    And with parameter "445" for attribute "application.network.servers.[1].port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

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

  Scenario: [projection.json] JSON invalide
    Given a valid configuration 
    And a wrong JSON file "./projections/test.json"
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de projection"

  Scenario: [projection.json] JSON vide
    Given a valid configuration 
    And without attribute "projectionsList" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration des projections ne contient pas de liste"

  Scenario: [projection.json] projectionsList absent
    Given a valid configuration 
    And without attribute "projectionsList" in "projection.json" projection
    And with parameter "test" for attribute "projections" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration des projections ne contient pas de liste"

  Scenario: [projection.json] projectionsList different
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'attribut projectionsList de la configuration n'est pas un tableau"

  Scenario: [projection.json] projectionsList est un tableau vide
    Given a valid configuration 
    And without attribute "projectionsList.[6]" in "projection.json" projection
    And without attribute "projectionsList.[5]" in "projection.json" projection
    And without attribute "projectionsList.[4]" in "projection.json" projection
    And without attribute "projectionsList.[3]" in "projection.json" projection
    And without attribute "projectionsList.[2]" in "projection.json" projection
    And without attribute "projectionsList.[1]" in "projection.json" projection
    And without attribute "projectionsList.[0]" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'attribut projectionsList de la configuration est un tableau vide"

  Scenario: [projection.json] une configuration de projection vide
    Given a valid configuration 
    And without attribute "projectionsList.[0].id" in "projection.json" projection
    And without attribute "projectionsList.[0].parameters" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas d'id"

  Scenario: [projection.json] une configuration de projection sans id
    Given a valid configuration 
    And without attribute "projectionsList.[0].id" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas d'id"

  Scenario: [projection.json] une configuration de projection sans parametre
    Given a valid configuration 
    And without attribute "projectionsList.[0].parameters" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas de parametres"

  Scenario: [projection.json] une configuration de projection différentes
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList.[0]" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas d'id"

  Scenario: [projection.json] projection.id différent pour une projection inutilisée dans les topologies
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList.[2].id" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [projection.json] projection.id différent pour une projection utilisée dans les topologies
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList.[0].id" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1

  Scenario: [projection.json] projection.id vide
    Given a valid configuration 
    And with parameter "" for attribute "projectionsList.[2].id" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas d'id"

  Scenario: [projection.json] projection.parameters différent
    Given a valid configuration 
    And with parameter "test" for attribute "projectionsList.[0].parameters" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Impossible de charger la projection dans proj4"

  Scenario: [projection.json] projection.parameters vide
    Given a valid configuration 
    And with parameter "" for attribute "projectionsList.[0].parameters" in "projection.json" projection
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration de la projection n'a pas de parametres"

  Scenario: [operations] id différent
    Given a valid configuration 
    And with parameter "test" for attribute "id" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation indiquee n'est pas disponible"

  Scenario: [operations] id vide
    Given a valid configuration 
    And with parameter "" for attribute "id" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'id"

  Scenario: [operations] id absent
    Given a valid configuration 
    And without attribute "id" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'id"

  Scenario: [operations] name différent
    Given a valid configuration 
    And with parameter "test" for attribute "name" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [operations] name vide
    Given a valid configuration 
    And with parameter "" for attribute "name" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut name"

  Scenario: [operations] name absent
    Given a valid configuration 
    And without attribute "name" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut name"

  Scenario: [operations] description différent
    Given a valid configuration 
    And with parameter "test" for attribute "description" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [operations] description vide
    Given a valid configuration 
    And with parameter "" for attribute "description" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut description"

  Scenario: [operations] description absent
    Given a valid configuration 
    And without attribute "description" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut description"

  Scenario: [operations] parameters différent
    Given a valid configuration 
    And with parameter "test" for attribute "parameters" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Les parametres de l'operation ne sont pas dans un tableau"

  Scenario: [operations] parameters vide
    Given a valid configuration 
    And with parameter "" for attribute "parameters" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut parameters"

  Scenario: [operations] parameters absent
    Given a valid configuration 
    And without attribute "parameters" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation ne contient pas d'attribut parameters"

  Scenario: [operations] parameters est un tableau vide
    Given a valid configuration 
    And without attribute "parameters.[13]" in "route.json" operation
    And without attribute "parameters.[12]" in "route.json" operation
    And without attribute "parameters.[11]" in "route.json" operation
    And without attribute "parameters.[10]" in "route.json" operation
    And without attribute "parameters.[9]" in "route.json" operation
    And without attribute "parameters.[8]" in "route.json" operation
    And without attribute "parameters.[7]" in "route.json" operation
    And without attribute "parameters.[6]" in "route.json" operation
    And without attribute "parameters.[5]" in "route.json" operation
    And without attribute "parameters.[4]" in "route.json" operation
    And without attribute "parameters.[3]" in "route.json" operation
    And without attribute "parameters.[2]" in "route.json" operation
    And without attribute "parameters.[1]" in "route.json" operation
    And without attribute "parameters.[0]" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le tableau des parametres est vide"

  Scenario: [operations] parameters est incomplet 
    Given a valid configuration 
    And without attribute "parameters.[0]" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le nombre de parametres presents n'est pas celui attendu"

  Scenario: [operations] parameters contient un element different 
    Given a valid configuration 
    And with parameter "test" for attribute "parameters.[0]" in "route.json" operation
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation précise un parametre qui n'est pas disponible"

  Scenario: [parameters] id différent
    Given a valid configuration 
    And with parameter "test" for attribute "id" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'operation précise un parametre qui n'est pas disponible: intermediates"

  Scenario: [parameters] id vide
    Given a valid configuration 
    And with parameter "" for attribute "id" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'id"

  Scenario: [parameters] id absent
    Given a valid configuration 
    And without attribute "id" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'id"

  Scenario: [parameters] id deja utilise
    Given a valid configuration 
    And with parameter "test" for attribute "id" in "start.json" parameter
    And with parameter "test" for attribute "id" in "end.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre contenant l'id test est deja reference"

  Scenario: [parameters] name différent
    Given a valid configuration 
    And with parameter "test" for attribute "name" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] name vide
    Given a valid configuration 
    And with parameter "" for attribute "name" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut name"

  Scenario: [parameters] name absent
    Given a valid configuration 
    And without attribute "name" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut name"

  Scenario: [parameters] description différent
    Given a valid configuration 
    And with parameter "test" for attribute "description" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] description vide
    Given a valid configuration 
    And with parameter "" for attribute "description" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut description"

  Scenario: [parameters] description absent
    Given a valid configuration 
    And without attribute "description" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut description"

  Scenario: [parameters] required différent
    Given a valid configuration 
    And with parameter "true" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

    Scenario: [parameters] required invalide
    Given a valid configuration 
    And with parameter "test" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre contient un attribut required mal configure"

  Scenario: [parameters] required vide
    Given a valid configuration 
    And with parameter "" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut required"

  Scenario: [parameters] required absent
    Given a valid configuration 
    And without attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut required"
  
  Scenario: [parameters] defaultValue différent (true donc probleme apres)
    Given a valid configuration 
    And with parameter "true" for attribute "defaultValue" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas de valeur par defaut alors qu'il doit en avoir un"

  Scenario: [parameters] defaultValue invalide
    Given a valid configuration 
    And with parameter "test" for attribute "defaultValue" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre contient un attribut defaultValue mal configure"

  Scenario: [parameters] defaultValue vide
    Given a valid configuration 
    And with parameter "" for attribute "defaultValue" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut defaultValue"

  Scenario: [parameters] defaultValue absent
    Given a valid configuration 
    And without attribute "defaultValue" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut defaultValue"
  
  Scenario: [parameters] example différent 
    Given a valid configuration 
    And with parameter "test" for attribute "example" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] example vide
    Given a valid configuration 
    And with parameter "" for attribute "example" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le parametre ne contient pas d'exemple"

  Scenario: [parameters] example absent
    Given a valid configuration 
    And without attribute "example" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le parametre ne contient pas d'exemple"

  Scenario: [parameters] type différent
    Given a valid configuration 
    And with parameter "boolean" for attribute "type" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La valeur du parametre est incorrecte par rapport à son type: boolean"

  Scenario: [parameters] type invalide
    Given a valid configuration 
    And with parameter "test" for attribute "type" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le type du parametre est incorrect"

  Scenario: [parameters] type vide
    Given a valid configuration 
    And with parameter "" for attribute "type" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut type"

  Scenario: [parameters] type absent
    Given a valid configuration 
    And without attribute "type" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre ne contient pas d'attribut type"
  
  Scenario: [parameters] min différent et required true
    Given a valid configuration 
    And with parameter "1" for attribute "min" in "intermediates.json" parameter
    And with parameter "true" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] min différent et required false
    Given a valid configuration 
    And with parameter "1" for attribute "min" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre min est incorrect: valeur superieure a 0"

  Scenario: [parameters] min a 0 et required true
    Given a valid configuration 
    And with parameter "0" for attribute "min" in "intermediates.json" parameter
    And with parameter "true" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre min est incorrect: valeur inferieure a 1"

  Scenario: [parameters] min invalide
    Given a valid configuration 
    And with parameter "test" for attribute "min" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre min est incorrect: valeur non entiere"

  Scenario: [parameters] min vide
    Given a valid configuration 
    And with parameter "" for attribute "min" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] min absent
    Given a valid configuration 
    And without attribute "min" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [parameters] max différent
    Given a valid configuration 
    And with parameter "1" for attribute "max" in "intermediates.json" parameter
    And with parameter "true" for attribute "required" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] max a 0 
    Given a valid configuration 
    And with parameter "0" for attribute "max" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre max est incorrect: valeur inferieure a 1"

  Scenario: [parameters] max invalide
    Given a valid configuration 
    And with parameter "test" for attribute "max" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre max est incorrect: valeur non entiere"

  Scenario: [parameters] max vide
    Given a valid configuration 
    And with parameter "" for attribute "max" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] max absent
    Given a valid configuration 
    And without attribute "max" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [parameters] max plus petit que min
    Given a valid configuration 
    And with parameter "1" for attribute "max" in "intermediates.json" parameter
    And with parameter "2" for attribute "min" in "intermediates.json" parameter
    And with parameter "true" for attribute "required" in "intermediates.json" parameter    
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre max est incorrect: valeur inferieure au parametre min"

  Scenario: [parameters] explode différent (true)
    Given a valid configuration 
    And with parameter "true" for attribute "explode" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] explode invalide
    Given a valid configuration 
    And with parameter "test" for attribute "explode" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre explode est incorrect"

  Scenario: [parameters] explode vide
    Given a valid configuration 
    And with parameter "" for attribute "explode" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [parameters] explode absent
    Given a valid configuration 
    And without attribute "explode" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [parameters] style invalide alors que explode false
    Given a valid configuration 
    And with parameter "test" for attribute "style" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre style est incorrect"

  Scenario: [parameters] style vide alors que explode false
    Given a valid configuration 
    And with parameter "" for attribute "style" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre style n'est pas present alors que explode=false"

  Scenario: [parameters] style vide alors que explode false
    Given a valid configuration 
    And without attribute "style" in "intermediates.json" parameter
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre style n'est pas present alors que explode=false"

  Scenario: [osrm resource] resource absent
    Given a valid configuration 
    And without attribute "resource" in "corse.resource" resource
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Erreur lors de la lecture de la ressource"

  Scenario: [osrm resource] id different
    Given a valid configuration 
    And with parameter "test" for attribute "resource.id" in "corse.resource" resource
    When I test the configuration
    Then the configuration analysis should give an exit code 0
