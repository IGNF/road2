{
  "resource": {
    "id": "bduni-idf-pgr",
    "type": "pgr",
    "description": "Donn\u00e9es BDUNI v2.",
    "resourceVersion": "10/05/2020",
    "topology": {
      "id": "base-bduni",
      "type": "db",
      "description": "Donn\u00e9es issues de la BDUNI de l'IGN.",
      "storage": {
        "base": {
          "dbConfig": "/home/docker/data/output_base.json",
          "schema": "public",
          "attributes": [
            {
              "key": "name",
              "column": "way_names",
              "default": "false"
            },
            {
              "key": "nom_1_gauche",
              "column": "nom_1_gauche",
              "default": "true"
            },
            {
              "key": "nom_1_droite",
              "column": "nom_1_droite",
              "default": "true"
            },
            {
              "key": "cpx_numero",
              "column": "cpx_numero",
              "default": "true"
            },
            {
              "key": "cpx_toponyme_route_nommee",
              "column": "cpx_toponyme_route_nommee",
              "default": "true"
            },
            {
              "key": "cleabs",
              "column": "cleabs",
              "default": "false"
            },
            {
              "key": "nature",
              "column": "nature",
              "default": "false"
            },
            {
              "key": "importance",
              "column": "importance",
              "default": "false"
            },
            {
              "key": "position_par_rapport_au_sol",
              "column": "position_par_rapport_au_sol",
              "default": "false"
            },
            {
              "key": "nombre_de_voies",
              "column": "nombre_de_voies",
              "default": "false"
            },
            {
              "key": "largeur_de_chaussee",
              "column": "largeur_de_chaussee",
              "default": "false"
            },
            {
              "key": "itineraire_vert",
              "column": "itineraire_vert",
              "default": "false"
            },
            {
              "key": "sens_de_circulation",
              "column": "sens_de_circulation",
              "default": "false"
            },
            {
              "key": "bande_cyclable",
              "column": "bande_cyclable",
              "default": "false"
            },
            {
              "key": "reserve_aux_bus",
              "column": "reserve_aux_bus",
              "default": "false"
            },
            {
              "key": "urbain",
              "column": "urbain",
              "default": "false"
            },
            {
              "key": "vitesse_moyenne_vl",
              "column": "vitesse_moyenne_vl",
              "default": "false"
            },
            {
              "key": "acces_vehicule_leger",
              "column": "acces_vehicule_leger",
              "default": "false"
            },
            {
              "key": "acces_pieton",
              "column": "acces_pieton",
              "default": "false"
            },
            {
              "key": "nature_de_la_restriction",
              "column": "nature_de_la_restriction",
              "default": "false"
            },
            {
              "key": "restriction_de_hauteur",
              "column": "restriction_de_hauteur",
              "default": "false"
            },
            {
              "key": "restriction_de_poids_total",
              "column": "restriction_de_poids_total",
              "default": "false"
            },
            {
              "key": "restriction_de_poids_par_essieu",
              "column": "restriction_de_poids_par_essieu",
              "default": "false"
            },
            {
              "key": "restriction_de_largeur",
              "column": "restriction_de_largeur",
              "default": "false"
            },
            {
              "key": "restriction_de_longueur",
              "column": "restriction_de_longueur",
              "default": "false"
            },
            {
              "key": "matieres_dangereuses_interdites",
              "column": "matieres_dangereuses_interdites",
              "default": "false"
            },
            {
              "key": "insee_commune_gauche",
              "column": "insee_commune_gauche",
              "default": "false"
            },
            {
              "key": "insee_commune_droite",
              "column": "insee_commune_droite",
              "default": "false"
            },
            {
              "key": "cpx_numero_route_europeenne",
              "column": "cpx_numero_route_europeenne",
              "default": "false"
            },
            {
              "key": "cpx_classement_administratif",
              "column": "cpx_classement_administratif",
              "default": "false"
            },
            {
              "key": "cpx_gestionnaire",
              "column": "cpx_gestionnaire",
              "default": "false"
            }
          ]
        }
      },
      "projection": "EPSG:4326",
      "bbox": "1.7,48.4,3.3,49.1"
    },
    "sources": [
      {
        "id": "bduni-idf-car-fastest-pgr",
        "type": "pgr",
        "storage": {
          "costColumn": "cost_s_car",
          "rcostColumn": "reverse_cost_s_car"
        },
        "cost": {
          "profile": "car",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/docker/data/costs_calculation_sample.json"
            },
            "configuration": {
              "name": "cost_s_car",
              "storage": {
                "file": "/home/docker/data/costs_calculation_sample.json"
              }
            }
          }
        }
      },
      {
        "id": "bduni-idf-car-shortest-pgr",
        "type": "pgr",
        "storage": {
          "costColumn": "cost_m_car",
          "rcostColumn": "reverse_cost_m_car"
        },
        "cost": {
          "profile": "car",
          "optimization": "shortest",
          "compute": {
            "storage": {
              "file": "/home/docker/data/costs_calculation_sample.json"
            },
            "configuration": {
              "name": "cost_m_car",
              "storage": {
                "file": "/home/docker/data/costs_calculation_sample.json"
              }
            }
          }
        }
      },
      {
        "id": "bduni-idf-pedestrian-fastest-pgr",
        "type": "pgr",
        "storage": {
          "costColumn": "cost_s_pedestrian",
          "rcostColumn": "reverse_cost_s_pedestrian"
        },
        "cost": {
          "profile": "pedestrian",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/docker/data/costs_calculation_sample.json"
            },
            "configuration": {
              "name": "cost_s_pedestrian",
              "storage": {
                "file": "/home/docker/data/costs_calculation_sample.json"
              }
            }
          }
        }
      },
      {
        "id": "bduni-idf-pedestrian-shortest-pgr",
        "type": "pgr",
        "storage": {
          "costColumn": "cost_m_pedestrian",
          "rcostColumn": "reverse_cost_m_pedestrian"
        },
        "cost": {
          "profile": "pedestrian",
          "optimization": "shortest",
          "compute": {
            "storage": {
              "file": "/home/docker/data/costs_calculation_sample.json"
            },
            "configuration": {
              "name": "cost_m_pedestrian",
              "storage": {
                "file": "/home/docker/data/costs_calculation_sample.json"
              }
            }
          }
        }
      }
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
              "name",
              "nom_1_gauche",
              "nom_1_droite",
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
              "polyline"
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
            "id": "costValue"
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
              "polyline"
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
}