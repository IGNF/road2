# Source et ressource de type proxy

Une source `proxy` ne calcule rien : elle traduit la requête Road2 (`route`, `isochrone`) en requête HTTP vers un service distant (par exemple Valhalla déployé via son image Docker), puis convertit la réponse au format Road2. Une ressource de type `proxy` s'appuie sur ces sources.

Exemples : `proxy.source`, `valhalla-proxy.mapping` et `../resources/proxy.resource`.

## Configuration de la source

| Clé | Description |
|---|---|
| `type` | `proxy` |
| `proxy.url` | URL du service (http/https) |
| `proxy.timeout` | Timeout en ms (optionnel, 30000 par défaut) |
| `proxy.mapping` | Chemin du fichier de mapping, ou objet de mapping en ligne |
| `costs[]` | `profile`, `optimization`, `costType` pour le choix de la source, et `parameters` : variables libres accessibles dans le mapping sous `cost.*` |

Le nom de la ressource est son `id` dans le fichier `.resource`.

## Fichier de mapping

Un objet par opération (`route`, `isochrone`) :

- `method` : `GET` ou `POST` (défaut `POST`)
- `path` : chemin ajouté à `proxy.url`
- `query` : paramètres d'URL (template)
- `body` : corps JSON (template, pour `POST`)
- `headers` : en-têtes (template)
- `response.format` : `osrm` (route) ou `geojson` (isochrone) ; `response.root` : chemin pointé vers la réponse utile ; `response.polylinePrecision` : précision des polylines (5 par défaut)

### Variables disponibles

- route : `coordinates` (liste de `[x, y]` dans la projection de la source), `start`, `end`, `intermediates`, `optimization`
- isochrone : `point`, `costType`, `costValue`, `direction`
- communes : `resource`, `profile`, `date_time`, `constraints` (champs bannis), `cost` (`costs[].parameters`)

### Templates

`$merge` fusionne les objets rendus et donne priorité aux clés des objets suivants.

- `"${variable.chemin}"` : valeur typée si c'est toute la chaîne, sinon interpolation. Fonctionne aussi dans les clés.
- Les valeurs indéfinies sont omises.
- `{"$for": "liste", "$as": template}` : itération (`item`, `index`)
- `{"$if": "variable", "$then": t, "$else": t}`
- `{"$divide": [a, b]}`, `{"$multiply": [a, b]}`
- `{"$lookup": {"value": "${x}", "table": {...}, "default": v}}` : rend le template associé à la clé trouvée, ou le template `default` (optionnel).
- `{"$fromEntries": {"from": "liste", "key": "${item}", "value": v}}` : omet les entrées dont la clé ou la valeur rendue est indéfinie, sans écraser les valeurs précédentes dans un `$merge`.
- `{"$concat": [t1, t2, ...]}` : concaténation (utile pour construire `path`)
- `{"$join": {"from": "liste", "separator": ";", "as": template}}` : jointure des éléments d'une liste

Les templates de `path`, `query`, `body` et `headers` sont validés au chargement, y compris les templates imbriqués. Un objet directive ne doit contenir que les champs de cette directive. Les chemins (`$for`, `$if`, `from`) sont des chaînes non vides ; `$as`, `$then`, `key`, `value` et `as` sont obligatoires pour leurs directives respectives. `$divide` et `$multiply` attendent exactement deux opérandes ; `$concat` et `$merge` attendent un tableau ; la table de `$lookup` est un objet. Le séparateur de `$join`, s'il est fourni, est une chaîne.

Mappings fournis : `valhalla-proxy.mapping` (route et isochrone) et `osrm-proxy.mapping` (route seulement, OSRM n'a pas d'isochrone), avec les sources d'exemple `proxy.source` et `osrm-proxy.source`.
