### TODO : Supprimer la compilation et l'installation de Valhalla dès que l'on aura un binding NodeJS pour lui et donc repasser sur une image node
FROM node:16-bullseye as build

### Compilation de Valhalla
RUN apt-get update && \
apt-get install -y cmake make libtool pkg-config g++ gcc curl unzip jq lcov protobuf-compiler \
vim-common locales libcurl4-openssl-dev zlib1g-dev liblz4-dev libprotobuf-dev && \
apt-get install -y libgeos-dev libgeos++-dev libluajit-5.1-dev libspatialite-dev libsqlite3-dev wget sqlite3 spatialite-bin python3-shapely && \
apt-get install -y libsqlite3-mod-spatialite python3-pip

WORKDIR /home/prime-server
RUN apt-get install -y git cmake autoconf automake pkg-config libtool make gcc g++ lcov libcurl4-openssl-dev libzmq3-dev libczmq-dev
RUN git clone --depth 1 --recursive https://github.com/kevinkreiser/prime_server.git && cd prime_server && \
cmake -B build . && cmake --build build && make -C build install

WORKDIR /home/valhalla/
RUN pip install --upgrade conan
RUN git clone --branch 3.2.0-with_hard_exclude --depth 1 --recursive https://github.com/IGNF/valhalla.git && cd valhalla && \
mkdir build && cmake -B build -DCMAKE_BUILD_TYPE=Release && make -C build && make -C build package

FROM node:16-bullseye as road2

### Installation des dépendances pour Valhalla et prime-server
RUN apt-get update && \
    apt-get install -y libtool pkg-config curl unzip jq lcov protobuf-compiler \
    vim-common locales libcurl4-openssl-dev zlib1g-dev liblz4-dev libprotobuf-dev \
    libgeos-dev libgeos++-dev libluajit-5.1-dev libspatialite-dev libsqlite3-dev wget sqlite3 spatialite-bin python3-shapely \
    libsqlite3-mod-spatialite libzmq3-dev libczmq-dev

### Installation prime-server
COPY --from=build /usr/local/lib/libprime_server.so.0.7.0 /usr/lib/libprime_server.so.0.0.0
COPY --from=build /usr/local/lib/libprime_server.so.0 /usr/lib/libprime_server.so.0
COPY --from=build /usr/local/lib/libprime_server.so /usr/lib/libprime_server.so

### Installation de valhalla
COPY --from=build /home/valhalla/valhalla/build/valhalla-3.1.4-Linux.tar.gz ./
RUN tar -xzvf valhalla-3.1.4-Linux.tar.gz && cd valhalla-3.1.4-Linux && cp -r bin/* /usr/bin/ && cp -r lib/* /usr/lib/ && cp -r include/* /usr/include/ && cp -r share/* /usr/share/

### Dossier contenant la configuration de Road2
WORKDIR /home/docker/config
COPY /docker/config /home/docker/config/

### Dossier de l'application
WORKDIR /home/docker/app
COPY src ./src/
### Récupération des sources de l'application
COPY *.json ./

### Installation des dépendances de l'application NodeJS
RUN npm install && npm install -g mocha eslint jsdoc

### Volume partagé pour lire les données
VOLUME ["/home/docker/data"]

### Commande de lancement de l'application
CMD npm run debug -- --ROAD2_CONF_FILE=../config/road2.json
