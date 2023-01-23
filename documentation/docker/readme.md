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