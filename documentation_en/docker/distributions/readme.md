# Dockerfile to use Road2 on Debian


## Building the image

To build the image, just run the following command at the root of the Road2 project:
```
docker build -t road2-debian -f docker/debian/Dockerfile .
```

## Launch the application

To launch the application, just use the following command:
```
docker run --name road2-debian-server --rm -d -p 8080:8080 road2-debian
```

### DEBUG mode
```
docker run --name road2-debian-server --rm -it -p 8080:8080 road2-debian /bin/bash
```

## To develop while keeping the source code local
```
docker run --name road2-debian-server --rm -d -p 8080:8080 -v $src:/home/docker/app/src road2-debian
```

## To debug development mode with local sources
```
docker run --name road2-debian-server --rm -it -p 8080:8080 -v $src:/home/docker/app/src road2-debian /bin/bash
```

## Run the tests

Unit tests were written with Mocha. To run them, use the following command:
```
docker run --name road2-debian-server --rm -v $src:/home/docker/app/src -v $test:/home/docker/app/test road2-debian npm run utest
```

## Run eslint

To linter the code, just run the following command:
```
docker run --name road2-debian-server --rm -v $src:/home/docker/app/src road2-debian npm run lint
```

## Create code documentation via jsdoc

The code is documented via comments. These comments can be more or less structured with tags. The jsdoc tool makes it possible to generate a website from these comments and these tags.

To create the documentation, just run the following command:
```
docker run --name road2-debian-server --rm -v $doc:/home/docker/app/documentation/code road2-debian npm run jsdoc
```

The documentation will then be accessible in `$doc`.