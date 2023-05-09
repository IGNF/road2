# Docker-Compose pour utiliser Road2, Route-Graph-Generator et PGRouting-Procedures

## Introduction

Road2 est un service de calcul d'itinéraires. Pour fonctionner, il doit avoir accès à un volume qui contient les données générées par Route-Graph-Generator et à une base de donnée PGRouting.

## Pré-requis

### Généralités 

Pour utiliser ce `docker-compose.yml`, il suffit de :
- Installer `docker` et `docker-compose`.
- Récupérer les sources des outils utiles pour développer. Cela se fait via les submodules GIT : `git submodule update --init` à la racine du projet Road2.
- Se placer dans le dossier `/docker/dev/` du projet Road2.
- Créer un fichier `.env` à côté du `docker-compose.yml` qui sera une copie adaptée du `compose.env.example`

### Proxy
Si on utilise ces Dockerfile derrière un proxy, il faudra vérifier que docker fonctionne déjà correctement avec le proxy:
- le fichier `/etc/systemd/system/docker.service.d/http-proxy.conf` est correctement rempli et permet à `dockerd` de télécharger des images sur internet. 
- le fichier `~/.docker/config.json` est correctement rempli et permet au CLI `docker` de fournir le proxy à chaque image lancée par l'utilisateur.

### DNS 
Si on utilise ces Dockerfile avec un VPN, on vérifiera que les configurations DNS utilsées par Docker sont les bonnes: 
- le fichier `/etc/docker/daemon.json` doit être rempli pour permettre à dockerd de spécifier à chaque image quel DNS utiliser. On veillera donc à bien remplir les attributs `dns` et `dns-search`.

### IP 
Si on utilise ces Dockerfile sur un réseau avec lequel il peut y avoir des problèmes d'IP, il sera utile de dédier à Docker une plage d'IP non utilisées:
- L'attribut `bip` du fichier ``/etc/docker/daemon.json` permet de préciser une plage d'IP. 
- Si bip a été rempli, on veillera à ce que cette plage d'IP soit bien ajouté à l'interface `docker0`. La commande `sudo ip route add {plage_ip} dev docker0` permet de le faire. 
- On pourra aussi avoir besoin d'ajouter une plage d'IP différente pour utiliser ce compose : `sudo ip route add {plage_ip_env} dev br-{id_du_network} proto kernel scope link src {ip_env_gateway}` où l'id est obtenu en faisant un `docker network ls`. La plage d'IP et sa porte sont celles définies dans le `.env`. 

### HTTPS
Si on souhaite tester le serveur en HTTPS, certaines actions sont nécessaires en amont: 
- générer un certificat auto-signé pour lancer l'application en HTTPS (ex. `openssl req -nodes -new -x509 -keyout server.key -out server.cert`).
- s'assurer qu'aucun serveur ne fonctionne sur le port *443*.

## Construction des images

Il possible d'utiliser les Dockerfiles de chaque projet pour builder les images unes par une. Mais cela peut se faire automatiquement via docker-compose.

Il suffit de lancer la commande `docker-compose build`.

## Démarrage des services

Pour lancer un service, il suffit d'exécuter la commande `docker-compose up $service` avec :
- `$service=road2` pour Road2. Cela va également instancier un PGRouting.
- `$service=pgrouting` pour PGRouting.
- `$service=r2gg` pour Route-Graph-Generator. Cela va également instancier un PGRouting.

On pourra utiliser l'option `-d` pour lancer en tâche de fond.

### Ordre de démarrage des services

Pour faire marcher le pipeline complet, il faut pour l'instant lancer les services dans l'ordre suivant :
`docker-compose up -d pgrouting`
`docker-compose up r2gg` pour générer des données
`docker-compose up road2`

## Gestion des variables

Lors du build des images puis lors de l'utilisation des services, il y a plusieurs paramètres qui peuvent varier. Ces paramètres sont indiqués dans le fichier `docker-compose.yml` par la syntaxe `${var}` ou par des secrets docker.

### Le fichier .env

Les paramètres du type `${var}` sont initialisés dans le fichier `.env` qui se trouve à côté du `docker-compose.yml`. Ce fichier n'existe pas. Il faut le créer en copiant et en adaptant le fichier `compose.env.example`. le `.env` est ignoré par git.

### Les secrets

Les secrets permettent de transférer des données sensibles. Dans notre cas, ils sont utile pour se connecter à la base de données qui va permettre de générer un graphe. 
