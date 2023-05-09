# Documentation développeurs pour Road2

## Présentation de Road2

D'un point de vue développeur, *Road2 est un service web écrit en Javascript et conçu pour fonctionner avec NodeJS*. Il propose divers calculs liés aux routes. On parlera d'itinéraires pour simplifier. Ces calculs sont réalisés via des moteurs qui ne sont pas codés dans Road2. Ce dernier peut donc être considéré comme une interfaces pour moteurs de calculs d'itinéraires. Ainsi, les calculs ne sont pas fait dans le code mais via l'appel à des librairies.

De plus, Road2 a été codé pour qu'il soit facile d'ajouter des nouvelles APIs d'accès ou des nouveaux moteurs de calcul.

## Les concepts utiles au développeurs 

Plusieurs concepts ont été utilisés lors des développements. Afin de mieux les cerner et ainsi mieux comprendre le code, une lecture des [concepts](./concepts.md) est conseillée. 

## Les fonctionnalités de Road2 

L'ensemble des fonctionnalités sont répertoriées à [part](./functionnalities.md) afin de faciliter la visibilité. 

## Participer aux développements 

Les participations à ce projet sont encouragées. L'ajout de moteurs ou d'API, bien évidemment. Mais toutes autres fonctionnalités sont les bienvenues. Encore, une fois, il vous est demandé de réaliser vos développements en partant de la branche *develop*. 

### Prise en main du projet

Nous avons mis en place une [documentation](./modification.md) afin de faciliter la prise en main du projet. 

### GIT 

Afin de pousser des développements sur le projet, ces derniers doivent être fournis par l'intermédiaire de `Pull Request` depuis votre branche vers la branche `develop` du projet. 

Plus généralement, la gestion des branches et des versions pour les développements est détaillée [ici](./version.md). 

## Outils pour le développement

Jusqu'à présent, plusieurs outils ont été utilisé pour aidé les développements. Il s'agissait surtout d'avoir un avis sur la qualité du code. Pour cela, nous avons utilisé Sonarkube. 

### Sonaqube 

#### Avec docker

Il est possible d'analyser régulièrement le code avec Sonarqube. On pourra utiliser les containers proposés par Sonarqube. 

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

Il est possible d'utiliser un serveur Sonarqube tiers et d'y charger les données d'analyse via le binaire de Sonarqube. 

#### Sonarlint 

Pour une analyse continue lors des développements, il est possible d'installer l'extension Sonarlint dans certains IDE. 

