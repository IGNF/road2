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