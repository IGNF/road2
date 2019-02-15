//Variables Globales

var road2Url = 'http://lambiek.ign.fr:8080/simple/1.0.0/route?resource=corse-osm'


//Carte
var map;
var clickedPoints = new Array();
var vectorSource = new ol.source.Vector(),
    vectorLayer = new ol.layer.Vector({
      source: vectorSource
    }),
    styles = {
      route: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 6, color: [40, 40, 40, 0.8]
        })
      }),
      icon: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'css/img/GProuteMarker.png'
        })
      })
    };

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
            }),
            vectorLayer
        ],
        view: new ol.View({
            center: [1046575, 5267122],
            zoom: 10,
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
        displayAltitude: false,
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

    map.on('click', function(evt){

      // on récupère les coordonnées
      var clickedCoordinate = utils.to4326(evt.coordinate);
      // console.log(clickedCoordinate);

      // on stocke le point
      clickedPoints.push(clickedCoordinate);
      // on affiche ce point sur la carte
      utils.createFeature(clickedCoordinate);

      if (clickedPoints.length < 2) {
        return;
      }

      // on calcule l'itinéraire
      fetch(road2Url + '&start=' + clickedPoints[clickedPoints.length-2] + "&end="  + clickedPoints[clickedPoints.length-1])
      .then(function(r) {
        return r.json();
      })
      .then(function(json) {
        utils.createRoute(json.geometry);
      });

    });


}

var utils = {
  to4326: function(coord) {
    return ol.proj.transform([
      parseFloat(coord[0]), parseFloat(coord[1])
    ], 'EPSG:3857', 'EPSG:4326');
  },
  createFeature: function(coord) {
    var feature = new ol.Feature({
      type: 'place',
      geometry: new ol.geom.Point(ol.proj.fromLonLat(coord))
    });
    feature.setStyle(styles.icon);
    vectorSource.addFeature(feature);
  },
  createRoute: function(polyline) {
    var route = new ol.format.Polyline({
      factor: 1e5
    }).readGeometry(polyline, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    var feature = new ol.Feature({
      type: 'route',
      geometry: route
    });
    feature.setStyle(styles.route);
    vectorSource.addFeature(feature);
  }
};
