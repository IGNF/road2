# Script pour générer des paramètres de calcul d'itinéraire 
#
# Ce script va générer un fichier ssv qui sera utilisé par Gatling
# afin de réaliser des tests de charge sur l'isochrone. 
#
# UTILISATION
# -----------
#
# R -f isoGenerator.R --args "/home/user/out.ssv" 100 "bduni" 8 41 9 42


# --- 1. Paramètres généraux liés aux tests

## Nombre de lignes a générer 
nbLines <- 100

## Emplacement et nom du fichier à générer 
pathFile <- "/tmp/road2_parameters_iso.ssv"

## Ressource utilisée 
resource <- "resource-iso"

## Bbox des données générées 
xmin <- -1
xmax <- 44
ymin <- 5
ymax <- 49

# --- 1

# --- 2. Récupération des arguments de l'utilisateur 

userArgs = commandArgs(trailingOnly=TRUE)

if (length(userArgs) > 0) {
    if (length(userArgs) != 7) {
        stop("Nombre d'arguments incorrect")
    } else {
        pathFile <- userArgs[1]
        nbLines <- as.numeric(userArgs[2])
        resource <- userArgs[3]
        xmin <- as.numeric(userArgs[4])
        ymin <- as.numeric(userArgs[5])
        xmax <- as.numeric(userArgs[6])
        ymax <- as.numeric(userArgs[7])
    }
}

# --- 2




# --- 2. Instanciation des données possibles 

## Noms de profiles 
possibleProfiles <- c("car", "")

## Types des values 
possibleCostTypes <- c("distance", "time", "")

## Directions possibles 
possibleDirections <- c("departure", "arrival", "")

## Format des géométries
possibleGeometryFormat <- c("polyline", "", "geojson")

# --- 2




# --- 3. Génération des données aléatoires 
## La fonction expand.grid génère l'ensemble des combinaisons possibles avec les données fournies.
## Cela peut donc être très long si on met beaucoup d'éléments. 
## On va donc générer l'ensemble des possibilités pour les paramètres sauf les coordonnées
randomData <- expand.grid(profile = possibleProfiles, costType = possibleCostTypes, direction = possibleDirections, geometryFormat = possibleGeometryFormat)

## On génére les coordonnées à part 
### Points possibles
### Nombre de points à générer: obligatoire pour la suite du programme 
nbCoordinates <- nbLines 
### Génération des latitudes 
randomLatitudes <- runif(nbCoordinates, min=ymin, max=ymax)
### Génération des longitudes
randomLongitudes <- runif(nbCoordinates, min=xmin, max=xmax)
### Génération des points 
### Vecteur contenant les points
randomPoint <- c("string", nbLines)

for ( i in seq(1, nbLines) ) {
    randomPoint[i] <- paste(randomLongitudes[i], ",", randomLatitudes[i], sep="")
}

# --- 3





# --- 4. Écriture des données dans un fichier ssv 

## On génère des lignes finales du fichier
### Vecteur contenant les lignes
lines <- c("string", nbLines)

### Nombre de données générées aléatoirement 
nbData <- length(randomData)

for ( i in seq(1, nbLines) ) {

    ### On prend une ligne aléatoirement dans randomData 
    randomLine <- as.integer(runif(1, 1, nbData))
    ### On prend une valeur aléatoire pour l'iso
    randomCostValue <- as.integer(runif(1, 100, 1800))
    #print(randomData$profile[randomLine])
    lines[i] <- paste(resource, ";", randomPoint[i], ";", randomCostValue, ";", randomData$profile[randomLine], ";", randomData$costType[randomLine], ";", randomData$direction[randomLine], ";", randomData$geometryFormat[randomLine], sep="")

}

## Écriture des données dans le fichier 

### En-tête du ssv 
headFile <- "resource;point;costValue;profile;costType;direction;geometryFormat"

fileCon <- file(pathFile, "w")
writeLines(headFile, fileCon)
writeLines(lines, fileCon)
close(fileCon)

# --- 4