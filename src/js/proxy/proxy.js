'use strict';

// Création du LOGGER
var LOGGER = global.log4js.getLogger("PROXY");

module.exports = {

  /**
  *
  * @function
  * @name computeRoute
  * @description Fonction utilisée pour rediriger une requête de calcul d'itinéraire vers le bon moteur.
  * Une requête se fait nécessairement sur une ressource. Cette ressource est indiquée dans la requête.
  * En fonction de la ressource, et potentiellement de plusieurs autres paramètres, cette fonction permettra
  * de renvoyer la requête vers le bon moteur.
  *
  */

  computeRoute: function(routeRequest, callbackSuccess, callbackError) {

    var typeFound = false;

    // Récupération de la ressource et de son type

    // L'id est dans la requête
    var resourceId = routeRequest.resource;
    // La ressource est dans le catalogue du service
    var resource = global.service.getResourceById(resourceId);
    var resourceType = resource.type;

    // On renvoie la requête vers le moteur

    // Cas de la ressource OSRM
    // Partie à copier pour ajouter la gestion d'un nouveau type de ressource
    // ---
    if (resourceType == "osrm") {

      typeFound = true;
      // Envoie de la requête
      var routeResponse = {response: true};
      // FIXME: faut-il utiliser return avec les callback ?
      callbackSuccess(routeResponse);

    } else {
      // On va regarder si c'est un autre type
    }
    // ---

    // Cette erreur  n'est pas censé arrivé si on a bien vérifié la validité et la disponibilité de la ressource requêtée.
    if (!typeFound) {
      // FIXME: faut-il utiliser return avec les callback ?
      callbackError("Invalid resource type.");
    }

  }



}
