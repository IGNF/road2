//Variables Globales

//Carte
var map;

// Creation de la carte à la fin du chargement de la page
Gp.Services.getConfig({
    apiKey: "pratique",
    onSuccess: createMap
});


//Fonction pour créer la carte
function createMap() {

    map = new ol.Map({
        target: 'map-itineraire',
        layers: [
            new ol.layer.GeoportalWMTS({
                layer: "ORTHOIMAGERY.ORTHOPHOTOS"
            }),
            new ol.layer.GeoportalWMTS({
                layer: "GEOGRAPHICALGRIDSYSTEMS.MAPS",
                olParams: {
                    opacity: 0.3
                }
            })
        ],
        view: new ol.View({
            center: [260447.42, 6249628.41],
            zoom: 15,
            projection: "EPSG:3857"
        })
    });
    // Création du Layer Switcher
    var layerSwitcher = new ol.control.LayerSwitcher() ;
    // Ajout du LayerSwitcher à la carte
    map.addControl(layerSwitcher);
    // Creation du controle
    var mpControl = new ol.control.GeoportalMousePosition({
        collapsed: true,
        editCoordinates : true,
        systems : [
            {
                crs : 'EPSG:2154',
                label : "Lambert 93",
                type : "Metric"
            },
            {
                crs : "EPSG:4326",
                label : "Géographiques",
                type : "Geographical"
            },
            ,
            {
                crs : "EPSG:3857",
                label : "PM",
                type : "Metric"
            }
        ],
        units : ["DEC","M"]
    });
    // Ajout à la carte
    map.addControl(mpControl);


}
