FROM centos:7.8.2003

LABEL maintainer="IGN <rdev@ign.fr>"
LABEL version="1.1"

### MAJ
RUN yum -y update
RUN yum -y upgrade
RUN yum install -y yum-utils centos-release-scl epel-release
RUN yum-config-manager --enable rhel-server-rhscl-7-rpms

### Utilitaires et dépendances
# Pour NodeJS: python-2.7.5
# Un compilateur pour Boost et GCC 6: gcc-c++
# Un compilateur c++ plus récent (8) pour NodeJS: devtoolset-8
# Pour GCC 6.3.0 afin de compiler OSRM: GMP 4.2+, MPFR 2.4.0+ and MPC 0.8.0+
# Pour OSRM: boost 1.65.1; expat 2.2.0; lua 5.2.4; bzip2 1.0.6; tbb 
# Pour Boost: openmpi-devel python-devel
# Pour LUA: readline-devel
RUN yum -y install wget vim git python-2.7.5 gcc-c++ devtoolset-8 gmp-devel \
    mpfr-devel libmpc-devel flex flex-devel cmake3 zlib zlib-devel tbb tbb-devel \
    expat expat-devel lbzip2 bzip2-devel openmpi-devel python-devel readline-devel

### Installation de NodeJS à partir des sources
# https://github.com/nodejs/node/blob/v12.x/BUILDING.md
# https://github.com/nodejs/help/wiki/Installation
WORKDIR /home/docker/nodejs
RUN wget -O node-v10.18.0.tar.gz "https://nodejs.org/dist/v10.18.0/node-v10.18.0.tar.gz" && tar -xzf /home/docker/nodejs/node-v10.18.0.tar.gz
RUN scl enable devtoolset-8 bash && export CXX=/opt/rh/devtoolset-8/root/usr/bin/g++ && cd node-v10.18.0 && ./configure && make -j4 && make install

### Installation de gcc 6.2.0 pour compiler OSRM 
WORKDIR /home/docker/gcc
RUN git clone -b releases/gcc-6.3.0 --depth 1 https://gcc.gnu.org/git/gcc.git
# C'est volontairement en dehors des sources de gcc (voir documentation)
WORKDIR /home/docker/gcc/objdir
# https://gibsonic.org/tools/2019/08/08/gcc_building.html
RUN /home/docker/gcc/gcc/configure --prefix=$(pwd) --disable-multilib --disable-werror --enable-languages=c,c++ && make -j4 && make DESTDIR=/opt/gcc-6/ install
### Installation des dépendances de OSRM
# https://github.com/Project-OSRM/osrm-backend/wiki/Building-OSRM

# Installation de boost 1.65.1 (boost, filesystem, iostreams, program-options, regex, test, date-time, thread, system)
WORKDIR /home/docker/boost 
RUN wget https://dl.bintray.com/boostorg/release/1.65.1/source/boost_1_65_1.tar.gz && tar -xzf boost_1_65_1.tar.gz
WORKDIR /home/docker/boost/boost_1_65_1
RUN ./bootstrap.sh && ./b2 install 
# Installation de lua 5.2.4
WORKDIR /home/docker/lua
RUN wget http://www.lua.org/ftp/lua-5.2.4.tar.gz && tar zxf lua-5.2.4.tar.gz
WORKDIR /home/docker/lua/lua-5.2.4
RUN make linux test && make linux install 

### Installation de OSRM pour utiliser la libosrm dans Road2
# https://github.com/Project-OSRM/osrm-backend
# https://github.com/Project-OSRM/osrm-backend/blob/master/docs/nodejs/api.md
# https://github.com/door2door-io/osrm-express-server-demo
# https://github.com/Project-OSRM/osrm-backend/blob/master/CMakeLists.txt
WORKDIR /home/docker/osrm
RUN wget https://github.com/Project-OSRM/osrm-backend/archive/v5.23.0.zip && unzip v5.23.0.zip -d ./osrm-backend
WORKDIR /home/docker/osrm/osrm-backend/osrm-backend-5.23.0/
RUN npm install --production 
WORKDIR /home/docker/osrm/osrm-backend/osrm-backend-5.23.0/build 
# https://developers.redhat.com/blog/2015/02/05/gcc5-and-the-c11-abi/
RUN export CC=/opt/gcc-6/home/docker/gcc/objdir/bin/gcc && export CXXFLAGS="-D_GLIBCXX_USE_CXX11_ABI=0" && cmake3 .. -DCMAKE_BUILD_TYPE=Release -DENABLE_MASON=OFF -DCMAKE_CXX_COMPILER=/opt/gcc-6/home/docker/gcc/objdir/bin/g++ -DENABLE_NODE_BINDINGS=ON && make -j4 && make install
# https://gcc.gnu.org/onlinedocs/libstdc++/faq.html#faq.how_to_set_paths
ENV LD_LIBRARY_PATH=/opt/gcc-6/home/docker/gcc/objdir/lib64:$LD_LIBRARY_PATH

### Dossier de l'application
WORKDIR /home/docker/osrm/nodejs-binding/osrm-5.23.0/
# Création du module node osrm 
RUN mkdir lib && mkdir node_modules && cp -r ../../osrm-backend/osrm-backend-5.23.0/lib/* lib/ && \
    cp /usr/lib64/libtbb* lib/binding/ && cp -r ../../osrm-backend/osrm-backend-5.23.0/node_modules/* ./node_modules && \
    cp ../../osrm-backend/osrm-backend-5.23.0/package* ./ && cp ../../osrm-backend/osrm-backend-5.23.0/taginfo.json ./ && \
    tar -cvzf ../osrm-5.23.0.tgz ./

### Dossier des données
WORKDIR /home/docker/internal

### Récupération de données sur la Corse
RUN wget download.geofabrik.de/europe/france/corse-latest.osm.pbf && osrm-extract corse-latest.osm.pbf -p /home/docker/osrm/osrm-backend/osrm-backend-5.23.0/profiles/car.lua && osrm-contract corse-latest.osrm

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
RUN sed -i 's/"\s*osrm\s*"\s*:\s*".*",/"osrm":"\/home\/docker\/osrm\/nodejs-binding\/osrm-5\.23\.0\.tgz",/g' package.json
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
