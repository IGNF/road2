# Gestion des branches et des versions

Ce document permet d'expliquer la démarche à suivre pour tenir à jour les branches et versions dans Road2, et dans les différents projets associés. 

## Présentation 

De part sa nature, le projet Road2 a un `package.json` qui contient une version. Cependant, ce projet ne fonctionne pas seul. Il y a des projets qui le complètent en ayant des rôles différents: 
- Route Graph Generator permet de générer des données utilisables par Road2
- PGRouting Procedures permet d'avoir les procédures utilisées en BDD par Road2 si on utilise le moteur PGRouting. 

Route Graph Generator et PGRouting Procedures sont indépendants en tant que projets GIT. Cependant, ils peuvent être rapatrié dans le projet Road2 par les submodules de GIT (`git submodule update --init` à la racine du projet Road2).

## Les branches

Sur ces trois projets ont une branche principale `main`. La gestion des versions mises en production est faite via des tags transformés en releases.

On veillera à partir de `main` et à créer une branche du type :
- `doc/*` pour modifier ou ajouter de la documentation uniquement,
- `feat/*` pour réaliser de nouvelles fonctionnalités,
- `fix/*` pour effectuer une correction sur le code source,
- `docker/*` pour modifier la partie docker uniquement,
- `test/*` pour modifier uniquement les tests, 
- `ci/*` pour modifier la CI Github

Pour fusionner une branche avec `main`, on veillera à avoir fait un rebase de develop sur cette branche. Et sur la méthode de merge, on fera un squash. Ainsi, la branche `main` aura un commit par fonctionnalité, correction, etc...

## Versions et tags

On part du principe que les versions sont gérés sur la branche `main` des différents projets. Et c'est pour cette branches que nous allons expliquer comment maintenir les versions et les tags. 

### Généralités 

Chaque projet aura, sur la branche `main`, une version supérieure à la dernière version ayant fait l'objet d'une release; ainsi que la mention `-BETA`. 

Par exemple, on veillera à toujours avoir, pour chaque projet, un état similaire au suivant: 
- dernière release : 1.0.0
- branche `main`: 1.0.1-BETA

On veillera à tagger les commits de chaque projet avec les bonnes versions. Cela est utile pour deux raisons: 
- On doit être capable d'identifier, par les tags, les versions du code utilisées en production. 
- On doit pouvoir faire fonctionner tous les projets ensemble à partir des tags sur `main`. 

### PGRouting Procedures et Route Graph Generator

Il est conseillé de commencer par gérer les versions de ces deux là. *Ce qui suit décrit le processus de mise à jour des projets, mais sans passer par les submodules de GIT*. Si on souhaite passer par les submodules, on pourra se référer à la documentation [proposée par GIT](https://git-scm.com/book/fr/v2/Utilitaires-Git-Sous-modules).

État initiale pour chaque projet: 

- dernière release: 1.0.0
- branche `main`: 1.0.1-BETA

Démarche à suivre pour chaque projet:

1. Tester `main` et corriger si nécessaire.
2. Update de la version sur `main` à 1.0.1.
3. Création du tag 1.0.1.
4. Update de la version sur `main` à 1.0.2-BETA.
5. Faire des tests sur le tag 1.0.1 et corriger si nécessaire.
6. S'il y a eu des corrections, recommencer à 1. en changeant le numéro de version. Sinon, publier une release avec le tag 1.0.1

### Road2 

Road2 dépend des deux autres. Cela entraîne des subtilités. 

État initial pour chaque projet: 

- dernière release : 1.0.0
- branche `main`: 1.0.1-BETA

Démarche à suivre pour Road2:

0. Réaliser les montée de version et les merge sur Route Graph Generator et PGRouting Procedures. 
1. Tester `main` avec les `main` des autres projets, et corriger si nécessaire.
2. Update de la version sur `main` à 1.0.1.
3. Création du tag 1.0.1.
4. Update de la version sur `main` à 1.0.2-BETA.
5. Faire des tests sur le tag 1.0.1 et corriger si nécessaire.
6. S'il y a eu des corrections, recommencer à 1. en changeant le numéro de version. Sinon, publier une release avec le tag 1.0.1

### Gestion des sous-modules 

Actuellement, Road2 fait appel à PGRouting Procedures et Route Graph Generator pour construire les différentes images docker qui permettent de tester et développer le service. La version utilisée dans Road2 sur sa branche `main`  correspond à *un commit spécifique* de la `main` de chaque sous-module. 

Pour pointer sur un commit plus récent, on suivra la procédure suivante : 
- créer une branche à partir de la branche `main` de Road2
- à la racine du projet, lancer la commande `git submodule update --remote`
- faire le commit de ce changement de référence
- faire une PR de mise à jour des dépendances sur `main`
