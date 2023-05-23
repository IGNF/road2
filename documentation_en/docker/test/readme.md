# Docker-compose for testing

## Building and using with docker-compose

### Prerequisites

To use `docker-compose`, just:
- install `docker`.
- go to the `/docker/test/` folder of the Road2 project.
- create a `.env` file next to the `docker-compose.yml` which will be an adapted copy of the `compose.env.example`

### Building images

It is possible to use the Dockerfiles of each project to build the images one by one. But it can be done automatically via docker-compose.

Just run the `docker-compose build` command.

## Run tests

### Load testing with gatling

After filling in the `.env` by pointing, for example, to the `user-files` of this {{ '[repository]({}/tree/{}/test/load/gatling/user-files/)' .format(repo_url, repo_branch) }} and having taken care to choose a scenario, just run the command:
```
# Once the .env has been modified to choose the particular scenario
# Choose the scenario (warning road2Docker does not work until docker-compose up generate-load-data has been called at least once)
docker-compose up load-road2
```

## Generate data for testing

### Load testing with gatling

By default, the r2gg docker image allows to generate data for Road2 which comes from OSM data. In this case, this repository already contains queries and gatling scenarios to test Road2 on this data.

But if r2gg's docker image was used to create a resource pointing to a different location, it will need to generate data for testing.

To do this, simply modify the bbox of the `.env` and run the following command:
```
# Once the .env has been modified
docker-compose up generate-load-data
```

This command starts the generation of an `ssv` file in a docker volume. This file is then proposed in the gatling scenarios under the name of `dataOsm`. Moreover, this scenario will not work until a data has been generated with this docker-compose.
```
# After generating via this docker-compose
# Modify the .env to choose the 'dataOsm' scenario
docker-compose up load-road2
```

### Use data and scenarios from the host machine

If you want to use data and scenarios stored on the host machine, you just have to modify the `.env` to point to another `user-files`.