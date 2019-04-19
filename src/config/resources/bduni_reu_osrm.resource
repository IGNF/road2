{
  "resource": {
    "id": "bduni-reu-osrm",
    "type": "osrm",
    "defaultSourceId": "bduni-reu-car-fastest",
    "description": "Donn\u00e9es BDUNI v2.",
    "boundingBox": "-90,-180,90,180",
    "defaultProjection": "EPSG:4326",
    "availableProjections": [
      "EPSG:4326",
      "EPSG:2154"
    ],
    "topology": {
      "description": "Donn\u00e9es issues de la BDUNI de l'IGN.",
      "storage": {
        "file": "/home/docker/data/bduni-reu.osm"
      },
      "projection": "EPSG:4326",
      "mapping": {
        "source": {
          "baseId": "base_bduni"
        },
        "storage": {
          "file": "bduni_convert.sql"
        }
      },
      "defaultAttributes": [
        "name"
      ]
    },
    "sources": [
      {
        "id": "bduni-reu-car-fastest",
        "type": "osrm",
        "storage": {
          "file": "/home/docker/data/bduni-reu-car-fastest/bduni-reu-car-fastest.osrm"
        },
        "cost": {
          "profile": "car",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/docker/data/bduniv2_avec_sens_vitesse_fixe.lua"
            }
          }
        }
      }
    ],
    "availableOperations": [
      {
        "id": "route",
        "rate": 10,
        "maxIntermediatePoints": 10,
        "maxNumberOfConstraints": 2,
        "constraints": [
          {
            "id": "filter-unique",
            "type": "filter-osrm",
            "description": "Type d'arc.",
            "key": "road_type",
            "values": [
              "autoroute",
              "tunnel"
            ],
            "availableConstraints": [
              "banned"
            ],
            "availableOperators": [
              "="
            ]
          }
        ],
        "defaultParameters": [
          {
            "id": "algorithm",
            "default": "contraction-hierarchies"
          },
          {
            "id": "format",
            "default": "application/json"
          },
          {
            "id": "getGeometry",
            "default": true
          },
          {
            "id": "getBbox",
            "default": true
          },
          {
            "id": "getInstructions",
            "default": false
          },
          {
            "id": "distanceUnit",
            "default": "kilometer"
          },
          {
            "id": "timeUnit",
            "default": "h-m-s"
          }
        ]
      },
      {
        "id": "nearest",
        "rate": 20,
        "maxNumber": 100,
        "defaultParameters": [
          {
            "id": "format",
            "default": "application/json"
          },
          {
            "id": "getId",
            "default": false
          },
          {
            "id": "number",
            "default": 1
          },
          {
            "id": "type",
            "default": "all"
          }
        ]
      }
    ]
  }
}