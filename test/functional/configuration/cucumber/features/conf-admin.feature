# Tests fonctionnels de Road2 sur la configuration du serveur admin
Feature: Road2 Admin configuration
  Tests fonctionnels de Road2 sur la configuration du serveur admin

  Background:
      Given I have loaded all my test configuration

  Scenario: [server.json] administration différent
    Given a valid configuration 
    And with parameter "test" for attribute "administration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.logs' absent"

  Scenario: [server.json] administration vide
    Given a valid configuration 
    And with parameter "" for attribute "administration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration' absent"

  Scenario: [server.json] administration absent
    Given a valid configuration 
    And without attribute "administration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration' absent"

  Scenario: [server.json] administration.logs différent
    Given a valid configuration 
    And with parameter "test" for attribute "administration.logs" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.logs.configuration' absent"

  Scenario: [server.json] administration.logs vide
    Given a valid configuration 
    And with parameter "" for attribute "administration.logs" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.logs' absent"

  Scenario: [server.json] administration.logs absent
    Given a valid configuration 
    And without attribute "administration.logs" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.logs' absent"

  Scenario: [server.json] administration.logs.configuration avec un fichier qui n'existe pas
    Given a valid configuration 
    And with parameter "test" for attribute "administration.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: fichier de configuration des logs inexistant"

  Scenario: [server.json] administration.logs.configuration sur un fichier non lisible
    Given a valid configuration 
    And a file "file.json" non readable
    And with parameter "file.json" for attribute "administration.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs"

  Scenario: [server.json] administration.logs.configuration sur un fichier vide
    Given a valid configuration 
    And a file "file.json" 
    And with parameter "file.json" for attribute "administration.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs"

  Scenario: [server.json] administration.logs.configuration sur un fichier incorrect
    Given a valid configuration 
    And a wrong JSON file "file.json" 
    And with parameter "file.json" for attribute "administration.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs"
    
  Scenario: [server.json] administration.logs.configuration vide
    Given a valid configuration 
    And with parameter "" for attribute "administration.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.logs.configuration' absent"

  Scenario: [server.json] administration.logs.configuration absent
    Given a valid configuration 
    And without attribute "administration.logs.configuration" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.logs.configuration' absent"

  Scenario: [server.json] network different
    Given a valid configuration 
    And with parameter "test" for attribute "administration.network" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.network.server' absent"

  Scenario: [server.json] network vide
    Given a valid configuration 
    And with parameter "" for attribute "administration.network" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.network' absent"

  Scenario: [server.json] network absent
    Given a valid configuration 
    And without attribute "administration.network" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.network' absent"

  Scenario: [server.json] network.server different
    Given a valid configuration 
    And with parameter "test" for attribute "administration.network.server" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "La configuration du serveur n'indique aucun id"

  Scenario: [server.json] network.server vide
    Given a valid configuration 
    And with parameter "" for attribute "administration.network.server" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.network.server' absent"

  Scenario: [server.json] network.server absent
    Given a valid configuration 
    And without attribute "administration.network.server" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.network.server' absent"

  Scenario: [server.json] serveur http avec id different
    Given a valid configuration 
    And with parameter "test" for attribute "administration.network.server.id" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error

  Scenario: [server.json] serveur http sans id
    Given a valid configuration 
    And without attribute "administration.network.server.id" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "La configuration du serveur n'indique aucun id"

  Scenario: [server.json] serveur http avec un mauvais https
    Given a valid configuration 
    And with parameter "test" for attribute "administration.network.server.https" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Le parametre https est mal renseigné. Valeurs disponibles: 'true' ou 'false'."
  
  Scenario: [server.json] serveur http sans https
    Given a valid configuration 
    And without attribute "administration.network.server.https" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "La configuration du serveur n'indique pas la securisation du serveur"

  Scenario: [server.json] serveur http avec un mauvais host
    Given a valid configuration 
    And with parameter "test" for attribute "administration.network.server.host" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "L'host du serveur est mal renseigne."

  Scenario: [server.json] serveur http avec un autre host
    Given a valid configuration 
    And with parameter "127.0.0.1" for attribute "administration.network.server.host" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [server.json] serveur http sans host
    Given a valid configuration 
    And without attribute "administration.network.server.host" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "La configuration du serveur n'indique aucun host"

  Scenario: [server.json] serveur http avec un mauvais port
    Given a valid configuration 
    And with parameter "test" for attribute "administration.network.server.port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Le port est mal renseigne."

  Scenario: [server.json] serveur http avec un port trop eleve
    Given a valid configuration 
    And with parameter "65537" for attribute "administration.network.server.port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Le port est mal renseigne: Numero de port invalide"

  Scenario: [server.json] serveur http avec un autre port
    Given a valid configuration 
    And with parameter "8888" for attribute "administration.network.server.port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0
  
  Scenario: [server.json] serveur http sans port
    Given a valid configuration 
    And without attribute "administration.network.server.port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "La configuration du serveur n'indique aucun port"

  Scenario: [server.json] serveur https bien configuré
    Given a valid configuration
    And with parameter "true" for attribute "administration.network.server.https" in server configuration 
    And with parameter "/run/secrets/key" for attribute "administration.network.server.options.key" in server configuration
    And with parameter "/run/secrets/cert" for attribute "administration.network.server.options.cert" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

 Scenario: [server.json] serveur https avec un port different
    Given a valid configuration 
    And with parameter "true" for attribute "administration.network.server.https" in server configuration
    And with parameter "/run/secrets/cert" for attribute "administration.network.server.options.cert" in server configuration
    And with parameter "/run/secrets/key" for attribute "administration.network.server.options.key" in server configuration 
    And with parameter "445" for attribute "administration.network.server.port" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 0

  Scenario: [server.json] serveur https sans options
    Given a valid configuration
    And with parameter "true" for attribute "administration.network.server.https" in server configuration 
    And without attribute "administration.network.server.options" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Serveur https sans options."
  
  Scenario: [server.json] serveur https avec options vide
    Given a valid configuration 
    And with parameter "true" for attribute "administration.network.server.https" in server configuration 
    And with parameter "" for attribute "administration.network.server.options" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Serveur https sans options."

  Scenario: [server.json] serveur https avec un mauvais options
    Given a valid configuration
    And with parameter "true" for attribute "administration.network.server.https" in server configuration 
    And with parameter "test" for attribute "administration.network.server.options" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "L'objet options doit contenir un key pour le HTTPS."

  Scenario: [server.json] serveur https avec options.key vide
    Given a valid configuration
    And with parameter "true" for attribute "administration.network.server.https" in server configuration 
    And with parameter "" for attribute "administration.network.server.options.key" in server configuration
    And with parameter "/run/secrets/cert" for attribute "administration.network.server.options.cert" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "L'objet options doit contenir un key pour le HTTPS."

  Scenario: [server.json] serveur https avec un mauvais options.key
    Given a valid configuration
    And with parameter "true" for attribute "administration.network.server.https" in server configuration 
    And with parameter "test.key" for attribute "administration.network.server.options.key" in server configuration
    And with parameter "/run/secrets/cert" for attribute "administration.network.server.options.cert" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Le fichier ne peut etre lu"

  Scenario: [server.json] serveur https avec options.cert vide
    Given a valid configuration
    And with parameter "true" for attribute "administration.network.server.https" in server configuration 
    And with parameter "" for attribute "administration.network.server.options.cert" in server configuration
    And with parameter "/run/secrets/key" for attribute "administration.network.server.options.key" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "L'objet options doit contenir un cert pour le HTTPS"

  Scenario: [server.json] serveur https avec un mauvais options.cert
    Given a valid configuration
    And with parameter "true" for attribute "administration.network.server.https" in server configuration 
    And with parameter "/run/secrets/key" for attribute "administration.network.server.options.key" in server configuration
    And with parameter "test.cert" for attribute "administration.network.server.options.cert" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Le fichier ne peut etre lu"


  Scenario: [server.json] administration.api différent
    Given a valid configuration 
    And with parameter "test" for attribute "administration.api" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration de l'api: 'name' absent"

  Scenario: [server.json] administration.api vide
    Given a valid configuration 
    And with parameter "" for attribute "administration.api" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.api' absent"

  Scenario: [server.json] administration.api absent
    Given a valid configuration 
    And without attribute "administration.api" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'administration.api' absent"

  Scenario: [server.json] administration.api.name différent
    Given a valid configuration 
    And with parameter "test" for attribute "administration.api.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration: 'name' ne peut être évalué"

  Scenario: [server.json] administration.api.name vide
    Given a valid configuration 
    And with parameter "" for attribute "administration.api.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration de l'api: 'name' absent"

  Scenario: [server.json] administration.api.name absent
    Given a valid configuration 
    And without attribute "administration.api.name" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration de l'api: 'name' absent"

  Scenario: [server.json] administration.api.version différent
    Given a valid configuration 
    And with parameter "test" for attribute "administration.api.version" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration de l'api: 'version' ne peut être évalué"

  Scenario: [server.json] administration.api.version vide
    Given a valid configuration 
    And with parameter "" for attribute "administration.api.version" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration de l'api: 'version' absent"

  Scenario: [server.json] administration.api.version absent
    Given a valid configuration 
    And without attribute "administration.api.version" in server configuration
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Mauvaise configuration de l'api: 'version' absent"
