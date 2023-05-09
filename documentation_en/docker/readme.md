<<<<<<< HEAD
# Use Road2 with Docker

This folder gathers the different files allowing to use Road2 with docker.

There is a sub-folder for the major use cases identified:
- [dev](./dev/readme.md): develop Road2
- [demonstration](./demonstration/readme.md): obtain a local demonstration of the services offered by Road2. This Dockerfile is limited to OSRM and PGRouting engine testing as there are no Valhalla bindings at this time.
- [test](./test/readme.md): Test Road2

Other subfolders are ordered as follows for convenience:
- [web](./web/readme.md): This folder gathers useful files to have a small website which contains several documentations and graphic test pages for Road2.
- {{ '[config]({}/tree/{}/docker/config/)'.format(repo_url, repo_branch) }}: This folder contains several configuration files that are common to the other subfolders.
- [distributions](./distributions/readme.md): This folder can group different `Dockerfile` which are examples of installation under different distributions. Currently there is only one example left for Debian. This is the Dockerfile recommended for development on Road2 because it contains all the binaries useful for the different engines.
=======
# Utiliser Road2 avec Docker 

Ce dossier regroupe les différents fichiers permettant d'utiliser Road2 avec docker. 

Il y a un sous-dossier pour les grands usages identifiés : 
- [dev](./dev/readme.md) : développer Road2 
- [demonstration](./demonstration/readme.md) : obtenir une démonstration locale des services proposés par Road2. Ce Dockerfile est limité aux tests des moteurs OSRM et PGRouting car il n'existe pas de bindings Valhalla pour le moment. 
- [test](./test/readme.md) : Tester Road2 

D'autres sous-dossiers sont ordonnés ainsi pour des raisons pratiques : 
- [web](./web/readme.md) : Ce dossier regroupe des fichiers utiles pour avoir un petit site web qui contient plusieurs documentations et des pages de tests graphiques pour Road2. 
- {{ '[config]({}/tree/{}/docker/config/)'.format(repo_url, repo_branch) }} : Ce dossier regroupe plusieurs fichiers de configurations qui se trouvent être communs aux autres sous-dossiers. 
- [distributions](./distributions/readme.md) : Ce dossier peut regrouper différents `Dockerfile` qui sont des exemples d'installation sous différentes distributions. Actuellement, il ne reste plus qu'un exemple pour Debian. C'est le Dockerfile préconisé pour développer sur Road2 car il contient tous les binaires utiles aux différents moteurs. 
>>>>>>> a8e7531 (First draft on english documentation)
