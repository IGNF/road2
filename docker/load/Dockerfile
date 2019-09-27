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
RUN apt -y update
RUN apt -y upgrade

### Installation de R
RUN apt install -y r-base

### Récupération des sources du script de génération des requêtes aléatoires 
WORKDIR /home/docker
COPY test/load/random-route-generator ./

VOLUME ["/home/docker/data"]

CMD ["R", "-f", "/home/docker/routeGenerator.R", "--args", "/home/docker/data/road2_parameters.ssv", "100", "corse-osm", "8.61", "41.40", "9.52", "42.62"]
