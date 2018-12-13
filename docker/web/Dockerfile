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

### Récupération des sources du site web
WORKDIR /home/docker/web/www
COPY test/www/ /home/docker/web/www
RUN ln -s /home/docker/web/www/ /var/www/html/road2

### Lancement du serveur Nginx
CMD nginx -g "daemon off;"
