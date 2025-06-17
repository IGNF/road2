### TODO : Supprimer la compilation et l'installation de Valhalla dès que l'on aura un binding NodeJS pour lui et donc repasser sur une image node
FROM ghcr.io/valhalla/valhalla@sha256:6fb108a960bdc63c12b1c92ab04517a0c56a019ef45c9b9c8cf847d8de9db72b

### Mise à jour des
RUN apt-get update && apt-get upgrade -y
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

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
