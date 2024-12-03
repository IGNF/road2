{
  "resource": {
    "id": "bduni-idf-pgr",
    "type": "pgr",
    "description": "Données BDUNI v2.",
    "resourceVersion": "yyyy-mm-dd",
    "sources": [
      "bduni-idf-pgr"
    ],
    "availableOperations": [
      {
        "id": "route",
        "parameters": [
          {
            "id": "resource",
            "values": [
              "bduni-idf-pgr"
            ]
          },
          {
            "id": "start",
            "values": {
              "bbox": "1.7,48.4,3.3,49.1",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "end",
            "values": {
              "bbox": "1.7,48.4,3.3,49.1",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "profile",
            "defaultValueContent": "car",
            "values": [
              "car",
              "pedestrian"
            ]
          },
          {
            "id": "optimization",
            "defaultValueContent": "fastest",
            "values": [
              "fastest",
              "shortest"
            ]
          },
          {
            "id": "intermediates",
            "values": {
              "bbox": "1.7,48.4,3.3,49.1",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "getSteps",
            "defaultValueContent": "true"
          },
          {
            "id": "waysAttributes",
            "values": [
              "nom_collaboratif_gauche",
              "nom_collaboratif_droite",
              "cpx_numero",
              "cpx_toponyme_route_nommee",
              "cleabs",
              "nature",
              "importance",
              "position_par_rapport_au_sol",
              "nombre_de_voies",
              "largeur_de_chaussee",
              "itineraire_vert",
              "sens_de_circulation",
              "bande_cyclable",
              "reserve_aux_bus",
              "urbain",
              "vitesse_moyenne_vl",
              "acces_vehicule_leger",
              "acces_pieton",
              "nature_de_la_restriction",
              "restriction_de_hauteur",
              "restriction_de_poids_total",
              "restriction_de_poids_par_essieu",
              "restriction_de_largeur",
              "restriction_de_longueur",
              "matieres_dangereuses_interdites",
              "insee_commune_gauche",
              "insee_commune_droite",
              "cpx_numero_route_europeenne",
              "cpx_classement_administratif",
              "cpx_gestionnaire"
            ]
          },
          {
            "id": "geometryFormat",
            "defaultValueContent": "geojson",
            "values": [
              "geojson",
              "polyline",
              "wkt"
            ]
          },
          {
            "id": "bbox",
            "defaultValueContent": "true"
          },
          {
            "id": "projection",
            "defaultValueContent": "EPSG:4326",
            "values": [
              "EPSG:4326",
              "EPSG:2154"
            ]
          },
          {
            "id": "timeUnit",
            "defaultValueContent": "minute",
            "values": [
              "hour",
              "minute",
              "second",
              "standard"
            ]
          },
          {
            "id": "distanceUnit",
            "defaultValueContent": "meter",
            "values": [
              "meter",
              "kilometer"
            ]
          },
          {
            "id": "constraints",
            "defaultPreferredCostRatio": 0.8,
            "defaultAvoidCostRatio": 1.2,
            "values": [
              {
                "keyType": "name-pgr",
                "key": "wayType",
                "availableConstraintType": [
                  "banned"
                ],
                "availableValues": [
                  {
                    "value": "autoroute",
                    "field": "acces_vehicule_leger",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$A p\u00e9age$niv4$"
                    }
                  },
                  {
                    "value": "tunnel",
                    "field": "position_par_rapport_au_sol",
                    "condition": {
                      "type": "less",
                      "value": "0"
                    }
                  },
                  {
                    "value": "pont",
                    "field": "position_par_rapport_au_sol",
                    "condition": {
                      "type": "greater",
                      "value": "0"
                    }
                  }
                ]
              },
              {
                "keyType": "numerical-pgr",
                "key": "largeur",
                "availableConstraintType": [
                  "banned"
                ],
                "field": "largeur_de_chaussee"
              },
              {
                "keyType": "numerical-pgr",
                "key": "importance",
                "availableConstraintType": [
                  "banned",
                  "avoid",
                  "prefer"
                ],
                "field": "importance"
              },
              {
                "keyType": "name-pgr",
                "key": "nature",
                "availableConstraintType": [
                  "banned"
                ],
                "availableValues": [
                  {
                    "value": "sentier",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Sentier$niv4$"
                    }
                  },
                  {
                    "value": "bac_ou_liaison_maritime",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Bac ou liaison maritime$niv4$"
                    }
                  },
                  {
                    "value": "bretelle",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Bretelle$niv4$"
                    }
                  },
                  {
                    "value": "chemin",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Chemin$niv4$"
                    }
                  },
                  {
                    "value": "escalier",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Escalier$niv4$"
                    }
                  },
                  {
                    "value": "piste_cyclable",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Piste cyclable$niv4$"
                    }
                  },
                  {
                    "value": "rond-point",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Rond-point$niv4$"
                    }
                  },
                  {
                    "value": "route_a_1_chaussee",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Route \u00e0 1 chauss\u00e9e$niv4$"
                    }
                  },
                  {
                    "value": "route_a_2_chaussees",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Route \u00e0 2 chauss\u00e9es$niv4$"
                    }
                  },
                  {
                    "value": "route_empierree",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Route empierr\u00e9e$niv4$"
                    }
                  },
                  {
                    "value": "type_autoroutier",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Type autoroutier$niv4$"
                    }
                  }
                ]
              },
              {
                "keyType": "name-pgr",
                "key": "cpx_classement_administratif",
                "availableConstraintType": [
                  "banned",
                  "prefer",
                  "avoid"
                ],
                "availableValues": [
                  {
                    "value": "vide",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$$niv4$"
                    }
                  },
                  {
                    "value": "autoroute",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "like",
                      "value": "$niv4$%Autoroute%$niv4$"
                    }
                  },
                  {
                    "value": "nationale",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Nationale$niv4$"
                    }
                  },
                  {
                    "value": "departementale",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$D\u00e9partementale$niv4$"
                    }
                  },
                  {
                    "value": "voie_communale",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Voie communale$niv4$"
                    }
                  },
                  {
                    "value": "chemin_rural",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Chemin rural$niv4$"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "isochrone",
        "parameters": [
          {
            "id": "resource",
            "values": [
              "bduni-idf-pgr"
            ]
          },
          {
            "id": "point",
            "values": {
              "bbox": "1.7,48.4,3.3,49.1",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "costType",
            "defaultValueContent": "time",
            "values": [
              "time",
              "distance"
            ]
          },
          {
            "id": "costValue",
            "values": {
              "min": 100,
              "max": 20000
            }
          },
          {
            "id": "profile",
            "defaultValueContent": "car",
            "values": [
              "car",
              "pedestrian"
            ]
          },
          {
            "id": "direction",
            "defaultValueContent": "departure",
            "values": [
              "departure",
              "arrival"
            ]
          },
          {
            "id": "projection",
            "defaultValueContent": "EPSG:4326",
            "values": [
              "EPSG:4326",
              "EPSG:2154",
              "EPSG:4559",
              "EPSG:2972",
              "EPSG:2975",
              "EPSG:4471",
              "EPSG:3857"
            ]
          },
          {
            "id": "geometryFormat",
            "defaultValueContent": "geojson",
            "values": [
              "geojson",
              "polyline",
              "wkt"
            ]
          },
          {
            "id": "timeUnit",
            "defaultValueContent": "second",
            "values": [
              "hour",
              "minute",
              "second"
            ]
          },
          {
            "id": "distanceUnit",
            "defaultValueContent": "meter",
            "values": [
              "meter",
              "kilometer"
            ]
          },
          {
            "id": "constraints",
            "values": [
              {
                "keyType": "name-pgr",
                "key": "wayType",
                "availableConstraintType": [
                  "banned"
                ],
                "availableValues": [
                  {
                    "value": "autoroute",
                    "field": "acces_vehicule_leger",
                    "condition": {
                      "type": "equal",
                      "value": "$niv3$A p\u00e9age$niv3$"
                    }
                  },
                  {
                    "value": "tunnel",
                    "field": "position_par_rapport_au_sol",
                    "condition": {
                      "type": "less",
                      "value": "0"
                    }
                  },
                  {
                    "value": "pont",
                    "field": "position_par_rapport_au_sol",
                    "condition": {
                      "type": "greater",
                      "value": "0"
                    }
                  }
                ]
              },
              {
                "keyType": "numerical-pgr",
                "key": "LARGEUR",
                "availableConstraintType": [
                  "banned"
                ],
                "field": "largeur_de_chaussee"
              },
              {
                "keyType": "numerical-pgr",
                "key": "IMPORTANCE",
                "availableConstraintType": [
                  "banned"
                ],
                "field": "importance"
              },
              {
                "keyType": "name-pgr",
                "key": "RESTR_MAT",
                "availableConstraintType": [
                  "banned"
                ],
                "availableValues": [
                  {
                    "value": "vrai",
                    "field": "matieres_dangereuses_interdites",
                    "condition": {
                      "type": "equal",
                      "value": "true"
                    }
                  },
                  {
                    "value": "faux",
                    "field": "matieres_dangereuses_interdites",
                    "condition": {
                      "type": "equal",
                      "value": "false"
                    }
                  }
                ]
              },
              {
                "keyType": "name-pgr",
                "key": "NATURE",
                "availableConstraintType": [
                  "banned"
                ],
                "availableValues": [
                  {
                    "value": "sentier",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Sentier$niv4$"
                    }
                  },
                  {
                    "value": "bac_ou_liaison_maritime",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Bac ou liaison maritime$niv4$"
                    }
                  },
                  {
                    "value": "bretelle",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Bretelle$niv4$"
                    }
                  },
                  {
                    "value": "chemin",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Chemin$niv4$"
                    }
                  },
                  {
                    "value": "escalier",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Escalier$niv4$"
                    }
                  },
                  {
                    "value": "piste_cyclable",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Piste cyclable$niv4$"
                    }
                  },
                  {
                    "value": "rond-point",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Rond-point$niv4$"
                    }
                  },
                  {
                    "value": "route_a_1_chaussee",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Route \u00e0 1 chauss\u00e9e$niv4$"
                    }
                  },
                  {
                    "value": "route_a_2_chaussees",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Route \u00e0 2 chauss\u00e9es$niv4$"
                    }
                  },
                  {
                    "value": "route_empierree",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Route empierr\u00e9e$niv4$"
                    }
                  },
                  {
                    "value": "type_autoroutier",
                    "field": "nature",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$Type autoroutier$niv4$"
                    }
                  }
                ]
              },
              {
                "keyType": "name-pgr",
                "key": "CL_ADMIN",
                "availableConstraintType": [
                  "banned"
                ],
                "availableValues": [
                  {
                    "value": "vide",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv4$$niv4$"
                    }
                  },
                  {
                    "value": "autoroute",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "like",
                      "value": "$niv3$%Autoroute%$niv3$"
                    }
                  },
                  {
                    "value": "nationale",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv3$Nationale$niv3$"
                    }
                  },
                  {
                    "value": "departementale",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv3$D\u00e9partementale$niv3$"
                    }
                  },
                  {
                    "value": "voie_communale",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv3$Voie communale$niv3$"
                    }
                  },
                  {
                    "value": "chemin_rural",
                    "field": "cpx_classement_administratif",
                    "condition": {
                      "type": "equal",
                      "value": "$niv3$Chemin rural$niv3$"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
