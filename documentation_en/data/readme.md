# Data for Road2

## Navigable data

### Topology

In order for geographical data to be usable by a route calculation engine, it is necessary for it to be navigable. This means that these data represent an obligatorily connected, and potentially multiple, directed graph with loops. In other words, the data represents a set of nodes connected to each other by arcs, with the following properties:
- The graph is necessarily connected. The nodes are connected to each other by arcs so that each node is accessible from any other node in the graph. THIS graph can of course be divided into connected sub-graphs. But some routes will not exist.
- Generally, the graph is oriented. Arcs make sense. If this is not the case, each arc will be doubled to have two-way traffic.
- Potentially, the graph is multiple and may contain loops. Several arcs can connect the same two points. An arc can connect a single point and therefore make a loop.

In what has just been presented, the arcs represent traffic lanes and the nodes are generally only intersections between several lanes.

### The reality of navigation

The previous definition allows engines to calculate routes. However, if we are satisfied with this minimum, the result obtained is very likely not to comply with Traffic Laws. To get closer to reality, it is necessary to complete this topology with information present on the road and that the engines can take into account. The quality and completeness of the data thus added will lead to realistic routes.

#### Traffic directions

This information is essential to arrive at realistic routes. Without it, roundabouts will definitely be taken the wrong way.

#### Non-communications

Non-communications are information that specifies the prohibition to take an arc from another according to the direction of navigation. In concrete terms, these are the computer representation of certain signs (eg no left turn).

This information is also very important to have realistic routes. They are handled well by the engines.

### Metadata

You can also add information related to nodes or arcs. For example, a character string can be added to each arc, which indicates the name of the road it represents. These metadata are not necessary for the calculations, but they are useful for a service user.

## Data transformation

In this part, navigable data is considered acquired. In order to use them with Road2, it will be necessary to convert them into one of the formats readable by the server.

### OSRM Data

It is possible to use data in OSRM format. The only constraint is to have data generated with the same version as that of Road2. This version is indicated in the `package.json` at the root of the GIT project.

### PGRouting Data

If data in PGRouting format is available, it is possible to use it with Road2. A priori, there are no strong constraints on the version of PGRouting used. The only constraint is at the software level. It is necessary to install the procedures from the [GIT](https://github.com/IGNF/pgrouting-procedures) `pgrouting-procedures` project so that Road2 can query the database that hosts the PGRouting data and functions.

### Valhalla Data

Similarly, Road2 can be used with Valhalla data.

### Other data

When the data is not in one of the formats managed by Road2, it is still possible to convert them. Everyone can do it as they wish to end up with one of the formats mentioned above. However, if some want it, a [GIT](https://github.com/IGNF/route-graph-generator) project has been set up, `route-graph-generator`, in order to convert the data.

`route-graph-generator` is a set of python scripts that read data in different formats and convert it to a pivot format within a database. From the pivot database, it is possible to convert the data into any format supported by Road2. Thus, the same input data can allow calculations by all the engines.

Possible input formats for scripts are database or OSM format.

In the case of a database, the conversion of data into the pivot format is carried out by SQL scripts. At the moment, there is only one that can convert IGN data. However, it is easy to add new ones to start from a different format and end up in the pivot format. From this pivot format, all the tools already exist to achieve the formats managed by Road2.