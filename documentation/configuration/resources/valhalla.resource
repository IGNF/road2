"resource": {
    "id": "bdtopo-valhalla",
    "type": "valhalla",
    "description": "Données BDUNI v2.",
    "sources": [
    "bdtopo-auto-valhalla",
    ],
    "availableOperations":[
    {
        "id": "route",
        "parameters": [
        {
            "id": "resource",
            "values": [
            "bdtopo-valhalla"
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
            "car",
            "pedestrian"
            ]
        },
        {
            "id": "optimization",
            "defaultValueContent": "fastest",
            "values": [
            "fastest",
            "shortest"
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
            "polyline",
            "wkt"
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
                "keyType": "name-valhalla",
                "key": "wayType",
                "availableConstraintType": ["banned"],
                "availableValues": [
                {
                    "value": "autoroute",
                    "field": "toll"
                }
                ]
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
            "bdtopo-pgr"
            ]
        },
        {
            "id": "point",
            "values": {
            "bbox": "-180,-90,180,90",
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
            "id": "costValue",
            "values": {
            "min": 100,
            "max": 50000
            }
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
            "id": "constraints",
            "values": [
            {
                "keyType": "name-pgr",
                "key": "wayType",
                "availableConstraintType": ["banned"],
                "availableValues": [
                {
                    "value": "autoroute",
                    "field": "acces_vehicule_leger",
                    "condition": {
                    "type": "equal",
                    "value": "$niv3$A péage$niv3$"
                    }
                }
                ]
            }
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
            "polyline",
            "wkt"
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