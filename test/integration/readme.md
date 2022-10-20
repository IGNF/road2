# Description des tests d'intégration 

Pour lancer les tests d'intégration, il est conseillé d'utiliser docker-compose afin de disposer d'un environnement de test plus complet:
```
docker-compose up -d road2
docker-compose exec road2 npm run itest
```

C'est l'approche bottom-up qui a été choisie pour ces tests. On va tester les classes qui dépendent d'une autre pour fonctionner. On testera donc les classes suivantes dans l'ordre indiqué:

- Premier niveau:
    - apisManager (ExpressJS, api, log4js)
    - baseManager (base, log4js)
    - looseConstraint (constraint)
    - line (geometry, proj4, polyline)
    - point (geometry, proj4)
    - polygon (geoemtry, turf, proj4, polyline)
    - operation (parameter)
    - resourceParameter (parameter)*
    - routeRequest (request)
    - isochroneRequest (request)
    - serverManager (server, ExpressJS, log4js)
    - osmTopology (topology)
    - dbTopology (topology, base)
    
- Deuxième niveau: 
    - resourceOperation (resourceParameter)
    - boolParameter (resourceParameter)
    - enumParameter (resourceParameter)
    - floatParameter (resourceParameter)
    - pointParameter (resourceParameter, point, log4js)
    - constraintParameter (resourceParameter, constraint, looseConstraint)
    - isochroneResponse (response, point, geometry)
    - step (line, duration, distance)
    - topologyManager (osmTopology, dbTopology, storageManager, baseManager, projectionManager, log4js)
    - source (osmTopology, bdTopology, )

- Troisième niveau: 
    - parameterManager (parameter, boolParameter, enumParameter, floatParameter, pointParameter, constraintParameter, log4js)
    - resource (resourceOperation)
    - portion (point, step, duration, distance)

Quatrième niveau: 
    - operationManager (parameterManager, operation, resourceOperation, log4js)
    - osrmResource (resource, resourceOperation)
    - pgrResource (resource, resourceOperation, log4js)
    - route (line, portion, duration, distance)

Cinquième niveau: 
    - routeResponse (response, point, route)

Sixième niveau: 
    - osrmSource (source, osrm, osmTopology, routeResponse, route, portion, line, point, step, distance, duration, errorManager, log4js)
    - pgrSource (source, dbTopology, routeResponse, isochroneResponse, route, portion, line, point, polygon, step, distance, duration, errorManager, gisManager, copyManager, simplify, turf, looseConstraint, log4js)

Septième niveau: 
    - sourceManager (osrmSource, pgrSource, errorManager, storageManager, operationManager, osmTopology, dbTopology, log4js)

Huitième niveau: 
    - resourceManager (osrmResource, pgrResource, sourceManager, operationManager, log4js)

Neuvième niveau: 
    - service (apisManager, resourceManager, sourceManager, operationManager, baseManager, topologyManager, projectionManager, serverManager, errorManager, ExpressJS, log4js)

Autres: 
    - road2.js
    - controller.js de l'api simple 1.0.0
    - index.js de l'api simple 1.0.0
    - init.js de l'api simple 1.0.0
    - update.js de l'api simple 1.0.0