// ---- Variables Globales

var road2Url = "http://localhost:8080/simple/1.0.0/isochrone?";
var oldUrl = "https://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/isochrone/isochrone.json?"
var map;
var clickedPoint = new Array();

// -- Variables par défaut que l'utilisateur peut modifier
var defaultResource = "bduni-idf-pgr";
var defaultProfile = "car";
var defaultCostType = "time";
var defaultDirection = "departure";
var defaultGraphName = "Voiture";
var defaultMethod = "time";
var defaultReverse = "false"
// --

// -- Variables pour la carte

// Vecteurs qui vont contenir les éléments de l'itineraire sur la carte
var vectorRoad = new ol.source.Vector();
var vectorRoadOther = new ol.source.Vector();
var vectorPoint = new ol.source.Vector();

// Couches de la carte qui vont afficher l'itinéraire
var vectorRoadLayer = new ol.layer.Vector({
  source: vectorRoad
});

var vectorRoadOtherLayer = new ol.layer.Vector({
  source: vectorRoadOther
});

var vectorPointLayer = new ol.layer.Vector({
  source: vectorPoint
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
    callback: definePoint
  }
];


// ----

// Fonction pour créer la carte
function createMap() {

    map = new ol.Map({
        target: 'map-isochrone',
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
            vectorPointLayer
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
            title: 'Isochrones via Road2'
          }
        },
        {
          layer: vectorRoadOtherLayer,
          config: {
            title: 'Isochrones via autre service'
          }
        },
        {
          layer: vectorPointLayer,
          config: {
            title: 'Point de l\'isochrone'
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
// Et tout cela en intéragissant avec le formulaire des paramètres de l'isochrone
function definePoint(evt) {

  // on récupère les coordonnées du point cliqué
  let clickedCoordinate = utils.to4326(evt.coordinate);

  if (clickedPoint.length !== 0) {
    clickedPoint = new Array();
    vectorPoint.clear();
  }

  // on stocke les coordonnées pour pouvoir lancer un isochrone
  clickedPoint.push(clickedCoordinate);

  // on met les coordonnées dans le formulaire (point)
  let input = document.getElementById('userPoint');
  input.value = clickedCoordinate;

  // on affiche ce point sur la carte
  utils.createFeature(clickedCoordinate, vectorPoint);

  return true;

}

// ----


// ---- Calculer un isochrone
// Cette fonction est appelée lorsque l'on clique sur un des boutons du formulaire
function computeIso() {

  // Déclarations
  let request = {};

  // on récupère les valeurs du formulaire
  request.finalPoint = document.getElementById('userPoint').value;
  request.finalCostValue = document.getElementById('userCostValue').value;

  // Gestion des points de l'utilisateur
  if ( request.finalPoint === "" || request.finalCostValue === "") {
    // il n'y a pas de points ou de valeur pour l'isochrone
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
    "&costType=" + request.finalCostType +
    "&costValue=" + request.finalCostValue +
    "&direction=" + request.finalDirection +
    "&point=" + request.finalPoint +
    "&constraints=" + request.finalConstraint +
    "&geometryFormat=geojson";

  // On affiche la requete sur la page
  let requestDiv = document.getElementById('request');
  requestDiv.innerHTML = "<div class='card card-body'><a href='"+ requestStr + "'>"+requestStr+"</a></div>";

  // on calcule l'itinéraire
  fetch(requestStr)
  .then(function(response) {
    return response.json();
  })
  .then(function(responseJSON) {

    utils.createIso(responseJSON.geometry, "geojson", vectorRoad);

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
  "&location=" + request.finalPoint +
  "&reverse=" + otherRequest.finalReverse +
  "&exclusions=" + otherRequest.finalConstraint +
  "&srs=EPSG:4326&smoothing=true&holes=false";

  if (otherRequest.finalMethod === "time") {
    requestStr = requestStr + "&time=" + request.finalCostValue;
  } else if (otherRequest.finalMethod === "distance") {
    requestStr = requestStr + "&distance=" + request.finalCostValue;
  } else {
    return false;
  }

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
    utils.createIso(responseJSON.wktGeometry, "wkt", vectorRoadOther);


  });


}
// ----

// ---- Charger les paramètres de l'utilisateur

function loadUserParameter(request) {

  let constraintObject = {};

// Resource
  if (document.forms["iso-form"].elements["userResource"].value !== "") {
    request.finalResource = document.forms["iso-form"].elements["userResource"].value;
    if (request.finalResource === "otherResource") {
      if (document.forms["iso-form"].elements["userResourceValue"].value !== "") {
        request.finalResource = document.forms["iso-form"].elements["userResourceValue"].value;
      } else {
        request.finalResource = defaultResource;
      }
    }
  } else {
    request.finalResource = defaultResource;
  }

  // Profile
  if (document.forms["iso-form"].elements["userProfile"].value !== "") {
    request.finalProfile = document.forms["iso-form"].elements["userProfile"].value;
  } else {
    request.finalProfile = defaultProfile;
  }
  // CostType
  if (document.forms["iso-form"].elements["userCostType"].value !== "") {
    request.finalCostType = document.forms["iso-form"].elements["userCostType"].value;
  } else {
    request.finalCostType = defaultCostType;
  }
  // Direction
  if (document.forms["iso-form"].elements["userDirection"].value !== "") {
    request.finalDirection = document.forms["iso-form"].elements["userDirection"].value;
  } else {
    request.finalDirection = defaultDirection;
  }
  // Constraint
  let  plural = false;
  request.finalConstraint = "";
  if (document.forms["iso-form"].elements["banned-highway"].checked) {
    constraintObject.constraintType = "banned";
    constraintObject.key = "wayType";
    constraintObject.operator = "=";
    constraintObject.value = "autoroute";
    request.finalConstraint = JSON.stringify(constraintObject);
    plural = true;
  }
  if (document.forms["iso-form"].elements["banned-tunnel"].checked) {
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
  if (document.forms["iso-form"].elements["banned-bridge"].checked) {
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

  // Profile
  if (document.forms["iso-form"].elements["userProfile"].value !== "") {
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
  // CostType
  if (document.forms["iso-form"].elements["userCostType"].value !== "") {
    if (request.finalCostType === "time") {
      otherRequest.finalMethod = "time";
    } else if (request.finalCostType === "distance") {
      otherRequest.finalMethod = "distance";
    } else {
      otherRequest.finalMethod = defaultMethod;
    }
  } else {
    otherRequest.finalMethod = defaultMethod;
  }
  // Direction
  if (document.forms["iso-form"].elements["userDirection"].value !== "") {
    if (request.finalDirection === "departure") {
      otherRequest.finalReverse = "false";
    } else if (request.finalDirection === "arrival") {
      otherRequest.finalReverse = "true";
    } else {
      otherRequest.finalReverse = defaultReverse;
    }
  } else {
    otherRequest.finalReverse = defaultReverse;
  }
  // Constraints
  let other = false;
  otherRequest.finalConstraint = "";
  if (document.forms["iso-form"].elements["banned-highway"].checked) {
    otherRequest.finalConstraint = "Toll";
    other = true;
  }
  if (document.forms["iso-form"].elements["banned-tunnel"].checked) {
    if (other) {
      otherRequest.finalConstraint = otherRequest.finalConstraint + ";";
    } else {
      other = true;
    }
    otherRequest.finalConstraint = otherRequest.finalConstraint + "Tunnel";
  }
  if (document.forms["iso-form"].elements["banned-bridge"].checked) {
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
  // Nettoyage des div qui concernent les isochrones supprimés
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
  document.getElementById("iso-form").reset();

  // Nettoyage des tableaux qui contiennent les points
  clickedPoint = new Array();

  // Nettoyage du vecteur qui contient les données sur la map
  vectorPoint.clear();


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

  createIso: function(geom, format, vector) {

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
    } else if (format === "geojson") {
      route = new ol.format.GeoJSON().readGeometry(geom, {
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
    } else if (format === "geojson") {
      feature.setStyle(styles.routePolyline);
    } else {

    }

    vector.addFeature(feature);
  }

};
