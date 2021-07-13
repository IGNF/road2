# Les données pour Road2 

## Des données navigables 

### La topologie

Afin que des données géographiques soient utilisables par un moteur de calcul d'itinéraire, il est nécessaire qu'elles soient navigables. Cela veut dire que ces données représentent un graphe obligatoirement connexe, et potentiellement multiple, orienté et avec des boucles. Autrement dit, les données représentent un ensemble de noeuds reliés entre eux par des arcs, avec les propriétés suivantes : 
- Obligatoirement, le graphe est connexe. Les noeuds sont reliés entre eux par des arcs de sorte que chaque noeud soit accessible depuis n'importe quel autre noeud du graphe. CE graphe peut bien sûr être divisé en sous-graphes connexes. Mais certains itinéraires n'existeront pas. 
- Généralement, le graphe est orienté. Les arcs ont un sens. Si ce n'est pas le cas, chaque arc sera doublé pour avoir une circulation à double-sens. 
- Potentiellement, le graphe est multiple et peut contenir des boucles. Plusieurs arcs peuvent relier les deux mêmes points. Un arc peut relier un seul point et donc faire une boucle. 

Dans ce qui vient d'être présenté, les arcs représentent des voies de circulation et les noeuds sont généralement uniquement des intersections entre plusieurs voies. 

### La réalité de la navigation 

La définition précédente permet aux moteurs de calculer des itinéraires. Cependant, si on se contente de ce minimum, le résultat obtenu risque fortement de ne pas être conforme au code de la route. Pour se rapprocher de la réalité, il est nécessaire de compléter cette topologie par des informations présentes sur la route et que les moteurs peuvent prendre en compte. La qualité et l'exhaustivité des données ainsi ajoutées permettront d'aboutir à des itinéraires réalistes. 

#### Les sens de circulation 

Cette information est primordiale pour aboutir à des itinéraires réalistes. Sans elle, les ronds-points seront certainement pris à l'envers. 

#### Les non-communications 

Les non-communications sont des informations qui précisent l'interdiction de prendre un arc depuis un autre selon le sens de navigation. Concrètement, ce sont la représentation informatique de certains panneaux (ex. l'interdiction de tourner à gauche). 

Ces informations sont également très importantes pour avoir des itinéraires réalistes. Elles sont bien gérées par les moteurs. 

### Les métadonnées 

On peut également ajouter des informations liés aux noeuds ou aux arcs. Par exemple, on peut ajouter une chaîne de caractères à chaque arc, qui indique le nom de la voie qu'il représente. Ces métadonnées ne sont pas nécessaires pour les calculs mais elles sont utiles pour un utilisateur du service. 

## La transformation des données 

Dans cette partie, on considère acquis des données navigables. Afin de les utiliser avec Road2, il sera nécessaire des les convertir dans l'un des formats lisibles par le serveur. 

### Données OSRM 

Il est possible d'utiliser des données au format d'OSRM. La seule contrainte est d'avoir des données générées avec la même version que celle de Road2. Cette version est indiquée dans le `package.json` à la racine du projet GIT.  

### Données PGRouting 

Si des données au format PGRouting sont disponibles, il est possible de les utiliser avec Road2. A priori, il n'y a pas de fortes contraintes sur la version de PGRouting utilisée. La seule contrainte est au niveau logiciel. Il est nécessaire d'installer les procédures du projet GIT `pgrouting-procedures` afin que Road2 puisse requêter la base qui héberge les données et les fonctions de PGRouting.

### Les autres données 

Lorsque les données ne sont pas dans l'un des formats gérés par Road2, il reste possible de les convertir. Chacun peut le faire comme il le souhaite pour aboutir à l'un des formats cités précédemment. Cependant, si certains le veulent, un projet GIT a été mis en place, `route-graph-generator`, afin de convertir les données. 

`route-graph-generator` est un ensemble de scripts python qui lisent des données dans une base postgreSQL et la convertissent dans un format pivot. À partir de la base pivot, il est possible de convertir les données dans n'importe quel format géré par Road2. Ainsi, une même donnée d'entrée peut permettre des calculs par l'ensemble des moteurs. 
Pour information, la conversion de données quelconques dans le format pivot est effectué par des scripts SQL. Pour le moment, il n'y en a qu'un seul qui permet de convertir des données IGN. Cependant, il est facile d'en ajouter de nouveaux pour partir d'un format différent et d'aboutir au format pivot. À partir de ce format pivot, tout les outils existent déjà pour aboutir aux formats gérés par Road2. 



