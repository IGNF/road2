<<<<<<< HEAD
# Branch and version management

This document explains the procedure to follow to keep branches and versions up to date in Road2, and in the various associated projects.

## Presentation

By its nature, the Road2 project has a `package.json` that contains a version. However, this project does not work alone. There are projects that complement it by having different roles:
- Route Graph Generator allows to generate data usable by Road2
- PGRouting Procedures allows to have the procedures used in BDD by Road2 if the PGRouting engine is used.

Route Graph Generator and PGRouting Procedures are independent as GIT projects. However, they can be pulled in the Road2 project by GIT submodules (`git submodule update --init` at the root of the Road2 project).

## Branches

On these three projects have a `master` and `develop` branch. The first allows you to manage the versions put into production. The second makes it possible to carry out the developments.

We will make sure to start from `develop` and create a branch like this:
- `doc/*` to modify or add documentation only,
- `feat/*` to create new features,
- `fix/*` to make a correction to the source code,
- `docker/*` to modify the docker part only,
- `test/*` to modify only the tests,
- `ci/*` to modify the Github CI

To merge a branch with `develop`, we will make sure to have done a rebase of develop on this branch. And on the merge method, we will do a squash. So, the `develop` branch will have one commit per feature, fix, etc...

## Versions and tags

It is assumed that versions are managed on the `master` and `develop` branches of the various projects. And it is for these branches that we will explain how to maintain versions and tags.

### General

Each project will have, on the `develop` branch, a higher version than the one present on `master`; as well as the mention `-DEVELOP`.

For example, we will make sure to always have, for each project, a state similar to the following:
- `master` branch: 1.0.0
- `develop` branch: 1.0.1-DEVELOP

We will make sure to tag the commits of each project with the right versions. And this on the `master` branch mostly. This is useful for two reasons:
- We must be able to identify, by the tags, the versions of the code used in production.
- We must be able to make all the projects work together from the tags on `master` and `develop`.

When we merge `develop` on `master`, we will take care not to squash in order to facilitate future merges (as recommended by [github](https://docs.github.com/fr/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squashing-and-merging-a-long-running-branch)).

### PGRouting Procedures and Route Graph Generator

It is advisable to start by managing the versions of these two. *The following describes the process for updating projects, but without going through the GIT* submodules. If you want to use submodules, you can refer to the documentation [proposed by GIT](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

Initial state for each project:

- `master` branch: 1.0.0
- `develop` branch: 1.0.1-DEVELOP

Steps to follow for each project:

1. Test `develop` and correct if necessary.
2. Update version on `develop` to 1.0.1.
3. Merge of `develop` on `master`.
4. Update version on `develop` to 1.0.2-DEVELOP.
5. Run tests on `master` and correct if necessary.
6. If there were fixes on `master`, then merge `master` on `develop` and start over at 1. changing the version number.

### Road2

Road2 depends on the other two. This leads to subtleties.

Initial state for each project:

- `master` branch: 1.0.0
- `develop` branch: 1.0.1-DEVELOP

Procedure for Road2:

0. Perform version upgrades and merges on Route Graph Generator and PGRouting Procedures.
1. Test `develop` with the `develop` of other projects, and correct if necessary.
2. Update version on `develop` to 1.0.1.
3. Merge of `develop` on `master`.
4. Update version on `develop` to 1.0.2-DEVELOP.
5. Do tests on `master` with the `master` of other projects, and correct if necessary.
6. If there were fixes on `master`, then merge `master` on `develop` and start over at 1. changing the version number.
7. If there were no corrections on `master`, and we have the `master` and the `develop` of the three projects that work together, then tag `master` and `develop` with the versions, on each project.

### Submodule management

Currently, Road2 uses PGRouting Procedures and Route Graph Generator to build the various docker images that allow testing and developing the service. The version used in Road2 on its `master` and `develop` branch is *a specific commit* of the `master` of each submodule.

To point to a more recent commit, we will follow the following procedure:
- go to the `develop` branch of Road2
- at the root of the project, run the command `git submodule update --remote`
- make the commit of this reference change
- merge `develop` on `master`
=======
# Gestion des branches et des versions

Ce document permet d'expliquer la démarche à suivre pour tenir à jour les branches et versions dans Road2, et dans les différents projets associés. 

## Présentation 

De part sa nature, le projet Road2 a un `package.json` qui contient une version. Cependant, ce projet ne fonctionne pas seul. Il y a des projets qui le complètent en ayant des rôles différents: 
- Route Graph Generator permet de générer des données utilisables par Road2
- PGRouting Procedures permet d'avoir les procédures utilisées en BDD par Road2 si on utilise le moteur PGRouting. 

Route Graph Generator et PGRouting Procedures sont indépendants en tant que projets GIT. Cependant, ils peuvent être rapatrié dans le projet Road2 par les submodules de GIT (`git submodule update --init` à la racine du projet Road2).

## Les branches

Sur ces trois projets ont une branche `master` et `develop`. La première permet de gérer les versions mises en production. La seconde permet de réaliser les développements. 

On veillera à partir de `develop` et de créer une branche du type `feature-*` pour réaliser de nouvelles fonctionnalités. 

## Versions et tags

On part du principe que les versions sont gérés sur les branches `master` et `develop` des différents projets. Et c'est pour ces branches que nous allons expliquer comment maintenir les versions et les tags. 

### Généralités 

Chaque projet aura, sur la branche `develop`, une version supérieure à celle présente sur `master`; ainsi que la mention `-DEVELOP`. 

Par exemple, on veillera à toujours avoir, pour chaque projet, un état similaire au suivant: 
- branche `master`: 1.0.0
- branche `develop`: 1.0.1-DEVELOP

On veillera à tagger les commits de chaque projet avec les bonnes versions. Et cela sur la branche `master` principalement. Cela est utile pour deux raisons: 
- On doit être capable d'identifier, par les tags, les versions du code utilisées en production. 
- On doit pouvoir faire fonctionner tous les projets ensemble à partir des tags sur `master` et `develop`. 

### PGRouting Procedures et Route Graph Generator

Il est conseillé de commencer par gérer les versions de ces deux là. *Ce qui suit décrit le processus de mise à jour des projets, mais sans passer par les submodules de GIT*. Si on souhaite passer par les submodules, on pourra se référer à la documentation [proposée par GIT](https://git-scm.com/book/fr/v2/Utilitaires-Git-Sous-modules).

État initiale pour chaque projet: 

- branche `master`: 1.0.0
- branche `develop`: 1.0.1-DEVELOP

Démarche à suivre pour chaque projet:

1. Tester `develop` et corriger si nécessaire.
2. Update de la version sur `master` à 1.0.1.
3. Merge de `develop` sur `master`.
4. Update de la version sur `develop` à 1.0.2-DEVELOP.
5. Faire des tests sur `master` et corriger si nécessaire.
6. S'il y a eu des corrections sur `master`, alors faire un merge de `master` sur `develop` et recommencer à 1. en changeant le numéro de version.

### Road2 

Road2 dépend des deux autres. Cela entraîne des subtilités. 

État initiale pour chaque projet: 

- branche `master`: 1.0.0
- branche `develop`: 1.0.1-DEVELOP

Démarche à suivre pour Road2:

0. Réaliser les montée de version et les merge sur Route Graph Generator et PGRouting Procedures. 
1. Tester `develop` avec les `develop` des autres projets, et corriger si nécessaire.
2. Update de la version sur `develop` à 1.0.1.
3. Merge de `develop` sur `master`.
4. Update de la version sur `develop` à 1.0.2-DEVELOP.
5. Faire des tests sur `master` avec les `master` des autres projets, et corriger si nécessaire.
6. S'il y a eu des corrections sur `master`, alors faire un merge de `master` sur `develop` et recommencer à 1. en changeant le numéro de version.
7. S'il n'y a pas eu de corrections sur `master`, et qu'on a bien les `master` et les `develop` des trois projets qui fonctionnent ensemble, alors tagger `master` et `develop` avec les versions, sur chaque projet.

### Gestion des sous-modules 

Actuellement, Road2 fait appel à PGRouting Procedures et Route Graph Generator pour construire les différentes images docker qui permettent de tester et développer le service. La version utilisée dans Road2 sur sa branche `master` et `develop` est correspond à *un commit spécifique* de la `master` de chaque sous-module. 

Pour pointer sur un commit plus récent, on suivra la procédure suivante : 
- se placer sur la branche `develop` de Road2
- à la racine du projet, lancer la commande `git submodule update --remote`
- faire le commit de ce changement de référence
- merger `develop` sur `master`
>>>>>>> a8e7531 (First draft on english documentation)
