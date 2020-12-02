FROM debian:latest

LABEL maintainer="IGN <rdev@ign.fr>"
LABEL version="1.0"

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
WORKDIR /home/docker/web/www/documentation/apis
COPY documentation/apis/ /home/docker/web/www/documentation/apis
RUN ln -s /home/docker/web/www/documentation/apis/ /var/www/html/apis

### Création d'un lien symbolique pour visualiser la documentation du code
WORKDIR /home/docker/web/www/documentation/code
RUN ln -s /home/docker/web/www/documentation/code/ /var/www/html/code

### Lancement du serveur Nginx
CMD nginx -g "daemon off;"
