# Description des tests d'intégration 

## Tests des classes 

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
    - resourceParameter (parameter)
    - serverManager (server, ExpressJS, log4js, fs, assert)
    - healthRequest (request)
    - healthResponse (response)
    - serviceRequest (request)
    
- Deuxième niveau: 
    - routeRequest (request, point)
    - isochroneRequest (request, point)
    - nearestRequest (request, point)
    - resourceOperation (resourceParameter)
    - boolParameter (resourceParameter)
    - enumParameter (resourceParameter)
    - floatParameter (resourceParameter)
    - pointParameter (resourceParameter, point, log4js)
    - constraintParameter (resourceParameter, constraint, looseConstraint)
    - intParameter (resourceParameter)
    - isochroneResponse (response, point, geometry)*
    - nearestResponse (response, point, geometry)
    - step (line, duration, distance)
    - source (baseManager, projectionManager)

- Troisième niveau: 
    - parameterManager (parameter, boolParameter, enumParameter, floatParameter, pointParameter, constraintParameter, log4js)
    - resource (resourceOperation)
    - portion (point, step, duration, distance)

- Quatrième niveau: 
    - operationManager (parameterManager, operation, resourceOperation, log4js)
    - osrmResource (resource, resourceOperation)
    - pgrResource (resource, resourceOperation, log4js)
    - route (line, portion, duration, distance)

- Cinquième niveau: 
    - routeResponse (response, point, route)

- Sixième niveau: 
    - osrmSource (source, osrm, routeResponse, nearestResponse, route, portion, line, point, step, distance, duration, errorManager, log4js)
    - pgrSource (source, routeResponse, isochroneResponse, route, portion, line, point, polygon, step, distance, duration, errorManager, gisManager, copyManager, simplify, turf, looseConstraint, log4js)

- Septième niveau: 
    - sourceManager (osrmSource, pgrSource, errorManager, storageManager, operationManager, log4js)

- Huitième niveau: 
    - resourceManager (osrmResource, pgrResource, sourceManager, operationManager, log4js)

- Neuvième niveau: 
    - service (apisManager, resourceManager, sourceManager, operationManager, baseManager, projectionManager, serverManager, errorManager, ExpressJS, log4js)

- Dixième niveau:
    - serviceManager (service, serviceProcess, log4js)
    - serviceProcess (serviceAdministered, service, log4js, fork)

- Onzième niveau:
    - administrator (express, log4js, helmet, path, fs, assert, serverManager, serviceManager, apisManager)

- Autres: 
    - road2.js
    - controller.js de l'api simple 1.0.0
    - index.js de l'api simple 1.0.0
    - init.js de l'api simple 1.0.0
    - update.js de l'api simple 1.0.0

## Tests des dépendances 

### Liste des dépendances et de leurs usages

- @mapbox/polyline 
    - geometry/line.js
        - encode()
        - toGeoJSON()
        - fromGeoJSON()
    - geometry/polygon.js
        - encode()
        - toGeoJSON()
        - fromGeoJSON()

- @turf/turf
    - apis/simple/1.0.0/controller/controller.js
        - bbox()
        - lineSlice()
    - geometry/polygon.js
        - polygon()
        - polygonToLine()
    - sources/pgrSource.js
        - point()
        - truncate()
        - lineSlice()
        - nearestPointOnLine()
        - length()
        - cleanCoords()

- assert
    - deepStrictEqual()
    - equal()
    - deepEqual()

- cors
    - service/service.js
        - ()

- express
    - administrator/administrator.js
        - ()
        - use()
        - Router()
        - router.use()
        - json()
        - set

- got
    - utils/httpQuery.js
        - ()
        - post()

- helmet
    - administrator/administrator.js
        - ()
    - service/service.js
        - ()

- https-proxy-agent
    - utils/httpQuery.js
        - ()

- log4js
    - configure()
    - getLogger()

- nconf
    - road2.js
        - use()
        - get()
        - argv().get()
        - argv().env()

- proj4
    - geography/projectionManager.js
        - defs()
        - ()

- osrm 
    - sources/sourceManager.js
    - sources/osrmSource.js
        - route()
        - nearest()

- pg {Pool}
    - base/base.js
        - ()
        - connect()
        - end()
    - base/baseManager.js
    - sources/sourcesManager.js
    - sources/pgrSource.js
        - query()