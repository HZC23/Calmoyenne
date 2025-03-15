# Calculateur de Moyenne - École Directe

Cette extension ajoute automatiquement la moyenne générale en haut du tableau des notes sur École Directe.

## Fonctionnalités

- Calcul automatique de la moyenne générale pondérée par les coefficients
- Affichage de la moyenne dans le tableau de notes d'École Directe
- Fonctionne sur les pages de relevés de notes

## Installation

### Pour Chrome / Edge / Brave

1. Téléchargez ce dépôt (Code > Download ZIP) puis décompressez-le
2. Ouvrez Chrome et allez à `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier décompressé

### Pour Firefox

1. Téléchargez ce dépôt (Code > Download ZIP) puis décompressez-le
2. Ouvrez Firefox et allez à `about:debugging#/runtime/this-firefox`
3. Cliquez sur "Charger un module temporaire"
4. Naviguez jusqu'au dossier décompressé et sélectionnez le fichier `manifest.json`

**Note pour Firefox**: Si vous souhaitez installer l'extension de manière permanente, vous devrez la soumettre à [Firefox Add-ons](https://addons.mozilla.org/) pour validation.

Alternativement, vous pouvez installer l'extension de façon plus durable en suivant ces étapes:

1. Compressez tous les fichiers de l'extension en un fichier ZIP
2. Renommez l'extension du fichier ZIP en `.xpi`
3. Dans Firefox, allez à `about:addons`
4. Cliquez sur la roue dentée puis "Installer un module depuis un fichier"
5. Sélectionnez votre fichier .xpi

## Utilisation

1. Connectez-vous à votre compte École Directe
2. Accédez à vos notes
3. La moyenne générale apparaîtra automatiquement en haut du tableau

## Développement

### Structure des fichiers

- `manifest.json` : Définition de l'extension
- `script.js` : Script principal qui analyse les tableaux et calcule la moyenne
- `background.js` : Script d'arrière-plan pour la gestion de l'extension
- `popup.html` : Interface utilisateur quand on clique sur l'icône de l'extension
- `browser-polyfill.js` : Script de compatibilité entre Chrome et Firefox
- `icons/` : Dossier contenant les icônes de l'extension

### Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

Ce projet est distribué sous licence libre (MIT).

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

## Problèmes connus

- Sur certaines configurations, le chargement peut prendre quelques secondes
- Si le tableau n'est pas détecté correctement, essayez de rafraîchir la page 