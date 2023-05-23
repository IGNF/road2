# Functional tests of Road2

Cucumber will be used to test the APIs of Road2, and this, in their functional aspects. It will also be used to test the Road2 configuration.

## Using Cucumber

There are several cucumber features to perform functional testing. There are features to test the requests that can be sent to the server. And there are features to test the different configurations that can be provided to the server in order to distribute the services.

### Request

The `request/cucumber/features/req*.feature` features are used to test features accessible via requests. To work, it is necessary to have generated data for each engine on the Ile-de-France.

In order to launch these tests, we will follow the following procedure:
- generate data for each engine in Ile-de-France
- launch the Road2 server via docker-compose
- run `npm run rtest` command via docker-compose.

### Setup

The features `configuration/cucumber/features/conf*.feature` allow to test the functionalities related to the loading of a Road2 configuration.

In order to launch these tests, we will follow the following procedure:
- launch the Road2 server via docker-compose
- run `npm run ctest` command via docker-compose.