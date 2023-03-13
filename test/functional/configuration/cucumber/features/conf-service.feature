# Tests fonctionnels de Road2 sur la configuration du service
Feature: Road2 service configuration
  Tests fonctionnels de Road2 sur la configuration du service

  Background:
      Given I have loaded all my test configuration

  Scenario: [service.json] (application different)
    Given a valid configuration 
    And with parameter "test" for attribute "application" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:name' manquant"

  Scenario: [service.json] (application vide)
    Given a valid configuration 
    And with parameter "" for attribute "application" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application' manquant"

  Scenario: [service.json] (application absent)
    Given a valid configuration 
    And without attribute "application" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application' manquant"

  Scenario: [service.json] (application.logs different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.logs" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application.logs.configuration' manquant"

  Scenario: [service.json] (application.logs vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.logs" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application.logs' manquant"

  Scenario: [service.json] (application.logs absent)
    Given a valid configuration 
    And without attribute "application.logs" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application.logs' manquant"

  Scenario: [service.json] (application.logs.configuration different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.logs.configuration" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Fichier de conf des logs inexistant"

  Scenario: [service.json] (application.logs.configuration vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.logs.configuration" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application.logs.configuration' manquant"

  Scenario: [service.json] (application.logs.configuration absent)
    Given a valid configuration 
    And without attribute "application.logs.configuration" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application.logs.configuration' manquant"

  Scenario: [service.json] (application.logs.configuration sur un fichier non lisible)
    Given a valid configuration 
    And a file "file.json" non readable
    And with parameter "file.json" for attribute "application.logs.configuration" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de conf des logs du service"

  Scenario: [service.json] (application.logs.configuration sur un fichier vide)
    Given a valid configuration 
    And a file "file.json" 
    And with parameter "file.json" for attribute "application.logs.configuration" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de conf des logs du service"

  Scenario: [service.json] (application.logs.configuration sur un fichier incorrect)
    Given a valid configuration 
    And a wrong JSON file "file.json" 
    And with parameter "file.json" for attribute "application.logs.configuration" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de conf des logs du service"
    
  Scenario: [service.json] (name different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.name" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [service.json] (name vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.name" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1

  Scenario: [service.json] (name absent)
    Given a valid configuration 
    And without attribute "application.name" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1

  Scenario: [service.json] (title different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.title" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error

  Scenario: [service.json] (title vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.title" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:title' manquant !"

  Scenario: [service.json] (title absent)
    Given a valid configuration 
    And without attribute "application.title" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:title' manquant !"

  Scenario: [service.json] (description different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.description" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error

  Scenario: [service.json] (description vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.description" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:description' manquant !"

  Scenario: [service.json] (description absent)
    Given a valid configuration 
    And without attribute "application.description" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:description' manquant !"

  Scenario: [service.json] (provider different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.provider" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:name' manquant !"

  Scenario: [service.json] (provider vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.provider" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error
    Then the server log should contain "Configuration incomplete: Objet 'application:provider' manquant !"

  Scenario: [service.json] (provider absent)
    Given a valid configuration 
    And without attribute "application.provider" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error
    Then the server log should contain "Configuration incomplete: Objet 'application:provider' manquant !"
  
  Scenario: [service.json] (provider.name different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.provider.name" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error

  Scenario: [service.json] (provider.name vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.provider.name" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:name' manquant !"

  Scenario: [service.json] (provider.name absent)
    Given a valid configuration 
    And without attribute "application.provider.name" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:name' manquant !"

  Scenario: [service.json] (provider.site different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.provider.site" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error

  Scenario: [service.json] (provider.site vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.provider.site" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le champ 'application:provider:site' n'est pas renseigne."

  Scenario: [service.json] (provider.site absent)
    Given a valid configuration 
    And without attribute "application.provider.site" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le champ 'application:provider:site' n'est pas renseigne."

  Scenario: [service.json] (provider.mail different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.provider.mail" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error

  Scenario: [service.json] (provider.mail vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.provider.mail" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:mail' manquant !"

  Scenario: [service.json] (provider.mail absent)
    Given a valid configuration 
    And without attribute "application.provider.mail" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:provider:mail' manquant !"

  Scenario: [service.json] (operations different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.operations" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:directory' manquant !"

  Scenario: [service.json] (operations vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.operations" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:operations' manquant !"

  Scenario: [service.json] (operations absent)
    Given a valid configuration 
    And without attribute "application.operations" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:operations' manquant !"

  Scenario: [service.json] (operations.directory sur un dossier qui n'existe pas)
    Given a valid configuration 
    And with parameter "test" for attribute "application.operations.directory" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le dossier des operations est mal configuré"

  Scenario: [service.json] (operations.directory vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.operations.directory" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:directory' manquant !"

  Scenario: [service.json] (operations.directory absent)
    Given a valid configuration 
    And without attribute "application.operations.directory" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:directory' manquant !"

  # TODO 
  # Faire un scénario qui teste si les fichiers de operations.directory ne sont pas lisibles 

  Scenario: [service.json] (operations.parameters different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.operations.parameters" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:parameters:directory' manquant !"

  Scenario: [service.json] (operations.parameters vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.operations.parameters" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:operations:parameters' manquant !"

  Scenario: [service.json] (operations.parameters absent)
    Given a valid configuration 
    And without attribute "application.operations.parameters" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:operations:parameters' manquant !"

  Scenario: [service.json] (operations.parameters.directory sur un dossier qui n'existe pas)
    Given a valid configuration 
    And with parameter "test" for attribute "application.operations.parameters.directory" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Le dossier des parametres n'existe pas"

  Scenario: [service.json] (operations.parameters.directory vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.operations.parameters.directory" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:parameters:directory' manquant !"

  Scenario: [service.json] (operations.parameters.directory absent)
    Given a valid configuration 
    And without attribute "application.operations.parameters.directory" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:operations:parameters:directory' manquant !"

  # TODO 
  # Faire un scénario qui teste si les fichiers de operations.parameters.directory ne sont pas lisibles 

  Scenario: [service.json] (resources different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.resources" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' manquant !"

  Scenario: [service.json] (resources vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.resources" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:resources' manquant !"

  Scenario: [service.json] (resources absent)
    Given a valid configuration 
    And without attribute "application.resources" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:resources' manquant !"

  Scenario: [service.json] (resources.directories est une chaine de caracteres)
    Given a valid configuration 
    And with parameter "test" for attribute "application.resources.directories" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' n'est pas un tableau !"

  # TODO 
  # Tester le paramètre resources.directories sur un tableau vide 

  Scenario: [service.json] (resources.directories sur un dossier qui n'existe pas et en chemin relatif)
    Given a valid configuration 
    And with parameter "test" for attribute "application.resources.directories.[1]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Mauvaise configuration: Le dossier n'existe pas:"

    Scenario: [service.json] (resources.directories sur deux dossiers qui n'existent pas et en chemins relatifs)
    Given a valid configuration 
    And with parameter "test" for attribute "application.resources.directories.[0]" in service configuration
    And with parameter "test1" for attribute "application.resources.directories.[1]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Le dossier n'existe pas"

  Scenario: [service.json] (resources.directories contient un élément vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.resources.directories.[1]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' contient un élément vide"

  Scenario: [service.json] (resources.directories contient que des éléments vides)
    Given a valid configuration 
    And with parameter "" for attribute "application.resources.directories.[0]" in service configuration
    And with parameter "" for attribute "application.resources.directories.[1]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Aucun dossier de ressource n'a été validé"

  Scenario: [service.json] (resources.directories absent)
    Given a valid configuration 
    And without attribute "application.resources.directories" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:resources:directories' manquant !"

  Scenario: [service.json] (resources.directories sans aucune resource)
    Given a valid configuration 
    And an empty directory "empty_resource"
    And with parameter "empty_resource" for attribute "application.resources.directories.[0]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le dossier des resources est vide"

  # TODO 
  # Tester un dossier de ressources dont une des ressources ne peut être lues 

  Scenario: [service.json] (sources different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.sources" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:sources:directories' manquant !"

  Scenario: [service.json] (sources vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.sources" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:sources' manquant !"

  Scenario: [service.json] (sources absent)
    Given a valid configuration 
    And without attribute "application.sources" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:sources' manquant !"

  Scenario: [service.json] (sources.directories est une chaine de caracteres)
    Given a valid configuration 
    And with parameter "test" for attribute "application.sources.directories" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:sources:directories' n'est pas un tableau !"

  # TODO 
  # Tester le paramètre sources.directories sur un tableau vide 

  Scenario: [service.json] (sources.directories sur un dossier qui n'existe pas et en chemin relatif)
    Given a valid configuration 
    And with parameter "test" for attribute "application.sources.directories.[1]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Mauvaise configuration: Le dossier n'existe pas:"

    Scenario: [service.json] (sources.directories sur deux dossiers qui n'existent pas et en chemins relatifs)
    Given a valid configuration 
    And with parameter "test" for attribute "application.sources.directories.[0]" in service configuration
    And with parameter "test1" for attribute "application.sources.directories.[1]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Le dossier n'existe pas"

  Scenario: [service.json] (sources.directories contient un élément vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.sources.directories.[1]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Mauvaise configuration: Champ 'application:sources:directories' contient un élément vide"

  Scenario: [service.json] (sources.directories contient que des éléments vides)
    Given a valid configuration 
    And with parameter "" for attribute "application.sources.directories.[0]" in service configuration
    And with parameter "" for attribute "application.sources.directories.[1]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Aucun dossier de source n'a été validé"

  Scenario: [service.json] (sources.directories absent)
    Given a valid configuration 
    And without attribute "application.sources.directories" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:sources:directories' manquant !"

  Scenario: [service.json] (sources.directories sans aucune sources)
    Given a valid configuration 
    And an empty directory "empty_sources"
    And with parameter "empty_sources" for attribute "application.sources.directories.[0]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Le dossier des sources est vide"

  # TODO 
  # Tester un dossier de ressources dont une des ressources ne peut être lues 

  Scenario: [service.json] (network different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network:servers' manquant !"

  Scenario: [service.json] (network vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network' manquant !"

  Scenario: [service.json] (network absent)
    Given a valid configuration 
    And without attribute "application.network" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network' manquant !"

  Scenario: [service.json] (network.servers different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network:servers' n'est pas un tableau !"

  Scenario: [service.json] (network.servers vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.servers" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network:servers' manquant !"

  Scenario: [service.json] (network.servers absent)
    Given a valid configuration 
    And without attribute "application.network.servers" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:network:servers' manquant !"

  # TODO: tester le tableau vide pour network.servers

  Scenario: [service.json] (network.servers contient une chaîne de caractères)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration d'un serveur !"

  Scenario: [service.json] (network.servers contient que des chaînes de caractères)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0]" in service configuration
    And with parameter "test" for attribute "application.network.servers.[1]" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration d'un serveur !"

  Scenario: [service.json] (serveur http avec id different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0].id" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error

  Scenario: [service.json] (serveur http sans id)
    Given a valid configuration 
    And without attribute "application.network.servers.[0].id" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration du serveur n'indique aucun id"

  Scenario: [service.json] (serveur http avec un mauvais https)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0].https" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le parametre https est mal renseigné. Valeurs disponibles: 'true' ou 'false'."
  
  Scenario: [service.json] (serveur http sans https)
    Given a valid configuration 
    And without attribute "application.network.servers.[0].https" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration du serveur n'indique pas la securisation du serveur"

  Scenario: [service.json] (serveur http avec un mauvais host)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0].host" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'host du serveur est mal renseigne."

  Scenario: [service.json] (serveur http avec un autre host)
    Given a valid configuration 
    And with parameter "127.0.0.1" for attribute "application.network.servers.[0].host" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [service.json] (serveur http sans host)
    Given a valid configuration 
    And without attribute "application.network.servers.[0].host" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration du serveur n'indique aucun host"

  Scenario: [service.json] (serveur http avec un mauvais port)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[0].port" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le port est mal renseigne."

  Scenario: [service.json] (serveur http avec un port trop eleve)
    Given a valid configuration 
    And with parameter "65537" for attribute "application.network.servers.[0].port" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le port est mal renseigne: Numero de port invalide"

  Scenario: [service.json] (serveur http avec un autre port)
    Given a valid configuration 
    And with parameter "8888" for attribute "application.network.servers.[0].port" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [service.json] (serveur http sans port)
    Given a valid configuration 
    And without attribute "application.network.servers.[0].port" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "La configuration du serveur n'indique aucun port"

 Scenario: [service.json] (serveur https avec un port different)
    Given a valid configuration 
    And with parameter "445" for attribute "application.network.servers.[1].port" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [service.json] (serveur https sans options)
    Given a valid configuration 
    And without attribute "application.network.servers.[1].options" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Serveur https sans options."
  
  Scenario: [service.json] (server https avec options vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.servers.[1].options" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Serveur https sans options."

  Scenario: [service.json] (serveur https avec un mauvais options)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.servers.[1].options" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'objet options doit contenir un key pour le HTTPS."

  Scenario: [service.json] (server https avec options.key vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.servers.[1].options.key" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'objet options doit contenir un key pour le HTTPS."

  Scenario: [service.json] (serveur https avec un mauvais options.key)
    Given a valid configuration 
    And with parameter "test.key" for attribute "application.network.servers.[1].options.key" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le fichier ne peut etre lu"

  Scenario: [service.json] (server https avec options.cert vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.servers.[1].options.cert" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "L'objet options doit contenir un cert pour le HTTPS."

  Scenario: [service.json] (serveur https avec un mauvais options.cert)
    Given a valid configuration 
    And with parameter "test.cert" for attribute "application.network.servers.[1].options.cert" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Le fichier ne peut etre lu"

  Scenario: [service.json] (network.cors absent)
    Given a valid configuration 
    And without attribute "application.network.cors" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Configuration incomplete: Objet 'application:network:cors' manquant !"

  Scenario: [service.json] (network.cors vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.cors" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the server log should contain "Configuration incomplete: Objet 'application:network:cors' manquant !"

  Scenario: [service.json] (network.cors mauvais)
    Given a valid configuration 
    And with parameter "test" for attribute "application.network.cors" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:network:cors:configuration' manquant !"
    
  Scenario: [service.json] (network.cors.configuration vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.network.cors.configuration" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:network:cors:configuration' manquant !"

  Scenario: [service.json] (network.cors.configuration mauvais)
    Given a valid configuration 
    And with parameter "test.json" for attribute "application.network.cors.configuration" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Fichier de cors inexistant"
    
  Scenario: [service.json] (application.network.cors.configuration sur un fichier incorrect)
    Given a valid configuration 
    And a wrong JSON file "file.json" 
    And with parameter "file.json" for attribute "application.network.cors.configuration" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de cors de Road2"

  Scenario: [service.json] (projections different)
    Given a valid configuration 
    And with parameter "test" for attribute "application.projections" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:projections:directory' manquant !"

  Scenario: [service.json] (projections vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.projections" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:projections' manquant !"

  Scenario: [service.json] (projections absent)
    Given a valid configuration 
    And without attribute "application.projections" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Objet 'application:projections' manquant !"

  Scenario: [service.json] (projections.directory sur un dossier qui n'existe pas)
    Given a valid configuration 
    And with parameter "test" for attribute "application.projections.directory" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Dossier de projections inexistant"

  Scenario: [service.json] (projections.directory vide)
    Given a valid configuration 
    And with parameter "" for attribute "application.projections.directory" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:projections:directory' manquant !"

  Scenario: [service.json] (projections.directory absent)
    Given a valid configuration 
    And without attribute "application.projections.directory" in service configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 1
    Then the server log should contain "Mauvaise configuration: Champ 'application:projections:directory' manquant !"

  # TODO 
  # Faire un scénario qui teste si les fichiers de projections.directory ne sont pas lisibles 
