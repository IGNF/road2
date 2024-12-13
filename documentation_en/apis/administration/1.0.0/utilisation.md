# Using the admin API

## Concepts

This administration API was coded with the idea of allowing as many actions as possible on the configuration of Road2. The second goal was to provide a few shortcuts and additional features that were deemed useful and didn't add much complexity to the code.

Useful concepts (administrator, services, resources and sources) are defined on the [concepts] page (../../../developers/concepts.md).




## Prerequisites

In order to use this API, it is necessary that the administrator is launched with a valid administrator configuration (ex. [road2.json](../../../../docker/config/road2. json)). On the other hand, it is not necessary to have configured services, sources and resources as they can be configured later.

The other prerequisite, notably in order to be able to create a service, will be to have data accessible by Road2. Indeed, the administrator is not intended to manage the data itself (eg creation/deletion).





## Features

### Retrieve configuration from administrator

The configuration must exist. It is then returned.

### Modify admin configuration

In the administrator configuration, everything is editable. This allows in particular to create, modify and delete the services managed by this administrator.

When a change is sent, the resulting new configuration is first parsed. If it is valid, then the change is taken into account. Otherwise, an error is returned.

When the configuration is modified, the administrator immediately takes these modifications into account. If a restart is required, then the administrator will be temporarily unavailable. Depending on the mode of creation of the services that depend on it, there will or will not be interruption of these services.




### Managing a service

If a service exists, it is possible to modify and delete it. If it does not exist, it can be created.

#### Retrieve the configuration of a service

If the configuration exists, then it is returned. Otherwise, an error is returned.

#### Modify the configuration of a service

To modify the configuration of a service, it must exist. Everything can then be changed.

When a change is sent, the resulting new configuration is first parsed.
If it is valid, then the change can be taken into account. Otherwise, an error code is returned.
If a restart of the service is necessary, then it will be temporarily unavailable.

#### Create a service

If a service does not exist, it is possible to create it by providing its configuration.

The configuration is first checked. If it is valid, then the service is created. Otherwise, an error is returned.

Once created, the service is available.

#### Delete a service

To delete a service, it will be necessary to have first deleted the associated sources and resources.

Once deleted, a service and its configuration cannot be recovered.



### Manage a source for a specific service

The management of sources is always done within a specific service.

The accessibility of a source is done via the notion of resource. If no resource uses a source, then the source is not queryable. However, to create a resource, it is necessary to have first created at least one source that it will use.

#### Get source configuration

If a source exists, it is possible to retrieve its configuration. If it does not exist, an error is returned.

#### Modify the configuration of a source

To modify the configuration of a source, it must exist. Everything can then be changed.

When a change is sent, the resulting new configuration is first parsed.
If it is valid, then the change can be taken into account. Otherwise, an error code is returned.

#### Create source configuration

Creating a source configuration is equivalent to creating a source.

To create a source, only the presence of the data is also required.


#### Delete source configuration

Deleting a source configuration is equivalent to deleting a source.

To delete a source, its use within the resources must already be deleted.




### Manage a resource for a specific service

Resource management always takes place within a specific service.

#### Get resource configuration

If a resource exists, it is possible to retrieve its configuration. If it does not exist, an error is returned.

#### Modify the configuration of a resource

To modify the configuration of a resource, the resource must exist. Everything can then be changed.

When a change is sent, the resulting new configuration is first parsed.
If valid, then the change can be taken into account. Otherwise, an error code is returned.


#### Create a resource configuration

Creating a resource configuration is equivalent to creating a resource. When the configuration is created, the resource is made available.

To create a resource, the sources used must exist.

#### Delete resource configuration

Deleting a resource configuration is equivalent to deleting a resource. The resource is therefore no longer available.





### Know the status of the administrator and associated services

This status refers to data availability. Each service has a status linked to the availability of its resources. Each resource has a status related to the availability of its sources. And each source, a status of the availability of its data.





### Find out the deployed server version

Find out the version of Road2 deployed on the current instance.





## Shortcuts

### List the services managed by an administrator

For some uses, we would like to know the list of available services. It would be possible to have this information by reading the configuration of the administrator.

### List the resources offered by a service

For some uses, we would like to know the list of resources available on a specific service.

### List the sources offered by a service

For some uses, we would like to know the list of sources available on a specific service.




## Usage examples

The most frequent cases seem to be the cases where we have an administrator and services which are already well configured. We then simply want to administer this existing configuration. To do this, simply refer to the paragraph describing the functionalities.

### Configure a service only through the admin API

In some cases, we want to create a new service next to the existing ones or simply create the very first one. Here's how:

Assuming the admin is properly configured and started, and data is available, one can fully configure a new service through the admin API.

We will start by creating a service with a good configuration.

Now, we will be able to create sources using the data already available.

From these sources, we will be able to create resources.

Everything is in place, all that remains is to make the service available.