FROM node:24.12-trixie-slim

### Mise à jour des paquets
RUN apt-get update && apt-get upgrade -y

### Dossier contenant la configuration de Road2
WORKDIR /home/docker/config
COPY /docker/config /home/docker/config/

### Dossier de l'application
WORKDIR /home/docker/app
COPY src ./src/
### Dossier documentation apis
COPY documentation/apis ./documentation/apis
### Récupération des sources de l'application
COPY *.json ./

### Installation des dépendances de l'application NodeJS
RUN npm install && npm install -g mocha eslint jsdoc nyc

### Volume partagé pour lire les données
VOLUME ["/home/docker/data"]

### Commande de lancement de l'application
CMD npm run debug -- --ROAD2_CONF_FILE=../config/road2.json
