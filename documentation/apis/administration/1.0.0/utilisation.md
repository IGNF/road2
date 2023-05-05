# Utilisation de l'API d'administration 

## Concepts 

Cette API d'administration a été codée dans l'idée de permettre le plus d'actions possibles sur la configuration de Road2. Le deuxième objectif a été de fournir quelques raccourcis et fonctionnalités supplémentaires jugées utiles et qui ne complexifiaient pas beaucoup le code. 

Les concepts utiles (administrateur, services, ressources et sources) sont définis sur la page des [concepts](../../../developers/concepts.md). 




## Prérequis 

Afin de pouvoir utiliser cette API, il est nécessaire que l'administrateur soit lancé avec une configuration d'administrateur valide (ex. [road2.json](../../../../docker/config/road2.json)). Par contre, il n'est pas nécessaire d'avoir configuré des services, des sources et des ressources. Ils pourront l'être par la suite. 

L'autre prérequis, notamment afin de pouvoir créer un service, sera d'avoir des données accessibles par Road2. En effet, l'administrateur n'a pas vocation à gérer les données elles-mêmes (ex. création/suppression). 





## Fonctionnalités 

### Récupérer la configuration de l'administrateur

La configuration existe nécessairement. Elle est donc renvoyée. 

### Modifier la configuration de l'administrateur

Dans la configuration de l'administrateur, tout est modifiable. Cela permet notamment de créer, modifier et supprimer les services gérés par cet administrateur. 

Quand une modification est envoyée, la nouvelle configuration résultante est d'abord analysée. Si elle est valide, alors le changement est pris en compte. Sinon, une erreur est renvoyée. 

Lorsque l'on modifie la configuration, l'administrateur prend tout de suite en compte ces modifications. Si un redémarrage est nécessaire, alors l'administrateur sera temporairement indisponible. Selon le mode de création des services qui en dépendent, il y aura ou pas d'interruption de ces derniers. 




### Gérer un service 

Si un service existe, il est possible de le modifier et de le supprimer. S'il n'existe pas, on peut le créer. 

#### Récupérer la configuration d'un service

Si la configuration existe, alors elle est renvoyée. Sinon, une erreur est renvoyée. 

#### Modifier la configuration d'un service 

Pour modifier la configuration d'un service, celle-ci doit exister. On peut alors tout modifier. 

Quand une modification est envoyée, la nouvelle configuration résultante est d'abord analysée. 
Si elle est valide, alors le changement peut être pris en compte. Sinon, un code d'erreur est renvoyé. 
Si un redémarrage du service est nécessaire, il sera alors temporairement indisponible. 

#### Créer un service 

Si un service n'existe pas, il est possible de le créer en fournissant sa configuration. 

La configuration est d'abord vérifiée. Si elle est valide, le service est alors créé. Sinon, une erreur est renvoyée. 

Une fois créé, le service est disponible. 

#### Supprimer un service 

Pour supprimer un service, il sera nécessaire d'avoir d'abord supprimé les sources et ressources associées. 

Une fois supprimés, un service et sa configuration ne peuvent être récupérés. 



### Gérer une source pour un service spécifique

La gestion des sources se fait toujours au sein d'un service spécifique. 

L'accéssibilité d'une source se fait via la notion de ressource. Si aucune ressource n'utilise une source, cette dernière n'est donc pas interrogeable. Cependant, pour créer une ressource, il est nécessaire d'avoir d'abord créer au moins une source qu'elle utilisera. 

#### Obtenir la configuration d'une source 

Si une source existe, il est possible récupérer sa configuration. Si elle n'existe pas, une erreur est renvoyée. 

#### Modifier la configuration d'une source 

Pour modifier la configuration d'une source, celle-ci doit exister. On peut alors tout modifier. 

Quand une modification est envoyée, la nouvelle configuration résultante est d'abord analysée. 
Si elle est valide, alors le changement peut être pris en compte. Sinon, un code d'erreur est renvoyé. 

#### Créer la configuration d'une source 

Créer la configuration d'une source revient à créer une source.

Pour créer une source, seule la présence des données est également nécessaire. 


#### Supprimer la configuration d'une source 

Supprimer la configuration d'une source revient à supprimer une source. 

Pour supprimer une source, il est nécessaire que son utilisation au sein des ressources soient déjà supprimée. 




### Gérer une ressource pour un service spécifique

La gestion des ressources se fait toujours au sein d'un service spécifique. 

#### Obtenir la configuration d'une ressource 

Si une ressource existe, il est possible récupérer sa configuration. Si elle n'existe pas, une erreur est renvoyée. 

#### Modifier la configuration d'une ressource

Pour modifier la configuration d'une ressource, celle-ci doit exister. On peut alors tout modifier. 

Quand une modification est envoyée, la nouvelle configuration résultante est d'abord analysée. 
Si elle est valide, alors le changement peut être pris en compte. Sinon, un code d'erreur est renvoyé. 

#### Créer la configuration d'une ressource 

Créer la configuration d'une ressource revient à créer une ressource. Quand la configuration est créée, la ressource est rendue disponible. 

Pour créer une ressource, les sources utilisées doivent exister. 

#### Supprimer la configuration d'une ressource 

Supprimer la configuration d'une ressource revient à supprimer une ressource. La ressource n'est donc plus disponible. 





### Connaître l'état de l'administrateur et des services associés

Cet état fait référence à la disponibilité des données. Chaque service a un état lié à la disponibilité de ses ressources. Chaque ressource a un état lié à la dispoinibilité de ses sources. Et chaque source, celle de ses données. 





### Connaître la version du serveur déployée 

Connaitre la version de Road2 déployée sur l'instance en cours. 





## Raccourcis 

### Lister les services gérés par un administrateur 

Pour certains usages, on souhaitera connaitre la liste des services disponibles. Il serait possible d'avoir cette information en lisant la configuration de l'administrateur. 

### Lister les ressources proposées par un service 

Pour certains usages, on souhaitera connaitre la liste des ressources disponibles sur un service spécifique. 

### Lister les sources proposées par un service

Pour certains usages, on souhaitera connaitre la liste des sources disponibles sur un service spécifique. 





## Exemples d'utilisation 

Les cas les plus fréquents semblent être les cas où l'on a un administrateur et des services qui sont déjà bien configurés. On souhaite alors simplement administrer cette configuration existante. Pour cela, il suffira de se référer au paragraphe décrivant les fonctionnalités. 

### Configurer un service uniquement via l'API d'administration

Dans certains cas, on voudra créer un nouveau service à côté de ceux déjà existants ou tout simplement créer le tout premier. Voici comment faire :

En supposant que l'administrateur soit bien configuré et démarré, et que des données soient disponibles, on peut configurer entièrement un nouveau service via l'API d'administration. 

On va commencer par créer un service avec une bonne configuration.

Maintenant donc, on va pouvoir créer des sources en utilisant les données déjà disponibles. 

À partir de ces sources, on va pouvoir créer des ressources. 

Tout est en place, il ne reste plus qu'à rendre le service disponible. 






