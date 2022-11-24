{
  "resource": {
  "id": "corse-osm",
  "type": "osrm",
  "description": "Exemple d'une ressource sur la Corse avec les données OSM.",
  "topology": {
    "id": "corse-osm",
    "type": "osm",
    "description": "Données OSM sur la Corse.",
    "storage": {
      "file": "/home/docker/internal/corse-latest.osm.pbf"
    },
    "projection": "EPSG:4326",
    "bbox": "-180,-90,180,90"
  },
  "sources": [
    {
      "id": "corse-car-fastest",
      "type": "osrm",
      "storage": {
        "file": "/home/docker/internal/corse-latest.osrm"
      },
      "cost": {
        "profile": "car",
        "optimization": "fastest",
        "compute": {
          "storage": {
            "file": "/usr/local/share/osrm/profiles/car.lua"
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
            "bbox": "-180,-90,180,90",
            "projection": "EPSG:4326"
          }
        },
        {
          "id": "end",
          "values": {
            "bbox": "-180,-90,180,90",
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
            "bbox": "-180,-90,180,90",
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
        }
      ]
    }
  ]
  }
}
