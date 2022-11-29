FROM r-base:latest

LABEL maintainer="IGN <rdev@ign.fr>"
LABEL version="1.0"

### Récupération des sources du script de génération des requêtes aléatoires 
WORKDIR /home/docker
COPY test/load/random-route-generator ./
COPY test/load/random-iso-generator ./

VOLUME ["/home/docker/data"]

CMD ["R", "-f", "/home/docker/routeGenerator.R", "--args", "/home/docker/data/road2_parameters.ssv", "100", "data-osm", "8.61", "41.40", "9.52", "42.62"]
