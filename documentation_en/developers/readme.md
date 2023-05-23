<<<<<<< HEAD
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
=======
# Developer documentation for Road2
>>>>>>> 5d82734 (second draft of doc)

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

<<<<<<< HEAD
La commande suivante lance un serveur Sonarqube qui permettra de visualiser les résultats:
>>>>>>> a8e7531 (First draft on english documentation)
=======
The following command launches a Sonarqube server which will allow to visualize the results:
>>>>>>> 5d82734 (second draft of doc)

```
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```

<<<<<<< HEAD
<<<<<<< HEAD
Once launched, there is a server available http://localhost:9000. You need to connect to it to create a project called `road2` and generate a token. The name of the project is important. If another one is chosen, you have to modify the `./sonar-project.properties` file. 

The following command allows to launch the analysis on the code:
=======
Une fois lancée, il y a un serveur disponible http://localhost:9000. Il faut s'y connecter pour créer un projet qui s'appelle `road2` et générer un token. Le nom du projet est important. Si un autre est choisi, il faut modifier le fichier `./sonar-project.properties`. 

La commande suivante permet de lancer l'analyse sur le code:
>>>>>>> a8e7531 (First draft on english documentation)
=======
Once launched, there is a server available http://localhost:9000. You need to connect to it to create a project called `road2` and generate a token. The name of the project is important. If another one is chosen, you have to modify the `./sonar-project.properties` file. 

The following command allows to launch the analysis on the code:
>>>>>>> 5d82734 (second draft of doc)

```
docker run --rm -e SONAR_HOST_URL="http://${SONARQUBE_URL}" -e SONAR_LOGIN="myAuthenticationToken" -v "${YOUR_REPO}:/usr/src" sonarsource/sonar-scanner-cli
```

<<<<<<< HEAD
<<<<<<< HEAD
#### With another installation

It is possible to use a third-party Sonarqube server and upload the analysis data via the Sonarqube binary. 

#### Sonarlint 

For continuous analysis during development, it is possible to install the Sonarlint extension in some IDEs. 
=======
#### Avec une autre installation
=======
#### With another installation
>>>>>>> 5d82734 (second draft of doc)

It is possible to use a third-party Sonarqube server and upload the analysis data via the Sonarqube binary. 

#### Sonarlint 

<<<<<<< HEAD
Pour une analyse continue lors des développements, il est possible d'installer l'extension Sonarlint dans certains IDE. 

>>>>>>> a8e7531 (First draft on english documentation)
=======
For continuous analysis during development, it is possible to install the Sonarlint extension in some IDEs. 
>>>>>>> 5d82734 (second draft of doc)
