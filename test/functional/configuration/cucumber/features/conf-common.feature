# Tests fonctionnels de Road2 sur la configuration du serveur 
Feature: Road2 configuration
  Tests fonctionnels de Road2 sur la configuration du serveur 

  Background:
      Given I have loaded all my test configuration

  Scenario: Configuration correcte
    Given a valid configuration 
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error
    Then the server log should contain "La vérification des différentes configurations est terminée"
    Then the server log should not contain "[ERROR]"

  Scenario: Mauvais argument de la ligne de commande (valeur vide)
    Given a valid configuration 
    And with "" for command line parameter "ROAD2_CONF_FILE"
    When I test the configuration
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Impossible de recuperer le chemin absolu du fichier de configuration"

  Scenario: Mauvais argument de la ligne de commande (fichier qui n'existe pas)
    Given a valid configuration 
    And with "test1" for command line parameter "ROAD2_CONF_FILE"
    When I test the configuration
    Then the configuration analysis should give an exit code 11
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
    Then the configuration analysis should give an exit code 11
    Then the server log should contain "Aucun fichier de configuration. Utiliser la variable d'environnement $ROAD2_CONF_FILE ou l'option --ROAD2_CONF_FILE lors de l'initialisation du serveur."

  Scenario: Argument inutile dans la ligne de commande 
    Given a valid configuration 
    And with "test" for command line parameter "ROAD2_TEST"
    When I test the configuration
    Then the configuration analysis should give an exit code 0
    Then the command log should not contain error
    Then the server log should contain "La vérification des différentes configurations est terminée"
