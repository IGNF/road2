# Local demonstration of Road2

This file describes the instructions to follow to have a local demo of Road2 limited to OSRM and PGRouting engines.

## Principle

We offer docker images that allow you to test the service locally. We plan to put these images on DockerHub.

## Using pre-built images available on DockerHub

## Building images locally

These are the same images that we may want to build locally.

To build the image, simply go to the root of the Road2 project and run the following command:
```
docker build -t road2-demonstration -f docker/demonstration/Dockerfile .
```

## Use

### Data recovery

Data is required for Road2 to calculate routes.

### Launching the application

You can launch the application with the following command:
```
docker run --rm road2-demonstration
```

## Documentation

### APIs

It is possible to view API documentation locally. We will run the following command:
```
docker run --rm -p 8083:8080 -e SWAGGER_JSON=/api.json -v {path/to/json/directory}/api.json:/api.json swaggerapi/swagger-ui
```