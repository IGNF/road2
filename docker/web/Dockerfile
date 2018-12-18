FROM debian:buster-20181112

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
RUN apt-get -y update
RUN apt-get -y upgrade

### Utilitaires
RUN apt-get -y install wget vim

### Installation de Nginx
RUN apt-get -y install nginx

### Copie de la configuration pour avoir les CORS en *
COPY docker/web/conf/default /etc/nginx/sites-enabled/

### Récupération des sources du site web
WORKDIR /home/docker/web/www/road2
COPY test/www/ /home/docker/web/www/road2
RUN ln -s /home/docker/web/www/road2/ /var/www/html/road2

### Récupération de la documentation de l'API
WORKDIR /home/docker/web/www/documentation/api
COPY documentation/api/ /home/docker/web/www/documentation/api
RUN ln -s /home/docker/web/www/documentation/api/ /var/www/html/api

### Création d'un lien symbolique pour visualiser la documentation du code
WORKDIR /home/docker/web/www/documentation/code
RUN ln -s /home/docker/web/www/documentation/code/ /var/www/html/code

### Lancement du serveur Nginx
CMD nginx -g "daemon off;"
