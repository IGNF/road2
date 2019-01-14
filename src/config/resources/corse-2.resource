{
  "resource": {
  "id": "corse-osm-2",
  "type": "osrm",
  "description": " Second exemple d'une ressource sur la Corse avec les données OSM.",
  "topology": {
    "description": "Données OSM sur la Corse.",
    "storage": {
      "file": "/home/docker/data/corse-latest.osm.pbf"
    },
    "projection": "EPSG:4326"
  },
  "sources": [
    {
      "id": "corse-car-fastest",
      "storage": {
        "file": "/home/docker/data/corse-latest.osrm"
      },
      "cost": {
        "profile": "car",
        "optimization": "fastest",
        "compute": {
          "storage": {
            "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.20.0/profiles/car.lua"
          }
        }
      }
    }
  ],
  "availableOperations":[

  ],
  "defaultSourceId": "corse-car-fastest",
  "boundingBox": "0,0,90,180",
  "defaultProjection": "EPSG:4326",
  "availableProjections": ["EPSG:4326","EPSG:2154"]
  }
}
