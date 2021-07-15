FROM debian:buster-slim

LABEL maintainer="IGN <rdev@ign.fr>"
LABEL version="1.0"

### MAJ et installation de R
RUN apt -y update && apt install -y r-base

### Récupération des sources du script de génération des requêtes aléatoires 
WORKDIR /home/docker
COPY test/load/random-route-generator ./
COPY test/load/random-iso-generator ./

VOLUME ["/home/docker/data"]

CMD ["R", "-f", "/home/docker/routeGenerator.R", "--args", "/home/docker/data/road2_parameters.ssv", "100", "corse-osm", "8.61", "41.40", "9.52", "42.62"]
