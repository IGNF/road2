# Release of Road2

Road2 is of course usable in production. This is already the case at IGN. The objective of this document is to provide elements that can help in making certain architecture and scaling choices. Of course, the elements that will be exposed depend on the expected stress and the size of the graphs made available.


## Architectural elements

Road2 has been coded to be exposed directly on the internet. However, it is advisable to consider it as middleware, and therefore to use a classic front, like NGINX.

Depending on the engine(s) used, it will be necessary to have access to a database. This is the case if one of the engines used is PGRouting. In this case, it is advisable to consider this database as middleware and to put it on a different machine from Road2. In fact, it is what performs the calculation of routes and isochrones and this calculation involves a significant use of CPUs.

## Scaling Elements

### CPU

As it is, Road2 runs on a single thread. An evolution is planned to modify this behavior. However, this part of the code performs little computation. On the other hand, the engines use the CPUs a lot in parallel. This will therefore be the first resource to monitor to establish the scaling. An example of use in production will be given in the [Performances](#Performances) section to illustrate this.

### RAM

Road2 doesn't really need RAM. Here too, the need will depend on the motors used.

OSRM can require a lot of RAM (cf. [OSRM notes](https://github.com/Project-OSRM/osrm-backend/wiki/Disk-and-Memory-Requirements)), but it is not necessary to operate. Also, it may depend on how the graphs are loaded into memory. The NodeJS binding we use does not load the entire graph into memory. A system administrator will certainly know how to optimize the use of RAM according to the data processed and the expected performance.

PGRouting is a database that has indexes. RAM usage is managed by PostgreSQL according to the parameters provided in the database configuration. We advise asking a database administrator to perform optimizations.

## Performance

Performance depends directly on the engine used, and of course on the machine used to host the service. It is the calculation carried out by the engine which takes the most time and gives the order of magnitude of the response time.

The following information is given as examples. If we consider a graph that covers the whole of France (~25GB for OSRM and 16GB for PGRouting) and two servers with 8 cpu and 32 GB of RAM, one for Road2 (+OSRM bindings) and one for the PGRouting database, we obtain the following performance:
- route via OSRM < 100 ms
- route via PGR < 2000 ms. Of course, the results are highly variable. For example, if we consider a small route, we will have performances < 1000 ms without problem.
- isochronous via PGR have results that are too variable to be averaged: less than one second for small isochronous (<30min) and several seconds for larger ones. Knowing that the response time does not follow linearly the increase in the duration of the isochrone but rather it seems to have an exponential evolution.

## Industrialization

This part covers some useful topics for the industrialization of Road2.

### Installation of dependencies specific to each engine

By default, the `npm install` command will attempt to install all dependencies. However, some of them are useless if a motor is not used. We can therefore proceed as follows:
```
# Install strictly necessary dependencies
npm install --no-optional --no-package-lock --no-save
# Then, if we use a single engine, like OSRM for example
npm install --no-package-lock --no-save osrm
```

### Pack

It is possible to make an archive of Road2 via the classic `npm pack` command launched at the root of the GIT project. The package will only contain the `src` folder and the `package.json`. If the `node_modules` are already present, then they are added to the archive.

## Other Items

### Error display

By default, if Road2 encounters an error, it will return the content of that error to the client. This is a suitable behavior during developments. But in production it is better to return a generic error. To do this, simply launch Road2 with the variable `NODE_ENV` at `production`.

### CORS management

By default, an API will not handle CORS. Each developer must specify if they want to use CORS within the API they are developing. Thus, it is possible to determine on which route one wishes to use which CORS. For example, we can authorize all origins on certain calculation routes and restrict them on administration routes.

To apply CORS, we use the `cors` module which integrates well with expressJS.

By default there are options that are used but they can be overridden. If you want to overload the options, you will make sure to add them in a configuration file independent of the rest of the application configuration, as specified in the paragraph dealing with adding an API.

### HTTPS management

Road2 can be queried directly over HTTPS. For this, it uses the `https` module of NodeJS. It is therefore possible to provide it with the [options](https://nodejs.org/docs/latest-v12.x/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) available in this module.