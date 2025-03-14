# Calculateur de Moyenne - École Directe

Une extension Chrome qui calcule automatiquement votre moyenne générale sur École Directe et l'affiche en haut du tableau des notes.

## Fonctionnalités

- Calcul automatique de la moyenne générale en tenant compte des coefficients
- Affichage de la moyenne en haut du tableau des notes
- Mise à jour automatique lorsque vous naviguez entre différentes périodes

## Installation

### Installation depuis Chrome Web Store (Recommandé)

1. Visitez la page de l'extension dans le Chrome Web Store (lien à venir)
2. Cliquez sur "Ajouter à Chrome"
3. Confirmez l'installation

### Installation manuelle (Mode développeur)

1. Téléchargez ou clonez ce dépôt sur votre ordinateur
2. Ouvrez Chrome et accédez à `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant l'extension

## Utilisation

1. Connectez-vous à votre espace École Directe
2. Accédez à la page de vos notes
3. La moyenne générale apparaîtra automatiquement en haut du tableau

## Remarques

- L'extension ne collecte aucune donnée et fonctionne entièrement localement
- L'extension ne modifie pas les données existantes sur École Directe, elle ajoute simplement un calcul de moyenne
- Le calcul prend en compte les coefficients des matières

## Conversion des icônes SVG en PNG

Pour convertir l'icône SVG en PNG aux différentes tailles nécessaires, vous pouvez utiliser un outil de conversion en ligne ou un logiciel comme Inkscape :

1. Ouvrez le fichier `icons/icon.svg` dans un éditeur d'images ou un outil en ligne
2. Exportez-le aux dimensions suivantes :
   - 16x16 pixels pour `icon16.png`
   - 48x48 pixels pour `icon48.png`
   - 128x128 pixels pour `icon128.png`
3. Placez tous les fichiers PNG dans le dossier `icons/`

## Licence

Cette extension est distribuée sous licence open source.

## Problèmes connus

- Sur certaines configurations, le chargement peut prendre quelques secondes
- Si le tableau n'est pas détecté correctement, essayez de rafraîchir la page 