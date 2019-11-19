{
  "resource": {
    "id": "bduni-idf-pgr",
    "type": "pgr",
    "description": "Donn\u00e9es BDUNI v2.",
    "topology": {
      "id": "base-bduni",
      "type": "db",
      "description": "Donn\u00e9es issues de la BDUNI de l'IGN.",
      "storage": {
        "base": {
          "dbConfig": "/home/geoevolution/road2-config/db_config_output.json",
          "table": "ways",
          "attributes": [
            {
              "key": "name",
              "column": "way_names",
              "default": "false"
            },
            {
              "key": "vitesse",
              "column": "vitesse_moyenne_vl",
              "default": "false"
            },
            {
              "key": "nature",
              "column": "nature",
              "default": "false"
            }
          ]
        }
      },
      "projection": "EPSG:4326",
      "bbox": "1.7,48.4,3.3,49.1",
      "mapping": {
        "source": {
          "baseId": "base_bduni"
        },
        "storage": {
          "file": "sql/bduni_convert.sql"
        }
      },
      "defaultAttributes": [
        "name"
      ]
    },
    "sources": [
      {
        "id": "bduni-idf-car-fastest-pgr",
        "type": "pgr",
        "storage": {
          "dbConfig": "/home/geoevolution/road2-config/db_config_output.json",
          "costColumn": "cost_s_car",
          "rcostColumn": "reverse_cost_s_car"
        },
        "cost": {
          "profile": "car",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/geoevolution/road2-config/costs_calculation_sample.json"
            },
            "configuration": {
              "name": "cost_s_car",
              "storage": {
                "file": "/home/geoevolution/road2-config/costs_calculation_sample.json"
              }
            }
          }
        }
      },
      {
        "id": "bduni-idf-car-shortest-pgr",
        "type": "pgr",
        "storage": {
          "dbConfig": "/home/geoevolution/road2-config/db_config_output.json",
          "costColumn": "cost_m_car",
          "rcostColumn": "reverse_cost_m_car"
        },
        "cost": {
          "profile": "car",
          "optimization": "shortest",
          "compute": {
            "storage": {
              "file": "/home/geoevolution/road2-config/costs_calculation_sample.json"
            },
            "configuration": {
              "name": "cost_m_car",
              "storage": {
                "file": "/home/geoevolution/road2-config/costs_calculation_sample.json"
              }
            }
          }
        }
      }
    ],
    "availableOperations": [
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
            "id": "getSteps",
            "defaultValueContent": "true"
          },
          {
            "id": "waysAttributes",
            "values": [
              "name"
            ]
          },
          {
            "id": "geometryFormat",
            "defaultValueContent": "geojson",
            "values": [
              "geojson",
              "polyline"
            ]
          },
          {
            "id": "projection",
            "defaultValueContent": "EPSG:4326",
            "values": [
              "EPSG:4326",
              "EPSG:2154"
            ]
          }
        ]
      }
    ]
  }
}
