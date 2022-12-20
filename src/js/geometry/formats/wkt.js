'use strict';

module.exports = {


  /**
   *
   * @function
   * @name validateWKT
   * @description Vérification d'un WKT
   * @param {string} wktString - WKT à convertir
   * @return {boolean|string}  
   *
   */

  validateWKT: function(wktString) {

    if (!wktString) {
        return "L'argument est vide";
    }
    if (typeof(wktString) !== "string") {
        return "L'argument n'est pas une chaîne";
    }

    // Taille minimal d'un WKT (ex. 'POINT(2 2)')
    if (wktString.length < 10) {
      return "La chaine est trop courte";
    }

    // On nettoie la chaîne pour faciliter les vérifications qui suivront 
    let cleanWKT = this.cleanWKT(wktString);

    // On vérifie un mimimum de contenu
    let splitWkt = cleanWKT.match(/^(SRID:\d+;)?(POINT|LINESTRING|POLYGON|GEOMETRYCOLLECTION)\((.*)\)$/);
    if (splitWkt === null) {
      return "La chaine nettoyee ne peut etre splittee";
    } 
    if (splitWkt.length < 3) {
      return "Le split de la chaine n'est pas valide: " + splitWkt;
    }

    // On récupère la partie qu'il reste à analyser
    let geometryType = "";
    let geometry = "";
    if (splitWkt.length === 4) {
      // il y a un SRID
      geometryType = splitWkt[2];
      geometry = splitWkt[3];
    } else {
      geometryType = splitWkt[1];
      geometry = splitWkt[2];
    }
      
    if (geometryType === "POINT") {
      if (this._validatePointGeometry(geometry)) {
        return true;
      }
    } else if (geometryType === "LINESTRING") {
      if (this._validateLinestringGeometry(geometry)) {
        return true;
      }
    } else if (geometryType === "POLYGON") {
      if (this._validatePolygonGeometry(geometry)) {
        return true;
      }
    } else if (geometryType === "GEOMETRYCOLLECTION") {
      return this._validateGeometryCollection(geometry);
    } else {
      return "geometryType est inconnu: " + geometryType;
    }

    return "La validation a echoue";

  },

  /**
  *
  * @function
  * @name cleanWKT
  * @description Nettoyage d'un WKT 
  * @param {string} wktString - WKT à convertir
  * @return {string} cleanedWktString - WKT nettoyé
  *
  */

   cleanWKT: function(wktString) {

    let tmpWKT = wktString.replaceAll(/\s{2,}/g,' ');

    tmpWKT = tmpWKT.replace(/^\s/,'');
    tmpWKT = tmpWKT.replace(/\s$/,'');
    tmpWKT = tmpWKT.replaceAll(/\s,/g,',');
    tmpWKT = tmpWKT.replaceAll(/,\s/g,',');
    tmpWKT = tmpWKT.replaceAll(/\(\s/g,'(');
    tmpWKT = tmpWKT.replaceAll(/\s\(/g,'(');
    tmpWKT = tmpWKT.replaceAll(/\)\s/g,')');
    tmpWKT = tmpWKT.replaceAll(/\s\)/g,')');

    return tmpWKT.toUpperCase();

  },

  /**
  *
  * @function
  * @name _validatePointGeometry
  * @description Validation d'un WKT de type POINT
  * @param {string} geometry - Partie du WKT qui contient la géométrie (ici une paire de coordonnées est attendu)
  * @return {boolean} 
  *
  */

  _validatePointGeometry: function(geometry) {

    let regex = new RegExp(/^-?\d+\.?\d*\s-?\d+\.?\d*\s?-?\d+\.?\d*$/);
    return regex.test(geometry);

  },

  /**
  *
  * @function
  * @name _validateLinestringGeometry
  * @description Validation d'un WKT de type LINESTRING
  * @param {string} geometry - Partie du WKT qui contient la géométrie (ici plusieurs paires de coordonnées séparées par des ',' sont attendues)
  * @return {boolean} 
  *
  */

   _validateLinestringGeometry: function(geometry) {

    let regex = new RegExp(/^(-?\d+\.?\d*\s-?\d+\.?\d*(\s-?\d+\.?\d*)?,?){2,}$/);
    return regex.test(geometry);

  },

  /**
  *
  * @function
  * @name _validatePolygonGeometry
  * @description Validation d'un WKT de type POLYGON
  * @param {string} geometry - Partie du WKT qui contient la géométrie (ici plusieurs paires de coordonnées séparées par des ',' et regroupées dans des '()' sont attendues)
  * @return {boolean} 
  *
  */

   _validatePolygonGeometry: function(geometry) {

    let regex = new RegExp(/^\((-?\d+\.?\d*\s-?\d+\.?\d*(\s-?\d+\.?\d*)?,?){3,}\)(,\((-?\d+\.?\d*\s-?\d+\.?\d*(\s-?\d+\.?\d*)?,?){3,}\))?$/);
    return regex.test(geometry);
      
  },

  /**
  *
  * @function
  * @name _validateGeometryCollectionGeometry
  * @description Validation d'un WKT de type GEOMETRYCOLLECTION
  * @param {string} geometry - Partie du WKT qui contient la géométrie (ici plusieurs paires de coordonnées séparées par des ',' et regroupées dans des '()' sont attendues)
  * @return {boolean} 
  *
  */

   _validateGeometryCollection: function(geometry) {

    let matches = geometry.matchAll(/([A-Z]+)/g);
    
    if (matches === null) {
      return "La gemetrie ne peut etre analysee";
    }

    matches = Array.from(matches);

    for (let i = 0; i < matches.length; i++) {

      let curGeometry = "";
      if (i === matches.length-1) {
        curGeometry = geometry.substring(matches[i]['index']+matches[i][1].length);
      } else {
        curGeometry = geometry.substring(matches[i]['index']+matches[i][1].length,matches[i+1]['index']-1);
      }
      curGeometry = curGeometry.substring(1,curGeometry.length-1);
      
      if (matches[i][1] === "POINT") {
        if (!this._validatePointGeometry(curGeometry)) {
          return "La gemetrie " + i + " point de la collection est invalide";
        }
      } else if (matches[i][1] === "LINESTRING") {
        if (!this._validateLinestringGeometry(curGeometry)) {
          return "La gemetrie " + i + " linestring de la collection est invalide";
        }
      } else if (matches[i][1] === "POLYGON") {
        if (!this._validatePolygonGeometry(curGeometry)) {
          return "La gemetrie " + i + " polygon de la collection est invalide";
        }
      } else {
        return "geometryType est inconnu: " + matches[i][1];
      }

    }

    return true;
    
  },

  /**
  *
  * @function
  * @name toGeoJSON
  * @description Conversion d'un WKT en GeoJSON
  * @param {string} wktString - WKT à convertir
  * @return {object|string} JSON 
  *
  */

  toGeoJSON: function(wktString) {

    let finalGeoJSON = {};

    let splitWkt = this.cleanWKT(wktString).match(/^(SRID:\d+;)?(POINT|LINESTRING|POLYGON|GEOMETRYCOLLECTION)\((.*)\)$/)
    let geometryType = "";
    let geometry = "";
    if (splitWkt.length === 4) {
      // il y a un SRID
      geometryType = splitWkt[2];
      geometry = splitWkt[3];
    } else {
      geometryType = splitWkt[1];
      geometry = splitWkt[2];
    }

    if (geometryType === "GEOMETRYCOLLECTION") {
      finalGeoJSON = this._toGeometryCollection(geometry);
    } else {
      finalGeoJSON = this._toGeometry(geometryType, geometry);
    }

    return finalGeoJSON;
    
  },

  /**
  *
  * @function
  * @name _toGeometry
  * @description Conversion d'un WKT en géométrie de GeoJSON
  * @param {string} geometryType - Type de la géométrie (selon le WKT d'origine)
  * @param {string} geometry - Géométrie à convertir (selon le WKT d'origine)
  * @return {object|string} JSON 
  *
  */

   _toGeometry: function(geometryType, geometry) {

    const mapping = {
      POINT:"Point",
      LINESTRING:"LineString",
      POLYGON:"Polygon"
    };

    geometry = geometry.replaceAll(/(-?\d+\.?\d*)\s(-?\d+\.?\d*)\s(-?\d+\.?\d*)/g,"[$1,$2,$3]");
    geometry = geometry.replaceAll(/(-?\d+\.?\d*)\s(-?\d+\.?\d*)/g,"[$1,$2]");
    geometry = geometry.replaceAll(/\(/g,"[");
    geometry = geometry.replaceAll(/\)/g,"]");

    if (geometryType === "LINESTRING") {
      geometry = "[" + geometry + "]";
    }
    if (geometryType === "POLYGON") {
      geometry = geometry.replaceAll(/\),\(/g,"],[");
      geometry = "[" + geometry + "]";
    }
    geometry = JSON.parse(geometry);

    return {
        "type": mapping[geometryType],
        "coordinates": geometry
      };

  },

  /**
  *
  * @function
  * @name _toGeometryCollection
  * @description Conversion d'un WKT en GeoJSON
  * @param {string} geometry - Géométrie à convertir (selon le WKT d'origine)
  * @return {object|string} JSON 
  *
  */

   _toGeometryCollection: function(geometry) {

    let geometryCollection = {
      "type": "GeometryCollection",
      "geometries": new Array()
    };

    let matches = Array.from(geometry.matchAll(/([A-Z]+)/g));

    for (let i = 0; i < matches.length; i++) {

      let curGeometry = "";
      if (i === matches.length-1) {
        curGeometry = geometry.substring(matches[i]['index']+matches[i][1].length);
      } else {
        curGeometry = geometry.substring(matches[i]['index']+matches[i][1].length,matches[i+1]['index']-1);
      }
      curGeometry = curGeometry.substring(1,curGeometry.length-1);

      geometryCollection.geometries.push(this._toGeometry(matches[i][1], curGeometry));

    }

    return geometryCollection;

  },

  /**
  *
  * @function
  * @name fromGeoJSON
  * @description Conversion d'un GeoJSON en WKT
  * @param {JSON} jsonObject - JSON à convertir
  * @return {string} wktString 
  *
  */

   fromGeoJSON: function(jsonObject) {    

    if (jsonObject.type === "Point") {

      return this._fromPoint(jsonObject);

    } else if (jsonObject.type === "LineString") {

      return this._internalFrom(jsonObject,"LINESTRING");

    } else if (jsonObject.type === "Polygon") {

      return this._internalFrom(jsonObject,"POLYGON");

    } else if (jsonObject.type === "GeometryCollection") {

      let arrayWkt = new Array();
      for(let geometry of jsonObject.geometries) {
        arrayWkt.push(this.fromGeoJSON(geometry));
      }
      return "GEOMETRYCOLLECTION(" + arrayWkt.toString() + ")";
      
    } else {
      return "";
    }
    
  },

  /**
  *
  * @function
  * @name _fromPoint
  * @description Conversion d'un GeoJSON en WKT
  * @param {JSON} jsonObject - JSON à convertir
  * @return {string} wktString 
  *
  */

  _fromPoint: function(jsonObject) { 

    let geometry = JSON.stringify(jsonObject.coordinates);
    geometry = geometry.replaceAll(/\[(-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*)\]/g,"($1 $2 $3)");
    geometry = geometry.replaceAll(/\[(-?\d+\.?\d*),(-?\d+\.?\d*)\]/g,"($1 $2)");
    return "POINT"+geometry;

  },

  /**
  *
  * @function
  * @name _internalFrom
  * @description Conversion d'un GeoJSON en WKT
  * @param {JSON} jsonObject - JSON à convertir
  * @return {string} wktString 
  *
  */

   _internalFrom: function(jsonObject, type) { 

    let geometry = JSON.stringify(jsonObject.coordinates);
    geometry = geometry.replaceAll(/\[(-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*)\]/g,"$1 $2 $3");
    geometry = geometry.replaceAll(/\[(-?\d+\.?\d*),(-?\d+\.?\d*)\]/g,"$1 $2");
    geometry = geometry.replaceAll(/\[/g,"(");
    geometry = geometry.replaceAll(/\]/g,")");
    return type+geometry;

  }


}