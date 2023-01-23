# {{ title }} - Documentation

> **Description:** {{ description }}  
> **Auteur et contributeurs:** {{ author }}  
> **Version:** {{ version }}  
> **Code source:** {{ repo_url }}  
> **Dernière mise à jour de la documentation:** {{ date_update }}

## Présentation générale 

Road2 est un serveur de calcul d'itinéraires et d'isochrones écrit en Javascript et conçu pour fonctionner avec NodeJS. Ce serveur propose le calcul d'itinéraires et d'isochrones via des moteurs existants comme [OSRM](https://github.com/Project-OSRM/osrm-backend) ou [PGRouting](https://pgrouting.org/). Road2 est donc une interface pour moteurs de calculs. Ces derniers ne sont pas fait dans le code de Road2 mais via des appels à ses moteurs. Cela peut se traduire par l'appel à une librairie, ou à une base de données, ou encore à un autre service web. 

Road2 a été conçu dans l'idée de pouvoir facilement ajouter des nouveaux moteurs et de nouvelles APIs, et cela, de manière totalement transparente les uns pour autres. Autrement dit, ajouter un moteur n'a pas d'impact sur les APIs déjà existantes. L'objectif est de faciliter l'ajout de nouvelles fonctionnalités tout en pérennisant l'accès au service. Pour une plus longue discussion sur les concepts logiciels introduits dans Road2, on pourra se référer à la documentation [suivante](./developers/concepts.md).

Actuellement, Road2 propose trois moteurs, OSRM, PGRouting et Valhalla, via une unique API REST. 


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
