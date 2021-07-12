FROM centos:7.5.1804

LABEL maintainer="IGN <rdev@ign.fr>"
LABEL version="1.0"

### MAJ
RUN yum -y update
RUN yum -y upgrade
RUN yum install -y yum-utils centos-release-scl epel-release
RUN yum-config-manager --enable rhel-server-rhscl-7-rpms

### Utilitaires
RUN yum -y install wget vim

### Installation des dépendances de NodeJS
RUN yum install -y python-2.7.5

### Installation du compilateur c++
RUN yum -y install devtoolset-8 gcc gcc-c++



### Installation de NodeJS à partir des sources
# https://github.com/nodejs/node/blob/master/BUILDING.md#building-nodejs-on-supported-platforms
# https://github.com/nodejs/help/wiki/Installation
WORKDIR /home/docker/nodejs
RUN wget -O node-v12.14.0.tar.gz "https://nodejs.org/dist/v12.14.0/node-v12.14.0.tar.gz"
RUN tar -xzf /home/docker/nodejs/node-v12.14.0.tar.gz
RUN cd node-v12.14.0  && ./configure && make -j4 && make install

### Installation des dépendances de OSRM
# https://github.com/Project-OSRM/osrm-backend/wiki/Building-OSRM
RUN scl enable devtoolset-8 bash && yum -y install cmake3 zlib-devel

### Installation de OSRM pour utiliser la libosrm dans Road2
# https://github.com/Project-OSRM/osrm-backend
# https://github.com/Project-OSRM/osrm-backend/blob/master/docs/nodejs/api.md
# https://github.com/door2door-io/osrm-express-server-demo
# https://github.com/Project-OSRM/osrm-backend/blob/master/CMakeLists.txt
WORKDIR /home/docker/osrm
RUN wget https://github.com/Project-OSRM/osrm-backend/archive/v5.25.0.zip
RUN unzip v5.25.0.zip -d ./osrm-backend
WORKDIR /home/docker/osrm/osrm-backend/osrm-backend-5.25.0/build
RUN scl enable devtoolset-8 bash && export CC=/opt/rh/devtoolset-8/root/usr/bin/gcc && cmake3 .. -DCMAKE_BUILD_TYPE=Release -DENABLE_MASON=ON -DCMAKE_CXX_COMPILER=/opt/rh/devtoolset-8/root/usr/bin/g++ && make && make install

### Dossier des données
WORKDIR /home/docker/internal

### Récupération de données sur la Corse
# L'objectif est d'avoir un container indépendant du docker-compose
RUN wget download.geofabrik.de/europe/france/corse-latest.osm.pbf
RUN osrm-extract corse-latest.osm.pbf -p /usr/local/share/osrm/profiles/car.lua
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
COPY /src ./src/
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
