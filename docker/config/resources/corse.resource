{
  "resource": {
  "id": "corse-osm",
  "type": "osrm",
  "description": "Exemple d'une ressource sur la Corse avec les données OSM.",
  "topology": {
    "description": "Données OSM sur la Corse.",
    "storage": {
      "file": "/home/docker/data/corse-latest.osm.pbf"
    },
    "projection": "EPSG:4326",
    "bbox": "-90,-180,90,180"
  },
  "sources": [
    {
      "id": "corse-car-fastest",
      "type": "osrm",
      "storage": {
        "file": "/home/docker/data/corse-latest.osrm"
      },
      "cost": {
        "profile": "car",
        "optimization": "fastest",
        "compute": {
          "storage": {
            "file": "/home/docker/data/bduniv2_avec_sens_vitesse_fixe.lua"
          },
          "configuration": {
            "name": "cost_s_car",
            "storage": {
              "file": "/home/docker/data/costs_calculation_sample.json"
            }
          }
        }
      }
    }
  ],
  "availableOperations":[
    {
      "id": "route",
      "parameters": [
        {
          "id": "resource",
          "values": [
            "corse-osm"
          ]
        },
        {
          "id": "start",
          "values": {
            "bbox": "-90,-180,90,180"
          }
        },
        {
          "id": "end",
          "values": {
            "bbox": "-90,-180,90,180"
          }
        },
        {
          "id": "profile",
          "defaultValueContent": "car",
          "values": [
            "car"
          ]
        },
        {
          "id": "optimization",
          "defaultValueContent": "fastest",
          "values": [
            "fastest"
          ]
        },
        {
          "id": "intermediates",
          "values": {
            "bbox": "-90,-180,90,180"
          }
        },
        {
          "id": "stepsGeometry",
          "defaultValueContent": "true"
        },
        {
          "id": "waysAttributes",
          "values": [
            "name"
          ]
        }
      ]
    }
  ]
  }
}
