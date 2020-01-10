// ---- Variables Globales

var road2Url = "https://localhost:8080/simple/1.0.0/route?";
var oldUrl = "https://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/itineraire/rest/route.json?"
var map;
var clickedStartPoint = new Array();
var clickedEndPoint = new Array();
var clickedIntPoint = new Array();

// -- Variables par défaut que l'utilisateur peut modifier
var defaultResource="bduni-idf-osrm";
var defaultProfile="car";
var defaultOptimization="fastest";
var defaultGraphName = "Voiture";
var defaultMethod = "time";
// -- 

// -- Variables pour la carte 

// Vecteurs qui vont contenir les éléments de l'itineraire sur la carte
var vectorRoad = new ol.source.Vector();
var vectorRoadOther = new ol.source.Vector();
var vectorStartPoint = new ol.source.Vector();
var vectorEndPoint = new ol.source.Vector();
var vectorIntPoint = new ol.source.Vector();

// Couches de la carte qui vont afficher l'itinéraire 
var vectorRoadLayer = new ol.layer.Vector({
  source: vectorRoad
});

var vectorRoadOtherLayer = new ol.layer.Vector({
  source: vectorRoadOther
});

var vectorStartPointLayer = new ol.layer.Vector({
  source: vectorStartPoint
});

var vectorEndPointLayer = new ol.layer.Vector({
  source: vectorEndPoint
});

var vectorIntPointLayer = new ol.layer.Vector({
  source: vectorIntPoint
});

// Styles pour les marqueurs 
var styles = {
      routePolyline: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 6, color: [40, 40, 40, 0.8]
        })
      }),
      routeWkt: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 6, color: [200, 40, 40, 0.8]
        })
      }),
      icon: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'css/img/GProuteMarker.png'
        })
      })
    };

// -- 

// -- Creation de la carte à la fin du chargement de la page
Gp.Services.getConfig({
    apiKey: "pratique",
    onSuccess: createMap
});
// -- 
// ----

// ---- Création d'un nouveau menu contextuel sur la carte 

var contextMenuItems = [
  {
    text: "Définir point de départ",
    callback: defineStartPoint
  },
  {
    text: "Définir point d'arrivée",
    callback: defineEndPoint
  },
  {
    text: "Ajouter point intermédiaire",
    callback: addIntPoint
  },
  {
    text: "Supprimer point intermédiaire",
    callback: deleteIntPoint
  }
];


// ----  

// Fonction pour créer la carte
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
            vectorRoadLayer,
            vectorRoadOtherLayer,
            vectorStartPointLayer,
            vectorEndPointLayer,
            vectorIntPointLayer
        ],
        view: new ol.View({
            center: [261223, 6250240],
            zoom: 10,
            projection: "EPSG:3857"
        })
    });
    // Création du Layer Switcher
    var layerSwitcher = new ol.control.LayerSwitcher({
      layers: [
        {
          layer: vectorRoadLayer,
          config: {
            title: 'Iineraires via Road2'
          }
        },
        {
          layer: vectorRoadOtherLayer,
          config: {
            title: 'Iineraires via autre service'
          }
        },
        {
          layer: vectorStartPointLayer,
          config: {
            title: 'Point de départ'
          }
        },
        {
          layer: vectorEndPointLayer,
          config: {
            title: 'Point d\'arrivée'
          }
        },
        {
          layer: vectorIntPointLayer,
          config: {
            title: 'Points intermédiaires'
          }
        }
      ]
    }) ;
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
    // Ajout du controle à la carte
    map.addControl(mpControl);

    // Ajout du menu contextuel à la carte 
    var contextmenu = new ContextMenu({
      width: 180,
      items: contextMenuItems
    });
    map.addControl(contextmenu);

}

// ---- Ajouter un point sur la carte 
// Fonction utilisée lors d'un clique droit sur la carte 
// Il s'agit d'afficher un marqueur et de stocker les coordonnées de ce point
// Et tout cela en intéragissant avec le formulaire des paramètres de l'itinéraire 
function defineStartPoint(evt) {

  // on récupère les coordonnées du point cliqué
  let clickedCoordinate = utils.to4326(evt.coordinate);

  if (clickedStartPoint.length !== 0) {
    clickedStartPoint = new Array();
    vectorStartPoint.clear();
  } 

  // on stocke les coordonnées pour pouvoir lancer un itinéraire
  clickedStartPoint.push(clickedCoordinate);

  // on met les coordonnées dans le formulaire (start)
  let input = document.getElementById('userStart');
  input.value = clickedCoordinate;

  // on affiche ce point sur la carte
  utils.createFeature(clickedCoordinate, vectorStartPoint);

  return true;

}

// ---- Ajouter un point sur la carte 
// Fonction utilisée lors d'un clique droit sur la carte 
// Il s'agit d'afficher un marqueur et de stocker les coordonnées de ce point
// Et tout cela en intéragissant avec le formulaire des paramètres de l'itinéraire 
function defineEndPoint(evt) {

  // on récupère les coordonnées du point cliqué
  let clickedCoordinate = utils.to4326(evt.coordinate);

  if (clickedEndPoint.length !== 0) {
    clickedEndPoint = new Array();
    vectorEndPoint.clear();
  } 

  // on stocke les coordonnées pour pouvoir lancer un itinéraire
  clickedEndPoint.push(clickedCoordinate);

  // on met les coordonnées dans le formulaire (end)
  let input = document.getElementById('userEnd');
  input.value = clickedCoordinate;

  // on affiche ce point sur la carte
  utils.createFeature(clickedCoordinate, vectorEndPoint);

  return true;

}

function addIntPoint(evt) {

  // on récupère les coordonnées du point cliqué
  let clickedCoordinate = utils.to4326(evt.coordinate);

  // on stocke les coordonnées pour pouvoir lancer un itinéraire
  clickedIntPoint.push(clickedCoordinate[0]+","+clickedCoordinate[1]);

  let currentInputInt = document.getElementById('userIntermediates');

  if (clickedIntPoint.length === 1) {
    currentInputInt.value = clickedCoordinate;
  } else if (clickedIntPoint.length > 1) {
    // on ajoute un pipe 
    currentInputInt.value = currentInputInt.value + "|" + clickedCoordinate;
  } else {
    return false;
  }
  // on affiche ce point sur la carte quand on n'est certain que le formulaire est bien mis à jour 
  utils.createFeature(clickedCoordinate, vectorIntPoint);

  return true;

}

function deleteIntPoint(evt) {

  let currentInputInt = document.getElementById('userIntermediates');

  let numberOfIntPoint = clickedIntPoint.length;

  if (numberOfIntPoint === 1) {
    currentInputInt.value = "";
    clickedIntPoint = new Array();
  } else if (numberOfIntPoint > 1) {

    // on récupère les coordonnées de la feature concernée 
    let feature = vectorIntPoint.getClosestFeatureToCoordinate(evt.coordinate);
    let featureCoord = utils.to4326(feature.getGeometry().getCoordinates());
    let featureCoordStr = featureCoord[0]+","+featureCoord[1];

    // -- on l'enlève du formulaire 
    let currentInputIntValue = currentInputInt.value.split("|");
    if (currentInputIntValue.length === 0) {
      return false;
    }

    let newIntArray = new Array();
    for (let i = 0; i < currentInputIntValue.length; i++) {
      if (currentInputIntValue[i] !== featureCoordStr) {
        newIntArray.push(currentInputIntValue[i]);
      }
    }

    let newIntValue = "";
    if (newIntArray.length === 0) {
      return false;
    } else {
      newIntValue = newIntArray[0];
      for (let j = 1; j < newIntArray.length; j++) {
        newIntValue = newIntValue + "|" + newIntArray[j];
      }
    }

    currentInputInt.value = newIntValue;
      
    // -- 

    // on le supprime du tableau des points intermédiaires cliqués 
    let pointIndice = clickedIntPoint.indexOf(featureCoordStr);
    clickedIntPoint.splice(pointIndice, 1);

    
  } else {
    return false;
  }

  // on enlève ce point de la carte quand on n'est certain que le formulaire est bien mis à jour 
  utils.deleteFeature(evt.coordinate, vectorIntPoint);

  return true;


} 

// ---- 


// ---- Calculer un itinéraire
// Cette fonction est appelée lorsque l'on clique sur un des boutons du formulaire 
function computeRoad() {

  // Déclarations
  let request = {};

  // on récupère les valeurs du formulaire
  request.finalStart = document.getElementById('userStart').value;
  request.finalEnd = document.getElementById('userEnd').value;
  request.finalIntermediates = document.getElementById('userIntermediates').value;

  // Gestion des points de l'utilisateur
  if ( request.finalStart === "" || request.finalEnd === "" ) {
    // il n'y a pas assez de points pour faire un itinéraire
    return false;
  } 

  // -- Gestion des paramètres de l'utilisateur
  // Si certains paramètres ne sont pas remplis dans le formulaire, il y a des valeurs par défaut

  loadUserParameter(request);
  
  // --

  // ---- Requete envoyée au nouveau service 
  let requestStr = road2Url +
    "resource=" + request.finalResource +
    "&profile=" + request.finalProfile +
    "&optimization=" + request.finalOptimization +
    "&start=" + request.finalStart +
    "&end="  + request.finalEnd +
    "&intermediates=" + request.finalIntermediates +
    "&constraints=" + request.finalConstraint +
    "&geometryFormat=polyline&getSteps=true&getBbox=true";

  // On affiche la requete sur la page 
  let requestDiv = document.getElementById('request');
  requestDiv.innerHTML = "<div class='card card-body'><a href='"+ requestStr + "'>"+requestStr+"</a></div>";  

  // on calcule l'itinéraire
  fetch(requestStr)
  .then(function(response) {
    return response.json();
  })
  .then(function(responseJSON) {

    utils.createRoute(responseJSON.geometry, "polyline", vectorRoad);

    // On affiche la réponse sur la page 
    let responseDiv = document.getElementById('response');
    responseDiv.innerHTML = "<div class='card card-body'><pre>"+ JSON.stringify(responseJSON, undefined, 2) +"</pre></div>";
    
  });
  // ---- 

  // ---- Requete envoyée à un autre service 
  // Si c'est demandé
  if (document.forms["comparison-form"].elements["compare-to-old"].checked) {

    computeOtherRoad(request);

  }
  // ---- 

  return true;

}
// ---- 

// ---- Calculer un itinéraire sur un autre service

function computeOtherRoad(request) {

  let otherRequest = {};

  // -- Prise en compte des paramètres utilisateurs 

  mapOtherParameter(request, otherRequest);
  
  // -- 

  let requestStr = oldUrl +
  "graphName=" + otherRequest.finalGraphName +
  "&method=" + otherRequest.finalMethod +
  "&origin=" + request.finalStart +
  "&destination="  + request.finalEnd +
  "&waypoints=" + otherRequest.finalIntermediates +
  "&exclusions=" + otherRequest.finalConstraint +
  "&srs=EPSG:4326";

  // On affiche la requete sur la page 
  let requestDiv = document.getElementById('request-other');
  requestDiv.innerHTML = "<div class='card card-body'><a href='" + requestStr + "'>" + requestStr + "</a></div>";
  
  // on calcule l'itinéraire
  fetch(requestStr)

  .then(function(response) {

      return response.json();

  })
  .then(function(responseJSON) {

    // On affiche la réponse sur la page 
    let responseDiv = document.getElementById('response-other');
    responseDiv.innerHTML = "<div class='card card-body'><pre>"+ JSON.stringify(responseJSON, undefined, 2) +"</pre></div>";

    // On affiche l'itinéraire sur la carte 
    utils.createRoute(responseJSON.geometryWkt, "wkt", vectorRoadOther);


  });


}
// ----

// ---- Charger les paramètres de l'utilisateur 

function loadUserParameter(request) {

  let constraintObject = {};

// Resource 
  if (document.forms["route-form"].elements["userResource"].value !== "") {
    request.finalResource = document.forms["route-form"].elements["userResource"].value;
  } else {
    request.finalResource = defaultResource;
  }
  // Profile
  if (document.forms["route-form"].elements["userProfile"].value !== "") {
    request.finalProfile = document.forms["route-form"].elements["userProfile"].value;
  } else {
    request.finalProfile = defaultProfile;
  }
  // Optimization
  if (document.forms["route-form"].elements["userOptimization"].value !== "") {
    request.finalOptimization = document.forms["route-form"].elements["userOptimization"].value;
  } else {
    request.finalOptimization = defaultOptimization;
  }
  // Constraint
  let  plural = false;
  request.finalConstraint = "";
  if (document.forms["route-form"].elements["banned-highway"].checked) {
    constraintObject.constraintType = "banned";
    constraintObject.key = "wayType";
    constraintObject.operator = "=";
    constraintObject.value = "autoroute";
    request.finalConstraint = JSON.stringify(constraintObject);
    plural = true;
  }
  if (document.forms["route-form"].elements["banned-tunnel"].checked) {
    if (plural) {
      request.finalConstraint = request.finalConstraint + "|";
    } else {
      plural = true;
    }
    constraintObject.constraintType = "banned";
    constraintObject.key = "wayType";
    constraintObject.operator = "=";
    constraintObject.value = "tunnel";
    request.finalConstraint = request.finalConstraint + JSON.stringify(constraintObject);
  }
  if (document.forms["route-form"].elements["banned-bridge"].checked) {
    if (plural) {
      request.finalConstraint = request.finalConstraint + "|";
    }
    constraintObject.constraintType = "banned";
    constraintObject.key = "wayType";
    constraintObject.operator = "=";
    constraintObject.value = "pont";
    request.finalConstraint = request.finalConstraint + JSON.stringify(constraintObject);
  }


}

// ---- 

// ---- Faire le lien avec l'autre service 
function mapOtherParameter(request, otherRequest) {

  // Ré-écriture des points intermédiaires 
  otherRequest.finalIntermediates = ""
  if (request.finalIntermediates !== "") {
    otherRequest.finalIntermediates = request.finalIntermediates.replace(/\|/gi,";");
  }

  // Profile
  if (document.forms["route-form"].elements["userProfile"].value !== "") {
    if (request.finalProfile === "car") {
      otherRequest.finalGraphName = "Voiture";
    } else if (request.finalProfile === "pedestrian") {
      otherRequest.finalGraphName = "Pieton";
    } else {
      otherRequest.finalGraphName = defaultGraphName;
    }
  } else {
    otherRequest.finalGraphName = defaultGraphName;
  }
  // Optimization
  if (document.forms["route-form"].elements["userOptimization"].value !== "") {
    if (request.finalOptimization === "fastest") {
      otherRequest.finalMethod = "time";
    } else if (request.finalOptimization === "shortest") {
      otherRequest.finalMethod = "distance";
    } else {
      otherRequest.finalMethod = defaultMethod;
    }
  } else {
    otherRequest.finalMethod = defaultMethod;
  }
  // Constraints
  let other = false;
  otherRequest.finalConstraint = "";
  if (document.forms["route-form"].elements["banned-highway"].checked) {
    otherRequest.finalConstraint = "Toll";
    other = true;
  } 
  if (document.forms["route-form"].elements["banned-tunnel"].checked) {
    if (other) {
      otherRequest.finalConstraint = otherRequest.finalConstraint + ";";
    } else {
      other = true;
    }
    otherRequest.finalConstraint = otherRequest.finalConstraint + "Tunnel";
  }
  if (document.forms["route-form"].elements["banned-bridge"].checked) {
    if (other) {
      otherRequest.finalConstraint = otherRequest.finalConstraint + ";";
    } 
    otherRequest.finalConstraint = otherRequest.finalConstraint + "Bridge";
  }


}
// ----

// ---- Supprimer l'itinéraire affiché sur la carte
// Cette fonction est appelée lorsque l'on clique sur un des boutons du formulaire 
function cancelMap() {

  // Nettoyage des vecteurs qui contiennent les données sur la map
  vectorRoad.clear();
  vectorRoadOther.clear();
  // Nettoyage des div qui concernent les itinéraires supprimés 
  let currentDiv = document.getElementById('request');
  currentDiv.innerHTML = "";
  currentDiv = document.getElementById('request-other');
  currentDiv.innerHTML = "";
  currentDiv = document.getElementById('response');
  currentDiv.innerHTML = "";
  currentDiv = document.getElementById('response-other');
  currentDiv.innerHTML = "";

}
// ---- 

// ---- Supprimer les paramètres du formulaire
// Cette fonction est appelée lorsque l'on clique sur un des boutons du formulaire 
function cancelForm() {

  // Nettoyage du formulaire
  document.getElementById("route-form").reset(); 

  // Nettoyage des tableaux qui contiennent les points
  clickedStartPoint = new Array();
  clickedEndPoint = new Array();
  clickedIntPoint = new Array();

  // Nettoyage du vecteur qui contient les données sur la map
  vectorStartPoint.clear();
  vectorEndPoint.clear();
  vectorIntPoint.clear();

}
// ---- 

var utils = {

  to4326: function(coord) {
    return ol.proj.transform([
      parseFloat(coord[0]), parseFloat(coord[1])
    ], 'EPSG:3857', 'EPSG:4326');
  },

  createFeature: function(coord, vector) {
    var feature = new ol.Feature({
      type: 'place',
      geometry: new ol.geom.Point(ol.proj.fromLonLat(coord))
    });
    feature.setStyle(styles.icon);
    vector.addFeature(feature);
  },

  deleteFeature: function(coord, vector) {
    let feature = vector.getClosestFeatureToCoordinate(coord);
    vector.removeFeature(feature);
  },

  createRoute: function(geom, format, vector) {

    let route = {};

    if (format === "polyline") {

      route = new ol.format.Polyline({
        factor: 1e5
      }).readGeometry(geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });

    } else if (format === "wkt") {
      route = new ol.format.WKT().readGeometry(geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    } else {
      return false;
    }
    

    let feature = new ol.Feature({
      type: 'route',
      geometry: route
    });

    if (format === "polyline") {
      feature.setStyle(styles.routePolyline);
    } else if (format === "wkt") {
      feature.setStyle(styles.routeWkt);
    } else {

    }
    
    vector.addFeature(feature);
  }

};
