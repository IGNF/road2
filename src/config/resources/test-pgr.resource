{
  "resource": {
  "id": "test-pgr",
  "type": "pgr",
  "description": "Exemple d'une ressource PGR.",
  "topology": {
    "description": "Données pgr",
    "storage": {
      "dbConfig": "/home/docker/app/src/config/dbs/db_config_test.json"
    },
    "projection": "EPSG:4326"
  },
  "sources": [
    {
      "id": "test-car-fastest",
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
            "file": "/home/docker/route-graph-generator/io/costs_calculation_sample.json"
          }
        }
      }
    }
  ],
  "availableOperations":[

  ],
  "defaultSourceId": "test-car-fastest",
  "boundingBox": "-90,-180,90,180",
  "defaultProjection": "EPSG:4326",
  "availableProjections": ["EPSG:4326","EPSG:2154"]
  }
}
