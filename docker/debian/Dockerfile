FROM debian:buster-20181112

LABEL maintainer="IGN <rdev@ign.fr>"
LABEL version="1.0"

### Arguments pour le build de l'image
# DNS
ARG dnsHost=""
ARG dnsIP=""
# Proxy
ARG proxy=""

### DNS

RUN if [ "$dnsHost" != "" ] ; then echo "search $dnsHost" > /etc/resolv.conf ; fi
RUN if [ "$dnsHost" != "" ] ; then echo "nameserver $dnsIP" >> /etc/resolv.conf ; fi

### PROXY
ENV http_proxy=$proxy
ENV https_proxy=$proxy
ENV HTTP_PROXY=$proxy
ENV HTTPS_PROXY=$proxy

### MAJ
RUN apt-get -y update
RUN apt-get -y upgrade

### Utilitaires
RUN apt-get -y install wget vim unzip

### Installation des dépendances de NodeJS
RUN apt-get install -y python g++ make

### Installation de NodeJS à partir des sources
# https://github.com/nodejs/node/blob/master/BUILDING.md#building-nodejs-on-supported-platforms
# https://github.com/nodejs/help/wiki/Installation
WORKDIR /home/docker/nodejs
RUN wget -O node-v10.13.0.tar.gz "https://nodejs.org/dist/v10.13.0/node-v10.13.0.tar.gz"
RUN tar -xzf /home/docker/nodejs/node-v10.13.0.tar.gz
RUN cd node-v10.13.0  && ./configure && make -j4 && make install

### Installation des dépendances de OSRM
# https://github.com/Project-OSRM/osrm-backend/wiki/Building-OSRM
RUN apt-get install -y cmake libboost-dev libboost-filesystem-dev libboost-thread-dev libboost-system-dev libboost-regex-dev libstxxl-dev libxml2-dev libsparsehash-dev libbz2-dev zlib1g-dev libzip-dev libgomp1 liblua5.2-dev pkg-config libgdal-dev libboost-program-options-dev libboost-iostreams-dev libboost-test-dev libtbb-dev libexpat1-dev

### Installation de OSRM pour utiliser la libosrm dans Road2
# https://github.com/Project-OSRM/osrm-backend
# https://github.com/Project-OSRM/osrm-backend/blob/master/docs/nodejs/api.md
# https://github.com/door2door-io/osrm-express-server-demo
# https://github.com/Project-OSRM/osrm-backend/blob/master/CMakeLists.txt
WORKDIR /home/docker/osrm
RUN wget https://github.com/Project-OSRM/osrm-backend/archive/v5.23.0.zip
RUN unzip v5.23.0.zip -d ./osrm-backend
RUN cd /home/docker/osrm/osrm-backend/osrm-backend-5.23.0/ && mkdir build && cd build && cmake .. -DCMAKE_BUILD_TYPE=Release && cmake --build . && cmake --build . --target install

### Dossier des données
WORKDIR /home/docker/internal

### Récupération de données sur la Corse
# L'objectif est d'avoir un container indépendant du docker-compose
RUN wget download.geofabrik.de/europe/france/corse-latest.osm.pbf
RUN osrm-extract corse-latest.osm.pbf -p /home/docker/osrm/osrm-backend/osrm-backend-5.23.0/profiles/car.lua
RUN osrm-contract corse-latest.osrm

### Dossier contenant la configuration
WORKDIR /home/docker/config
COPY /docker/config /home/docker/config/

### Dossier de l'application
WORKDIR /home/docker/app

### Récupération des sources de l'application
COPY package.json ./
COPY eslint.json ./
COPY jsdoc.json ./
COPY src ./src/
COPY /test ./test/

### Installation des dépandences de l'application NodeJS
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
# https://expressjs.com/fr/starter/installing.html
RUN npm install

### Installation de mocha pour les tests
# https://mochajs.org/#installation
RUN npm install mocha -g

### Installation de eslint pour le code
# https://eslint.org/docs/user-guide/configuring
RUN npm install eslint -g

### Installation de jsdoc pour la documentation du code
# http://usejsdoc.org/about-configuring-jsdoc.html
RUN npm install jsdoc -g

### Volume partagé pour lire les données
VOLUME ["/home/docker/data"]

### Commande de lancement de l'application
CMD npm run debug -- --ROAD2_CONF_FILE=/home/docker/config/road2.json
