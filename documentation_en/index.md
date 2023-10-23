## General presentation

Road2 is a route and isochrone calculation server written in Javascript and designed to work with NodeJS. This server offers the calculation of routes and isochrones via existing engines like [OSRM](https://github.com/Project-OSRM/osrm-backend) or [PGRouting](https://pgrouting.org/ ). Road2 is therefore an interface for calculation engines. These are not done in the Road2 code but via calls to its engines. This can result in a call to a library, or to a database, or to another web service.

Road2 was designed with the idea of being able to easily add new engines and new APIs, and to do so in a completely transparent way to each other. In other words, adding an engine does not impact existing APIs. The objective is to facilitate the addition of new functionalities while maintaining access to the service. For a longer discussion on the software concepts introduced in Road2, we can refer to the [following] documentation (./developers/concepts.md).

Currently, Road2 offers three engines, OSRM, PGRouting and Valhalla, through a single REST API.

```{toctree}
---
caption: Road2
maxdepth: 1
numbered: true
---
Configuration <configuration/readme>
Données <data/readme>
Production <production/readme>
Changelog <developers/history>
Contributing <developers/contributing>
Code of conduct <developers/conduct>
```

----

```{toctree}
---
caption: Développement
maxdepth: 1
numbered: true
---
Développement <developers/readme>
Fonctionnalités <developers/functionnalities>
Concepts <developers/concepts>
Modification <developers/modification>
Versionning <developers/version>
Documentation <developers/documentation>
```

----

```{toctree}
---
caption: Tests
maxdepth: 1
numbered: true
---
Tests <test/readme>
Tests unitaires <test/unit/readme>
Tests fonctionnels <test/functional/readme>
Tests intégration <test/integration/readme>
Tests charges <test/load/readme>
```

----

```{toctree}
---
caption: Images docker
maxdepth: 1
numbered: true
---
Présentation <docker/readme>
Environnement développement <docker/dev/readme>
Environnement demonstration <docker/demonstration/readme>
Distribution debian <docker/distributions/readme>
Environnement tests <docker/test/readme>
Image pour serveur web <docker/web/readme>
```
