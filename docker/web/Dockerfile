FROM nginx:stable-alpine

LABEL maintainer="IGN <rdev@ign.fr>"
LABEL version="1.0"

### Copie de la configuration pour avoir les CORS en *
COPY docker/web/conf/default.conf /etc/nginx/conf.d/

### Récupération des sources du site web
WORKDIR /home/docker/web/www/road2
COPY test/www/ /home/docker/web/www/road2
RUN ln -s /home/docker/web/www/road2/ /usr/share/nginx/html/road2

### Récupération de la documentation de l'API
WORKDIR /home/docker/web/www/documentation/apis
COPY documentation/apis/ /home/docker/web/www/documentation/apis
RUN ln -s /home/docker/web/www/documentation/apis/ /usr/share/nginx/html/apis

### Lancement du serveur Nginx
CMD nginx -g "daemon off;"
