# Documentation développeurs pour Road2

Cette documentation présente les concepts utiles pour comprendre le code et la démarche proposée pour participer aux développements de cet outils. 

## Présentation de Road2

D'un point de vue développeur, *Road2 est un service web écrit en Javascript et conçu pour fonctionner avec NodeJS*. Il propose le calcul d'itinéraires via des moteurs existants et peut donc être considéré comme une interfaces pour moteurs de calculs d'itinéraires. Ainsi, les calculs ne sont pas fait dans le code mais via l'appel à des librairies.

De plus, Road2 a été codé pour qu'il soit facile d'ajouter des nouvelles APIs d'accès ou des nouveaux moteurs de calcul.

## Les concepts utiles au développeurs 

## Participer aux développements 

### GIT 

La gestion des branches et des versions est détaillée [ici](./version.md). 

## Outils pour le développement

### Sonakube 

#### Avec docker

Il est possible d'analyser régulièrement le code avec Sonarkube. On pourra utiliser les containers proposés par Sonarqube. 

La commande suivante lance un serveur Sonarqube qui permettra de visualiser les résultats:

```
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```

Une fois lancée, il y a un serveur disponible http://localhost:9000. Il faut s'y connecter pour créer un projet qui s'appelle `road2` et générer un token. Le nom du projet est important. Si un autre est choisi, il faut modifier le fichier `./sonar-project.properties`. 

La commande suivante permet de lancer l'analyse sur le code:

```
docker run --rm -e SONAR_HOST_URL="http://${SONARQUBE_URL}" -e SONAR_LOGIN="myAuthenticationToken" -v "${YOUR_REPO}:/usr/src" sonarsource/sonar-scanner-cli
```

#### Avec une autre installation

Il est possible d'utiliser un serveur Sonarkube tiers et d'y charger les données d'analyse via le binaire de Sonarqube. 

#### Sonarlint 

Pour une analyse continue lors des développements, il est possible d'installer l'extension Sonarlint dans certains IDE. 

