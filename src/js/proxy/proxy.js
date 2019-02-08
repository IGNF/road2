'use strict';

module.exports = {

  /**
  *
  * @function
  * @name computeRequest
  * @description Fonction utilisée pour rediriger une requête vers le bon moteur.
  * Une requête se fait nécessairement sur une ressource. Cette ressource est indiquée dans la requête.
  * En fonction de la ressource, et potentiellement de plusieurs autres paramètres, cette fonction permettra
  * de renvoyer la requête vers le bon moteur.
  * @param {Request} request - Requête
  * @param {function} callback - Callback de succès et d'erreur qui sera transmise au moteur pour la fin de son calcul
  *
  */

  computeRequest: function(request, callback) {

    // Récupération de la ressource
    // ---
    // L'id est dans la requête
    var resourceId = request.resource;
    // La ressource est dans le catalogue du service
    var resource = global.service.getResourceById(resourceId);
    // ---

    // Récupération de la source concernée par la requête
    // ---
    // L'id est donné par le ressource
    var sourceId = resource.getSourceIdFromRequest(request);
    // La source est dans le catalogue du service
    var source = global.service.getSourceById(sourceId);
    // ---

    //On renvoie la requête vers le moteur
    // ---
    // C'est la source qui fait le lien avec un moteur
    source.computeRequest(request,callback);
    // ---

  }



}
