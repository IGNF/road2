# Load testing

This folder contains scripts useful for load testing. These tests are performed with Gatling.

## Gatling

The `gatling` folder contains the `user-files` folder needed by Getling to perform the tests. We therefore find the definition of the simulations and the necessary resources. As it is, it is possible to launch the scenario contained in `gatling/user-files/simulations/road2.scala` which uses the resource `gatling/user-files/resources/road2_parameters.ssv`.

If Gatling is installed on the machine, we can point to the `user-files` folder. For more information, see the [official] site (https://gatling.io/).

Otherwise, it is possible to use the docker image available on [dockerhub](https://hub.docker.com/r/denvazh/gatling).

This is done in the {{ '[docker-compose]({}/tree/{}/docker/test/)'.format(repo_url, repo_branch) }} dedicated to testing in this repository. See the [readme](../../docker/test/readme.md) for its usage.

## random-route-generator

This is an R script that generates ssvs for load testing. Just run in the following way:
`R -f routeGenerator.R --args "/home/user/out.ssv" 100 "bduni" 8 41 9 42`

The `-f` option specifies the script to run. Each element following `--args` is a script option. These must be in the correct order:
- ssv output file
- number of lines
- Road2 resource tested
-xmin
-ymin
-xmax
-ymax

## random-iso-generator

This is an R script that allows you to generate ssvs for load tests on the isochrone calculation. Just run in the following way:
`R -f isoGenerator.R --args "/home/user/out.ssv" 100 "bduni" 8 41 9 42`

The `-f` option specifies the script to run. Each element following `--args` is a script option. These must be in the correct order:
- ssv output file
- number of lines
- Road2 resource tested
-xmin
-ymin
-xmax
-ymax