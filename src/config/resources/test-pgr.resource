{
  "resource": {
  "id": "test-pgr",
  "type": "pgr",
  "description": "Exemple d'une ressource PGR.",
  "topology": {
    "description": "Données pgr",
    "storage": {
      "db_config": "/home/docker/app/src/config/db_config_test.json"
    },
    "projection": "EPSG:4326"
  },
  "sources": [
    {
      "id": "test-car-fastest",
      "type": "pgr",
      "storage": {
        "db_config": "/home/docker/app/src/config/db_config_test.json"
      },
      "cost": {
        "profile": "car",
        "optimization": "fastest",
        "compute": {
          "storage": {
            "cost_column": "cost_m_car",
            "rcost_column": "reverse_cost_m_car"
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
