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
          "dbConfig": "/home/docker/data/output_base.json",
          "schema": "public",
          "attributes": [
            {
              "key": "name",
              "column": "way_names",
              "default": "false"
            },
            {
              "key": "id",
              "column": "id",
              "default": "false"
            }
          ]
        }
      },
      "projection": "EPSG:4326",
      "bbox": "1.7,48.4,3.3,49.1"
    },
    "sources": [
      {
        "id": "bduni-idf-car-fastest-pgr",
        "type": "pgr",
        "storage": {
          "costColumn": "cost_s_car",
          "rcostColumn": "reverse_cost_s_car"
        },
        "cost": {
          "profile": "car",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/docker/data/costs_calculation_sample.json"
            },
            "configuration": {
              "name": "cost_s_car",
              "storage": {
                "file": "/home/docker/data/costs_calculation_sample.json"
              }
            }
          }
        }
      },
      {
        "id": "bduni-idf-car-shortest-pgr",
        "type": "pgr",
        "storage": {
          "costColumn": "cost_m_car",
          "rcostColumn": "reverse_cost_m_car"
        },
        "cost": {
          "profile": "car",
          "optimization": "shortest",
          "compute": {
            "storage": {
              "file": "/home/docker/data/costs_calculation_sample.json"
            },
            "configuration": {
              "name": "cost_m_car",
              "storage": {
                "file": "/home/docker/data/costs_calculation_sample.json"
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
              "bduni-idf-pgr"
            ]
          },
          {
            "id": "start",
            "values": {
              "bbox": "1.7,48.4,3.3,49.1",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "end",
            "values": {
              "bbox": "1.7,48.4,3.3,49.1",
              "projection": "EPSG:4326"
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
              "bbox": "1.7,48.4,3.3,49.1",
              "projection": "EPSG:4326"
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
            "id": "bbox",
            "defaultValueContent": "true"
          },
          {
            "id": "projection",
            "defaultValueContent": "EPSG:4326",
            "values": [
              "EPSG:4326",
              "EPSG:2154"
            ]
          },
          {
            "id": "timeUnit",
            "defaultValueContent": "minute",
            "values": [
              "hour",
              "minute",
              "second"
            ]
          },
          {
            "id": "distanceUnit",
            "defaultValueContent": "meter",
            "values": [
              "meter",
              "kilometer"
            ]
          },
          {
            "id": "constraints",
            "values": [
              {
                "keyType": "name",
                "key": "wayType",
                "availableConstraintType": [
                  "banned"
                ],
                "availableValues": [
                  {
                    "value": "autoroute",
                    "field": "acces_vehicule_leger",
                    "condition": {
                      "type": "equal",
                      "value": "'A p\u00e9age'"
                    }
                  },
                  {
                    "value": "tunnel",
                    "field": "position_par_rapport_au_sol",
                    "condition": {
                      "type": "less",
                      "value": "0"
                    }
                  },
                  {
                    "value": "pont",
                    "field": "position_par_rapport_au_sol",
                    "condition": {
                      "type": "greater",
                      "value": "0"
                    }
                  }
                ]
              },
              {
                "keyType": "numerical",
                "key": "roadWidth",
                "availableConstraintType": [
                  "banned"
                ],
                "field": "largeur_de_chaussee"
              }
            ]
          }
        ]
      },
      {
        "id": "isochrone",
        "parameters": [
          {
            "id": "resource",
            "values": [
              "bduni-idf-pgr"
            ]
          },
          {
            "id": "point",
            "values": {
              "bbox": "-90,-180,90,180",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "costType",
            "defaultValueContent": "time",
            "values": [
              "time",
              "distance"
            ]
          },
          {
            "id": "costValue"
          },
          {
            "id": "profile",
            "defaultValueContent": "car",
            "values": [
              "car",
              "pedestrian"
            ]
          },
          {
            "id": "direction",
            "defaultValueContent": "departure",
            "values": [
              "departure",
              "arrival"
            ]
          },
          {
            "id": "projection",
            "defaultValueContent": "EPSG:4326",
            "values": [
              "EPSG:4326",
              "EPSG:2154",
              "EPSG:4559",
              "EPSG:2972",
              "EPSG:2975",
              "EPSG:4471",
              "EPSG:3857"
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
            "id": "timeUnit",
            "defaultValueContent": "second",
            "values": [
              "hour",
              "minute",
              "second"
            ]
          },
          {
            "id": "constraints",
            "values": [
              {
                "keyType": "name",
                "key": "wayType",
                "availableConstraintType": [
                  "banned"
                ],
                "availableValues": [
                  {
                    "value": "autoroute",
                    "field": "acces_vehicule_leger",
                    "condition": {
                      "type": "equal",
                      "value": "'A p\u00e9age'"
                    }
                  },
                  {
                    "value": "tunnel",
                    "field": "position_par_rapport_au_sol",
                    "condition": {
                      "type": "less",
                      "value": "0"
                    }
                  },
                  {
                    "value": "pont",
                    "field": "position_par_rapport_au_sol",
                    "condition": {
                      "type": "greater",
                      "value": "0"
                    }
                  }
                ]
              },
              {
                "keyType": "numerical",
                "key": "roadWidth",
                "availableConstraintType": [
                  "banned"
                ],
                "field": "largeur_de_chaussee"
              }
            ]
          }
        ]
      }
    ]
  }
}
