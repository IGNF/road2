'use strict';

const fs = require('fs');

const SUPPORTED_OPERATIONS = ["route", "isochrone"];
const SUPPORTED_METHODS = ["GET", "POST"];
const SUPPORTED_RESPONSE_FORMATS = {
  "route": ["osrm"],
  "isochrone": ["geojson"]
};
const DIRECTIVES = ["$for", "$if", "$divide", "$multiply", "$lookup", "$fromEntries", "$concat", "$join", "$merge"];

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
      return render(node.$lookup.table[key], context);
    }
    return render(node.$lookup.default, context);
  }

  if (node.$fromEntries !== undefined) {
    const list = resolvePath(context, node.$fromEntries.from);
    if (!Array.isArray(list)) {
      return undefined;
    }
    const result = {};
    list.forEach((item, index) => {
      const itemContext = {...context, item, index};
      const key = render(node.$fromEntries.key, itemContext);
      const value = render(node.$fromEntries.value, itemContext);
      if (key !== undefined && value !== undefined) {
        result[key] = value;
      }
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
    const separator = node.$join.separator === undefined ? "," : node.$join.separator;
    return list.map((item, index) => render(node.$join.as, {...context, item, index})).join(separator);
  }

  if (node.$merge !== undefined) {
    if (!Array.isArray(node.$merge)) {
      return undefined;
    }
    return node.$merge
      .map((value) => render(value, context))
      .filter((value) => value !== null && typeof value === "object" && !Array.isArray(value))
      .reduce((result, value) => ({...result, ...value}), {});
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

function isObject(node) {
  return node !== null && typeof node === "object" && !Array.isArray(node);
}

function isPath(value) {
  return typeof value === "string" && value.trim() !== "";
}

function checkTemplate(node) {
  if (Array.isArray(node)) {
    for (const n of node) {
      const error = checkTemplate(n);
      if (error) {
        return error;
      }
    }
  } else if (isObject(node)) {
    const keys = Object.keys(node);
    const directives = keys.filter((key) => key.startsWith("$") && !key.startsWith("${"));
    if (directives.length === 0) {
      return checkTemplate(Object.values(node));
    }

    const directive = directives.find((key) => DIRECTIVES.includes(key));
    if (!directive) {
      return "directive inconnue '" + directives[0] + "'";
    }

    const value = node[directive];
    let allowedKeys = [directive];
    let templates = [];
    let valid = true;
    switch (directive) {
      case "$for":
        allowedKeys = [directive, "$as"];
        valid = isPath(value) && node.$as !== undefined;
        templates = [node.$as];
        break;
      case "$if":
        allowedKeys = [directive, "$then", "$else"];
        valid = isPath(value) && node.$then !== undefined;
        templates = [node.$then, node.$else];
        break;
      case "$divide":
      case "$multiply":
        valid = Array.isArray(value) && value.length === 2;
        templates = value;
        break;
      case "$concat":
      case "$merge":
        valid = Array.isArray(value);
        templates = value;
        break;
      case "$lookup":
        valid = isObject(value) && value.value !== undefined && isObject(value.table) &&
          Object.keys(value).every((key) => ["value", "table", "default"].includes(key));
        if (valid) {
          templates = [value.value, ...Object.values(value.table), value.default];
        }
        break;
      case "$fromEntries":
      case "$join": {
        const fields = directive === "$fromEntries" ? ["from", "key", "value"] : ["from", "as", "separator"];
        valid = isObject(value) && isPath(value.from) && Object.keys(value).every((key) => fields.includes(key));
        if (valid && directive === "$fromEntries") {
          valid = value.key !== undefined && value.value !== undefined;
          templates = [value.key, value.value];
        } else if (valid) {
          valid = value.as !== undefined && (value.separator === undefined || typeof value.separator === "string");
          templates = [value.as];
        }
        break;
      }
    }

    if (!valid || keys.some((key) => !allowedKeys.includes(key))) {
      return "structure invalide pour la directive '" + directive + "'";
    }
    return checkTemplate(templates);
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

    const templateError = checkTemplate([conf.path, conf.query, conf.body, conf.headers]);
    if (templateError) {
      return templateError + " dans l'opération '" + operation + "'";
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
