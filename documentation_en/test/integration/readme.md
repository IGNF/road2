# Description of integration tests

## Class tests

To run the integration tests, it is advisable to use docker-compose in order to have a more complete test environment:
```
docker-compose up -d road2
docker-compose exec road2 npm run itest
```

The bottom-up approach was chosen for these tests. We will test the classes that depend on another to function. We will therefore test the following classes in the order indicated:

- First level:
     - apisManager (ExpressJS, api, log4js)
     - baseManager (base, log4js)
     - looseConstraint (constraint)
     - line (geometry, proj4, polyline)
     - point (geometry, proj4)
     - polygon (geoemtry, turf, proj4, polyline)
     - operation (parameter)
     - resourceParameter (parameter)
     - serverManager (server, ExpressJS, log4js, fs, assert)
     - healthRequest(request)
     - healthResponse (response)
     -serviceRequest(request)
    
- Second level:
     - routeRequest(request, dot)
     - isochronousRequest(request, item)
     - nearestRequest(request, dot)
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

- Third level:
     - parameterManager (parameter, boolParameter, enumParameter, floatParameter, pointParameter, constraintParameter, log4js)
     - resource (resourceOperation)
     - portion (point, step, duration, distance)

- Fourth level:
     - operationManager (parameterManager, operation, resourceOperation, log4js)
     - osrmResource(resource, resourceOperation)
     - pgrResource (resource, resourceOperation, log4js)
     - route (line, portion, duration, distance)

- Fifth level:
     - routeResponse (response, point, route)

- Sixth level:
     - osrmSource (source, osrm, routeResponse, nearestResponse, route, portion, line, point, step, distance, duration, errorManager, log4js)
     - pgrSource (source, routeResponse, isochroneResponse, route, portion, line, point, polygon, step, distance, duration, errorManager, gisManager, copyManager, simplify, turf, looseConstraint, log4js)

- Seventh level:
     - sourceManager (osrmSource, pgrSource, errorManager, storageManager, operationManager, log4js)

- Eighth level:
     - resourceManager (osrmResource, pgrResource, sourceManager, operationManager, log4js)

- Ninth level:
     - service (apisManager, resourceManager, sourceManager, operationManager, baseManager, projectionManager, serverManager, errorManager, ExpressJS, log4js)

- Tenth level:
     - serviceManager (service, serviceProcess, log4js)
     - serviceProcess (serviceAdministered, service, log4js, fork)

- Eleventh level:
     - administrator (express, log4js, helmet, path, fs, assert, serverManager, serviceManager, apisManager)

- Others:
     - road2.js
     - simple api controller.js 1.0.0
     - simple api index.js 1.0.0
     - simple api 1.0.0 init.js
     - simple api 1.0.0 update.js


## Dependency testing

### List of dependencies and their uses

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
        - Pool()
        - pool.on('error')
        - pool.end()
    - base/baseManager.js
    - sources/sourcesManager.js
    - sources/pgrSource.js
        - query()