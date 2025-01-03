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

