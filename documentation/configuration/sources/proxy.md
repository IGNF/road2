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

- `"${variable.chemin}"` : valeur typée si c'est toute la chaîne, sinon interpolation. Fonctionne aussi dans les clés.
- Les valeurs indéfinies sont omises.
- `{"$for": "liste", "$as": template}` : itération (`item`, `index`)
- `{"$if": "variable", "$then": t, "$else": t}`
- `{"$divide": [a, b]}`, `{"$multiply": [a, b]}`
- `{"$lookup": {"value": "${x}", "table": {...}, "default": v}}`
- `{"$fromEntries": {"from": "liste", "key": "${item}", "value": v}}`
- `{"$concat": [t1, t2, ...]}` : concaténation (utile pour construire `path`)
- `{"$join": {"from": "liste", "separator": ";", "as": template}}` : jointure des éléments d'une liste

Mappings fournis : `valhalla-proxy.mapping` (route et isochrone) et `osrm-proxy.mapping` (route seulement, OSRM n'a pas d'isochrone), avec les sources d'exemple `proxy.source` et `osrm-proxy.source`.
