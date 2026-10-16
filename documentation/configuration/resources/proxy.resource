{
    "resource": {
        "id": "valhalla-proxy",
        "type": "proxy",
        "description": "Ressource proxy vers un service Valhalla.",
        "sources": ["valhalla-proxy"],
        "availableOperations": [
            {
                "id": "route",
                "parameters": [
                    { "id": "resource", "values": ["valhalla-proxy"] },
                    { "id": "start", "values": { "bbox": "-180,-90,180,90", "projection": "EPSG:4326" } },
                    { "id": "end", "values": { "bbox": "-180,-90,180,90", "projection": "EPSG:4326" } },
                    { "id": "profile", "defaultValueContent": "car", "values": ["car", "pedestrian"] },
                    { "id": "optimization", "defaultValueContent": "fastest", "values": ["fastest", "shortest"] },
                    { "id": "intermediates", "values": { "bbox": "-180,-90,180,90", "projection": "EPSG:4326" } },
                    { "id": "getSteps", "defaultValueContent": "true" },
                    { "id": "waysAttributes", "values": ["name"] },
                    { "id": "geometryFormat", "defaultValueContent": "geojson", "values": ["geojson", "polyline", "wkt"] },
                    { "id": "bbox", "defaultValueContent": "true" },
                    { "id": "projection", "defaultValueContent": "EPSG:4326", "values": ["EPSG:4326", "EPSG:2154"] },
                    { "id": "date_time" },
                    { "id": "timeUnit", "defaultValueContent": "minute", "values": ["hour", "minute", "second", "standard"] },
                    { "id": "distanceUnit", "defaultValueContent": "meter", "values": ["meter", "kilometer"] }
                ]
            },
            {
                "id": "isochrone",
                "parameters": [
                    { "id": "resource", "values": ["valhalla-proxy"] },
                    { "id": "point", "values": { "bbox": "-180,-90,180,90", "projection": "EPSG:4326" } },
                    { "id": "costType", "defaultValueContent": "time", "values": ["time", "distance"] },
                    { "id": "costValue", "values": { "min": 100, "max": 50000 } },
                    { "id": "profile", "defaultValueContent": "car", "values": ["car", "pedestrian"] },
                    { "id": "direction", "defaultValueContent": "departure", "values": ["departure", "arrival"] },
                    { "id": "date_time" },
                    { "id": "projection", "defaultValueContent": "EPSG:4326", "values": ["EPSG:4326", "EPSG:2154"] },
                    { "id": "geometryFormat", "defaultValueContent": "geojson", "values": ["geojson", "polyline", "wkt"] },
                    { "id": "timeUnit", "defaultValueContent": "second", "values": ["hour", "minute", "second"] },
                    { "id": "distanceUnit", "defaultValueContent": "meter", "values": ["meter", "kilometer"] }
                ]
            }
        ]
    }
}
