// Script pour générer des icônes simples
const fs = require('fs');
const { createCanvas } = require('canvas');

// Tailles d'icônes dont nous avons besoin
const sizes = [16, 48, 128];

// Fonction pour créer une icône simple
function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Fond bleu (couleur principale de l'extension)
    ctx.fillStyle = '#0056b3';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Rectangle blanc (feuille de papier)
    const paperSize = size * 0.6;
    const paperX = (size - paperSize) / 2;
    const paperY = (size - paperSize) / 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(paperX, paperY, paperSize, paperSize);
    
    // Lettre "M" pour moyenne
    if (size >= 32) { // Pas de texte pour les petites icônes
        ctx.fillStyle = '#0056b3';
        ctx.font = `bold ${size * 0.4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('M', size/2, size/2);
    }
    
    // Enregistrer l'image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`icons/icon${size}.png`, buffer);
    console.log(`Icône ${size}x${size} créée`);
}

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

// Créer chaque icône
sizes.forEach(createIcon);
console.log('Toutes les icônes ont été générées !'); 