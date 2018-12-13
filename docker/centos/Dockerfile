FROM centos:7.5.1804

LABEL maintainer="IGN <idev@ign.fr>"
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
RUN yum -y update
RUN yum -y upgrade
RUN yum install -y yum-utils centos-release-scl epel-release
RUN yum-config-manager --enable rhel-server-rhscl-7-rpms

### Utilitaires
RUN yum -y install wget vim

### Installation des dépendances de NodeJS
RUN yum install -y python-2.7.5

### Installation du compilateur c++
RUN yum -y install devtoolset-6 gcc gcc-c++



### Installation de NodeJS à partir des sources
# https://github.com/nodejs/node/blob/master/BUILDING.md#building-nodejs-on-supported-platforms
# https://github.com/nodejs/help/wiki/Installation
WORKDIR /home/docker/nodejs
RUN wget -O node-v10.13.0.tar.gz "https://nodejs.org/dist/v10.13.0/node-v10.13.0.tar.gz"
RUN tar -xzf /home/docker/nodejs/node-v10.13.0.tar.gz
RUN cd node-v10.13.0  && ./configure && make -j4 && make install

### Dossier de l'application
WORKDIR /home/docker/app

### Récupération des sources de l'application
COPY package.json ./
COPY process.config.js ./
COPY /src ./src/


### Installation des dépandences de l'application NodeJS
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
# https://expressjs.com/fr/starter/installing.html
RUN npm install

### Installation de PM2 pour gérer l'application
# Ce n'est pas une dépendance nécessaire à l'exécution de l'application
# http://pm2.keymetrics.io/docs/usage/quick-start/
# https://pm2.io/doc/en/runtime/integration/docker/
RUN npm install pm2 -g


### Commande de lancement de l'application
CMD npm start
