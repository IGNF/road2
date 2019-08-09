//Variables Globales

var road2Url = "http://localhost:8080/simple/1.0.0/route?";
var map;
var clickedPoints = new Array();

// Variables par défaut que l'utilisateur peut modifier
var defaultResource="corse-osm";
var defaultProfile="car";
var defaultOptimization="fastest";

//Carte
var vectorSource = new ol.source.Vector();

var vectorLayer = new ol.layer.Vector({
      source: vectorSource
    });

var styles = {
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

      // en fonction du nombre de points stockés, on adapte le comportement
      if (clickedPoints.length === 1) {
        // on met les coordonnées dans le formulaire (start)
        var input = document.getElementById('userStart');
        input.value = clickedCoordinate;
      } else if (clickedPoints.length === 2) {
        // on met les coordonnées dans le formulaire (end)
        var input = document.getElementById('userEnd');
        input.value = clickedCoordinate;
      } else if (clickedPoints.length === 3) {
        var currentInputEnd = document.getElementById('userEnd');
        var currentInputInt = document.getElementById('userIntermediates');
        currentInputInt.value = currentInputEnd.value;
        currentInputEnd.value = clickedCoordinate;
      } else if (clickedPoints.length > 3) {
        var currentInputEnd = document.getElementById('userEnd');
        var currentInputInt = document.getElementById('userIntermediates');
        currentInputInt.value = currentInputInt.value + "|" + currentInputEnd.value;
        currentInputEnd.value = clickedCoordinate;
      } else {
        return false;
      }

      

      
      // on affiche ce point sur la carte
      utils.createFeature(clickedCoordinate);

      return true;

    });


}


// Calculer un itinéraire 
function computeRoad() {

  // console.log("Calcul d'un itinéraire");

  // Déclarations 
  var finalResource = "";
  var finalOptimization = "";
  var finalProfile = "";
  var finalStart = "";
  var finalEnd = "";
  var finalIntermediates = "";

  // Gestion des points utilisateur
  if (clickedPoints.length < 2) {
    // il n'y a pas assez de points pour faire un itinéraire 
    return false; 
  } else  {
    finalStart = document.getElementById('userStart').value;
    finalEnd = document.getElementById('userEnd').value;
    finalIntermediates = document.getElementById('userIntermediates').value;
  }


  // Gestion des paramètres de l'utilisateur 

  if (document.forms["route-form"].elements["userResource"].value !== "") {
    finalResource = document.forms["route-form"].elements["userResource"].value;
  } else {
    finalResource = defaultResource;
  }

  if (document.forms["route-form"].elements["userProfile"].value !== "") {
    finalProfile = document.forms["route-form"].elements["userProfile"].value;
  } else {
    finalProfile = defaultProfile;
  }

  if (document.forms["route-form"].elements["userOptimization"].value !== "") {
    finalOptimization = document.forms["route-form"].elements["userOptimization"].value;
  } else {
    finalOptimization = defaultOptimization;
  }

  // on calcule l'itinéraire
  fetch(road2Url + 
    "resource=" + finalResource + 
    "&profile=" + finalProfile + 
    "&optimization=" + finalOptimization +
    "&start=" + finalStart + 
    "&end="  + finalEnd + 
    "&intermediates=" + finalIntermediates + 
    "&geometryFormat=polyline&getGeometry=true&getBbox=true")
  .then(function(r) {
    return r.json();
  })
  .then(function(json) {
    utils.createRoute(json.geometry);
  });

  return true;

}

// Supprimer l'itinéraire afficher sur la carte 
function cancelRoad() {

  // Nettoyage du vecteur qui contient les données sur la map 
  vectorSource.clear();

  // Nettoyage du tableau qui contient les points 
  clickedPoints = new Array();

  // Nettoyage du formulaire 
  document.forms["route-form"].elements["userResource"].value = "";
  document.forms["route-form"].elements["userProfile"].value = "";
  document.forms["route-form"].elements["userOptimization"].value = "";
  document.forms["route-form"].elements["userStart"].value = "";
  document.forms["route-form"].elements["userEnd"].value = "";
  document.forms["route-form"].elements["userIntermediates"].value = "";
  
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
