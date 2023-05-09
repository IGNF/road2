<<<<<<< HEAD
# Developer documentation for Road2

## Presentation of Road2

From a developer point of view, *Road2 is a web service written in Javascript and designed to work with NodeJS*. It offers various calculations related to routes. These calculations are made via engines that are not coded in Road2. It can therefore be considered as an interface for route calculation engines. Thus, the calculations are not done in the code but via the call to libraries.

Moreover, Road2 has been coded to make it easy to add new access APIs or new calculation engines.

## Useful concepts for developers 

Several concepts have been used during the developments. In order to better understand them and thus better understand the code, a reading of the [concepts](./concepts.md) is advised. 

## Road2 features 

All the functionalities are listed at [part](./functionnalities.md) in order to facilitate the visibility. 

## Participate in development 

Participation in this project is encouraged. Adding engines or APIs, of course. But all other features are welcome. Again, you are asked to make your developments starting from the *develop* branch. 

### Getting started with the project

We have set up a [documentation](./modification.md) in order to facilitate the handling of the project. 

### GIT 

In order to push developments on the project, they must be provided via `Pull Request` from your branch to the `develop` branch of the project. 

More generally, branch and version management for developments is detailed [here](./version.md). 

## Tools for development

Until now, several tools have been used to help developments. It was mainly to have an opinion on the quality of the code. For that, we used Sonarqube. 

### Sonarqube 

#### With docker

It is possible to analyze regularly the code with Sonarqube. We can use the containers proposed by Sonarqube. 

The following command launches a Sonarqube server which will allow to visualize the results:
=======
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
>>>>>>> a8e7531 (First draft on english documentation)

```
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```

<<<<<<< HEAD
Once launched, there is a server available http://localhost:9000. You need to connect to it to create a project called `road2` and generate a token. The name of the project is important. If another one is chosen, you have to modify the `./sonar-project.properties` file. 

The following command allows to launch the analysis on the code:
=======
Une fois lancée, il y a un serveur disponible http://localhost:9000. Il faut s'y connecter pour créer un projet qui s'appelle `road2` et générer un token. Le nom du projet est important. Si un autre est choisi, il faut modifier le fichier `./sonar-project.properties`. 

La commande suivante permet de lancer l'analyse sur le code:
>>>>>>> a8e7531 (First draft on english documentation)

```
docker run --rm -e SONAR_HOST_URL="http://${SONARQUBE_URL}" -e SONAR_LOGIN="myAuthenticationToken" -v "${YOUR_REPO}:/usr/src" sonarsource/sonar-scanner-cli
```

<<<<<<< HEAD
#### With another installation

It is possible to use a third-party Sonarqube server and upload the analysis data via the Sonarqube binary. 

#### Sonarlint 

For continuous analysis during development, it is possible to install the Sonarlint extension in some IDEs. 
=======
#### Avec une autre installation

Il est possible d'utiliser un serveur Sonarqube tiers et d'y charger les données d'analyse via le binaire de Sonarqube. 

#### Sonarlint 

Pour une analyse continue lors des développements, il est possible d'installer l'extension Sonarlint dans certains IDE. 

>>>>>>> a8e7531 (First draft on english documentation)
