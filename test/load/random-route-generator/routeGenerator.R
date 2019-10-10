# Script pour générer des paramètres de calcul d'itinéraire 
#
# Ce script va générer un fichier ssv qui sera utilisé par Gatling
# afin de réaliser des tests de charge. 
#
# UTILISATION
# -----------
#
# R -f routeGenerator.R --args "/home/user/out.ssv" 100 "bduni" 8 41 9 42


# --- 1. Paramètres généraux liés aux tests

## Nombre de lignes a générer 
nbLines <- 100

## Emplacement et nom du fichier à générer 
pathFile <- "/tmp/road2_parameters.ssv"

## Ressource utilisée 
resource <- "corse-osm"

## Bbox des données générées 
xmin <- 8.61
xmax <- 9.52
ymin <- 41.40
ymax <- 42.62

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

## Noms d'optimisations 
possibleOptimizations <- c("fastest", "")

## Format des géométries
possibleGeometryFormat <- c("polyline", "", "geojson")

## Calcul de les étapes 
possibleGetSteps <- c("true", "", "false")

## Calcul de la bbox de l'itinéraire
possibleGetbbox <- c("true", "", "false")

# --- 2




# --- 3. Génération des données aléatoires 
## La fonction expand.grid génère l'ensemble des combinaisons possibles avec les données fournies.
## Cela peut donc être très long si on met beaucoup d'éléments. 
## On va donc générer l'ensemble des possibilités pour les paramètres sauf les coordonnées
randomData <- expand.grid(profile = possibleProfiles, optimization = possibleOptimizations, geometryFormat = possibleGeometryFormat, getSteps = possibleGetSteps, getBbox = possibleGetbbox)

## On génére les coordonnées à part 
### Points possibles
### Nombre de points à générer: obligatoire pour la suite du programme 
nbCoordinates <- nbLines * 2
### Génération des latitudes 
randomLatitudes <- runif(nbCoordinates, min=ymin, max=ymax)
### Génération des longitudes
randomLongitudes <- runif(nbCoordinates, min=xmin, max=xmax)
### Génération des points 
### Vecteur contenant les points: il y en a deux fois plus que de lignes demandées 
### pour avoir un point de départ et d'arrivée à chaque ligne
randomStart <- c("string", nbLines)
randomEnd <- c("string", nbLines)

for ( i in seq(1, nbLines) ) {

    randomStart[i] <- paste(randomLongitudes[i], ",", randomLatitudes[i], sep="")
    randomEnd[i] <- paste(randomLongitudes[i*2], ",", randomLatitudes[i*2], sep="")

}

## On génère des points intermédiaires qui peuvent être vides 
### Vecteur contenant les points 
randomIntermediates <- c("string", nbLines)

### Boucle pour la génération 
for ( i in seq(1, nbLines) ) {

    randomEmpty <- runif(1, 0, 1)

    if (randomEmpty < 0.7) {
        randomIntermediates[i] <- "" 
    } else {

        randomNumber <- as.integer(runif(1, 1, 3))
        randomIntermediates[i] <- ""

        for ( j in seq(1, randomNumber) ) {

            randomInt2 <- as.integer(runif(1, 1, nbCoordinates))
            point <- paste(randomLongitudes[randomInt2], ",", randomLatitudes[randomInt2], sep="")

            if (j == 1) {
                randomIntermediates[i] <- paste(randomIntermediates[i], point, sep="")
            } else {
                randomIntermediates[i] <- paste(randomIntermediates[i], "|", point, sep="")
            }

        }        
    }

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
    #print(randomData$profile[randomLine])
    lines[i] <- paste(resource, ";", randomStart[i], ";", randomEnd[i], ";", randomIntermediates[i], ";", randomData$profile[randomLine], ";", randomData$optimization[randomLine], ";", randomData$geometryFormat[randomLine], ";", randomData$getSteps[randomLine], ";", randomData$getBbox[randomLine], sep="")

}

## Écriture des données dans le fichier 

### En-tête du ssv 
headFile <- "resource;start;end;intermediates;profile;optimization;geometryFormat;getSteps;getBbox"

fileCon <- file(pathFile, "w")
writeLines(headFile, fileCon)
writeLines(lines, fileCon)
close(fileCon)

# --- 4