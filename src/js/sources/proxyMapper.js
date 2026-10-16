'use strict';

const fs = require('fs');

const SUPPORTED_OPERATIONS = ["route", "isochrone"];
const SUPPORTED_METHODS = ["GET", "POST"];
const SUPPORTED_RESPONSE_FORMATS = {
  "route": ["osrm"],
  "isochrone": ["geojson"]
};
const DIRECTIVES = ["$for", "$if", "$divide", "$multiply", "$lookup", "$fromEntries", "$concat", "$join"];

/**
*
* @function
* @name resolvePath
* @description Résoudre un chemin pointé (ex: "cost.costing" ou "coordinates.0") dans un contexte.
* @param {object} context - Contexte
* @param {string} path - Chemin
* @return {*} undefined si le chemin n'existe pas
*
*/
function resolvePath(context, path) {
  let current = context;
  for (const key of path.trim().split(".")) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

function isTruthy(value) {
  return value !== undefined && value !== null && value !== false && value !== "" && !(Array.isArray(value) && value.length === 0);
}

function renderString(str, context) {
  // Une chaîne composée uniquement d'un placeholder conserve le type de la valeur
  const whole = str.match(/^\$\{([^}]+)\}$/);
  if (whole) {
    return resolvePath(context, whole[1]);
  }
  return str.replace(/\$\{([^}]+)\}/g, (match, path) => {
    const value = resolvePath(context, path);
    return value === undefined || value === null ? "" : String(value);
  });
}

function renderNumber(node, context) {
  const value = render(node, context);
  return typeof value === "string" ? Number(value) : value;
}

/**
*
* @function
* @name render
* @description Évaluer un template de mapping avec un contexte.
* Les valeurs qui s'évaluent à undefined sont omises des objets et tableaux.
* @param {*} node - Template (chaîne, tableau, objet ou valeur scalaire)
* @param {object} context - Variables disponibles pour les placeholders ${...}
* @return {*}
*
*/
function render(node, context) {

  if (typeof node === "string") {
    return renderString(node, context);
  }

  if (Array.isArray(node)) {
    return node.map((n) => render(n, context)).filter((v) => v !== undefined);
  }

  if (node === null || typeof node !== "object") {
    return node;
  }

  if (node.$for !== undefined) {
    const list = resolvePath(context, node.$for);
    if (!Array.isArray(list)) {
      return undefined;
    }
    return list.map((item, index) => render(node.$as, {...context, item, index})).filter((v) => v !== undefined);
  }

  if (node.$if !== undefined) {
    if (isTruthy(resolvePath(context, node.$if))) {
      return render(node.$then, context);
    }
    return node.$else === undefined ? undefined : render(node.$else, context);
  }

  if (node.$divide !== undefined) {
    return renderNumber(node.$divide[0], context) / renderNumber(node.$divide[1], context);
  }

  if (node.$multiply !== undefined) {
    return renderNumber(node.$multiply[0], context) * renderNumber(node.$multiply[1], context);
  }

  if (node.$lookup !== undefined) {
    const key = render(node.$lookup.value, context);
    if (key !== undefined && Object.prototype.hasOwnProperty.call(node.$lookup.table, key)) {
      return node.$lookup.table[key];
    }
    return node.$lookup.default;
  }

  if (node.$fromEntries !== undefined) {
    const list = resolvePath(context, node.$fromEntries.from);
    if (!Array.isArray(list)) {
      return undefined;
    }
    const result = {};
    list.forEach((item, index) => {
      const itemContext = {...context, item, index};
      result[render(node.$fromEntries.key, itemContext)] = render(node.$fromEntries.value, itemContext);
    });
    return result;
  }

  if (node.$concat !== undefined) {
    return node.$concat.map((n) => render(n, context)).filter((v) => v !== undefined && v !== null).join("");
  }

  if (node.$join !== undefined) {
    const list = resolvePath(context, node.$join.from);
    if (!Array.isArray(list)) {
      return undefined;
    }
    return list.map((item, index) => render(node.$join.as, {...context, item, index})).join(node.$join.separator || ",");
  }

  const result = {};
  for (const key of Object.keys(node)) {
    const value = render(node[key], context);
    if (value !== undefined) {
      // Les clés peuvent contenir des placeholders (ex: "${cost.costing}")
      result[renderString(key, context)] = value;
    }
  }
  return result;

}

function findUnknownDirective(node) {
  if (Array.isArray(node)) {
    for (const n of node) {
      const found = findUnknownDirective(n);
      if (found) {
        return found;
      }
    }
  } else if (node !== null && typeof node === "object") {
    for (const key of Object.keys(node)) {
      if (key.startsWith("$") && !key.startsWith("${") && !DIRECTIVES.includes(key) && !["$as", "$then", "$else"].includes(key)) {
        return key;
      }
      const found = findUnknownDirective(node[key]);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
*
* @function
* @name checkMapping
* @description Vérifier la structure d'un mapping.
* @param {object} mapping - Mapping des opérations
* @return {string|null} Message d'erreur ou null si le mapping est valide
*
*/
function checkMapping(mapping) {

  if (mapping === null || typeof mapping !== "object" || Array.isArray(mapping)) {
    return "le mapping n'est pas un objet";
  }

  const operations = Object.keys(mapping);
  if (operations.length === 0) {
    return "le mapping ne contient aucune opération";
  }

  for (const operation of operations) {

    if (!SUPPORTED_OPERATIONS.includes(operation)) {
      return "l'opération '" + operation + "' n'est pas supportée";
    }

    const conf = mapping[operation];
    if (conf === null || typeof conf !== "object") {
      return "la configuration de l'opération '" + operation + "' est invalide";
    }
    if (typeof conf.path !== "string" && (conf.path === null || typeof conf.path !== "object")) {
      return "'" + operation + ".path' absent";
    }
    if (conf.method !== undefined && !SUPPORTED_METHODS.includes(conf.method)) {
      return "'" + operation + ".method' doit valoir " + SUPPORTED_METHODS.join(" ou ");
    }
    if (!conf.response || !SUPPORTED_RESPONSE_FORMATS[operation].includes(conf.response.format)) {
      return "'" + operation + ".response.format' doit valoir " + SUPPORTED_RESPONSE_FORMATS[operation].join(" ou ");
    }

    const unknown = findUnknownDirective([conf.path, conf.query, conf.body]);
    if (unknown) {
      return "directive inconnue '" + unknown + "' dans l'opération '" + operation + "'";
    }

  }

  return null;

}

/**
*
* @function
* @name loadMappingFile
* @description Lire un fichier de mapping JSON.
* @param {string} file - Chemin du fichier
* @return {object}
*
*/
function loadMappingFile(file) {
  return JSON.parse(fs.readFileSync(file));
}

module.exports = { render, resolvePath, checkMapping, loadMappingFile, SUPPORTED_OPERATIONS };
