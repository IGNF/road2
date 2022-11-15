{
  "resource": {
  "id": "data-osm",
  "type": "osrm",
  "description": "Exemple d'une ressource créée à partir des données OSM.",
  "resourceVersion": "yyyy-mm-dd",
  "sources": [
    "data-osm-car-fastest"
  ],
  "availableOperations":[
    {
      "id": "route",
      "parameters": [
        {
          "id": "resource",
          "values": [
            "data-osm"
          ]
        },
        {
          "id": "start",
          "values": {
            "bbox": "-90,-180,90,180",
            "projection": "EPSG:4326"
          }
        },
        {
          "id": "end",
          "values": {
            "bbox": "-90,-180,90,180",
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
            "bbox": "-90,-180,90,180",
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
            "second",
            "standard"
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
              "keyType": "name-osrm",
              "key": "wayType",
              "availableConstraintType": ["banned"],
              "availableValues": [
                {
                  "value": "autoroute",
                  "field": "toll"
                },
                {
                  "value": "tunnel",
                  "field": "tunnel"
                },
                {
                  "value": "pont",
                  "field": "bridge"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "nearest",
      "parameters": [
        {
          "id": "resource",
          "values": [
            "data-osm"
          ]
        },
        {
          "id": "coordinates",
          "values": {
            "bbox": "-90,-180,90,180",
            "projection": "EPSG:4326"
          }
        },
        {
          "id": "number",
          "defaultValueContent": 1,
          "values": {
            "min": 1,
            "max": 10
          }
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
