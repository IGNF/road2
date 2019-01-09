{
  "resource": {
  "id": "corse-osm",
  "type": "osrm",
  "description": "Exemple d'une ressource sur la Corse avec les données OSM.",
  "topology": {
    "description": "Données OSM sur la Corse.",
    "storage": {
      "file": "/home/docker/data/osm/corse-latest.osm"
    },
    "projection": "EPSG:4326"
  },
  "sources": [
    {
      "id": "corse-car-fastest",
      "storage": {
        "file": "/home/docker/data/osrm/corse-car-fastest.osrm"
      },
      "cost": {
        "profile": "car",
        "optimization": "fastest",
        "compute": {
          "storage": {
            "file": "/home/docker/data/osrm/car-fastest.lua"
          }
        }
      }
    }
  ],
  "availableOperations":[

  ],
  "defaultSourceId": "corse-car-fastest",
  "boundingBox": "-90,-180,90,180",
  "defaultProjection": "EPSG:4326",
  "availableProjections": ["EPSG:4326","EPSG:2154"]
  }
}
