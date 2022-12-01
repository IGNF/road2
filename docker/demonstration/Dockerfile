FROM node:16-alpine

### Dossier contenant la configuration
WORKDIR /home/docker/config
COPY /docker/config /home/docker/config/

### Dossier de l'application
WORKDIR /home/docker/app

### Copie des sources 
COPY /src ./src/
COPY package.json ./

### Installation des modules 
RUN npm install 

### Volume partagé pour lire les données
VOLUME ["/home/docker/data"]

CMD node /home/docker/app/src/js/road2.js --ROAD2_CONF_FILE=../config/road2.json