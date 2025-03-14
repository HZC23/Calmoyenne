// Script d'analyse des tableaux pour identifier celui des notes
console.log("Extension Calculateur de Moyenne - Script d'analyse chargé");

// Variable pour éviter les analyses multiples
let analyseEnCours = false;
let analyseTerminee = false;

// Fonction pour vérifier périodiquement le tableau
function verifierTableau() {
    if (!analyseTerminee && !analyseEnCours) {
        lancerAnalyse();
    }
}

// Attendre que la page soit complètement chargée
window.addEventListener("load", function() {
    console.log("Page entièrement chargée, démarrage de l'analyse...");
    // Premier lancement
    setTimeout(lancerAnalyse, 3000);
    // Vérification périodique
    setInterval(verifierTableau, 2000);
});

// Fonction d'initialisation qui évite les analyses multiples
function lancerAnalyse() {
    if (analyseEnCours || analyseTerminee) {
        console.log("Analyse déjà effectuée ou en cours, ignorée");
        return;
    }
    
    analyseEnCours = true;
    analyserTableau();
}

// Fonction pour analyser le tableau des notes
function analyserTableau() {
    console.log("Début de l'analyse du tableau...");
    
    // Nettoyer les étiquettes et messages existants
    nettoyerAffichagePrecedent();
    
    // Chercher le premier tableau de la page
    const tableau = document.querySelector("table");
    
    if (!tableau) {
        console.log("Aucun tableau trouvé, affichage d'un message flottant");
        afficherMessageFlottant("Aucun tableau trouvé sur cette page");
        analyseTerminee = true;
        analyseEnCours = false;
        return;
    }
    
    console.log("Tableau trouvé, calcul de la moyenne...");
    calculerEtAfficherMoyenne(tableau);
    
    // Marquer l'analyse comme terminée
    analyseTerminee = true;
    analyseEnCours = false;
}

// Fonction pour nettoyer les éléments ajoutés par l'extension
function nettoyerAffichagePrecedent() {
    // Supprimer les messages flottants
    document.querySelectorAll('.message-flottant-extension').forEach(message => {
        message.remove();
    });
    
    // Supprimer les lignes de moyenne générale
    document.querySelectorAll('.ligne-moyenne-generale').forEach(ligne => {
        ligne.remove();
    });
    
    console.log("Nettoyage des affichages précédents effectué");
}

// Fonction pour afficher un message flottant avec un callback optionnel au clic
function afficherMessageFlottant(texte, callback) {
    // Supprimer les messages existants
    const existants = document.querySelectorAll('.message-flottant-extension');
    existants.forEach(msg => msg.remove());
    
    const message = document.createElement("div");
    message.className = 'message-flottant-extension';
    message.style.position = "fixed";
    message.style.top = "10px";
    message.style.right = "10px";
    message.style.zIndex = "9999";
    message.style.backgroundColor = "#FF5733";
    message.style.color = "white";
    message.style.padding = "15px";
    message.style.borderRadius = "5px";
    message.style.fontWeight = "bold";
    message.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    message.style.maxWidth = "300px";
    message.textContent = texte;
    
    if (callback) {
        message.style.cursor = "pointer";
        message.addEventListener("click", callback);
    }
    
    document.body.appendChild(message);
    console.log("Message flottant affiché:", texte);
    // Effacer le message après 3 secondes
    setTimeout(() => {
        message.remove();
        console.log("Message flottant supprimé après délai");
    }, 3000);
}

// Fonction pour calculer et afficher la moyenne générale
function calculerEtAfficherMoyenne(tableau) {
    console.log("Calcul de la moyenne pour le tableau:", tableau);
    
    try {
        // Supprimer d'abord l'ancienne ligne de moyenne si elle existe
        const anciennes = document.querySelectorAll('.ligne-moyenne-generale');
        anciennes.forEach(ligne => ligne.remove());
        
        // Récupérer toutes les lignes du tableau
        const lignes = tableau.querySelectorAll("tr");
        console.log(`Nombre de lignes dans le tableau: ${lignes.length}`);
        
        // On ne prend pas la première ligne car c'est souvent un en-tête
        let sommeCoeffs = 0;
        let sommeProduits = 0;
        let nbMatieresValides = 0;
        
        // Parcourir chaque ligne à partir de la deuxième
        for (let i = 1; i < lignes.length; i++) {
            const ligne = lignes[i];
            const cellules = ligne.querySelectorAll("td");
            
            // Vérifier si cette ligne contient des données de matière (au moins 3 cellules)
            if (cellules.length < 3) continue;
            
            // Chercher la cellule qui contient la moyenne
            let moyenne = null;
            let coeff = 1;
            
            // On cherche d'abord dans des positions typiques
            const possiblesIndexMoyenne = [4, 3, 2, 1]; // Indices possibles pour la cellule de moyenne (0-based)
            
            for (const idx of possiblesIndexMoyenne) {
                if (cellules[idx] && /^\s*(\d{1,2}([,.]\d{1,2})?)\s*$/.test(cellules[idx].textContent)) {
                    moyenne = parseFloat(cellules[idx].textContent.trim().replace(",", "."));
                    break;
                }
            }
            
            // Si on n'a pas trouvé, on parcourt toutes les cellules
            if (moyenne === null) {
                for (let j = 0; j < cellules.length; j++) {
                    const texte = cellules[j].textContent.trim();
                    if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*$/.test(texte)) {
                        moyenne = parseFloat(texte.replace(",", "."));
                        break;
                    }
                }
            }
            
            // Chercher le coefficient (souvent dans les premières cellules)
            for (let j = 0; j < Math.min(3, cellules.length); j++) {
                const texte = cellules[j].textContent.trim();
                if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*$/.test(texte) && parseFloat(texte.replace(",", ".")) <= 10) {
                    coeff = parseFloat(texte.replace(",", "."));
                    break;
                }
            }
            
            // Si on a trouvé une moyenne valide
            if (moyenne !== null && !isNaN(moyenne) && moyenne >= 0 && moyenne <= 20) {
                sommeCoeffs += coeff;
                sommeProduits += moyenne * coeff;
                nbMatieresValides++;
                console.log(`Matière ${i}: moyenne=${moyenne}, coeff=${coeff}`);
            }
        }
        
        // Calculer la moyenne générale
        if (nbMatieresValides > 0 && sommeCoeffs > 0) {
            const moyenneGenerale = (sommeProduits / sommeCoeffs).toFixed(2);
            console.log(`Moyenne générale calculée: ${moyenneGenerale} (${nbMatieresValides} matières, somme coeffs: ${sommeCoeffs})`);
            
            // Créer une ligne pour afficher la moyenne
            const nouvelleLigne = document.createElement("tr");
            nouvelleLigne.className = 'ligne-moyenne-generale';
            nouvelleLigne.style.backgroundColor = "#f2f2f2";
            nouvelleLigne.style.fontWeight = "bold";
            nouvelleLigne.style.height = "40px";
            nouvelleLigne.style.borderTop = "2px solid #0056b3";
            nouvelleLigne.style.borderBottom = "2px solid #0056b3";
            
            // Déterminer le nombre de colonnes dans le tableau
            const nbColonnes = lignes[0].querySelectorAll("td, th").length;
            
            // Créer la cellule d'étiquette et la cellule de valeur
            const celluleEtiquette = document.createElement("td");
            celluleEtiquette.setAttribute("colspan", Math.max(1, nbColonnes-1));
            celluleEtiquette.style.textAlign = "right";
            celluleEtiquette.style.paddingRight = "15px";
            celluleEtiquette.textContent = "MOYENNE GÉNÉRALE :";
            
            const celluleValeur = document.createElement("td");
            celluleValeur.style.textAlign = "center";
            celluleValeur.style.color = "#0056b3";
            celluleValeur.style.fontSize = "16px";
            celluleValeur.textContent = moyenneGenerale.replace(".", ",");
            
            nouvelleLigne.appendChild(celluleEtiquette);
            nouvelleLigne.appendChild(celluleValeur);
            
            // Insérer au début du tableau
            const tbody = tableau.querySelector("tbody") || tableau;
            if (tbody.firstChild) {
                tbody.insertBefore(nouvelleLigne, tbody.firstChild);
            } else {
                tbody.appendChild(nouvelleLigne);
            }
            
            afficherMessageFlottant(`Moyenne générale calculée: ${moyenneGenerale.replace(".", ",")} (${nbMatieresValides} matières)`);
        } else {
            console.log("Impossible de calculer la moyenne: pas assez de matières valides");
            afficherMessageFlottant("Impossible de calculer la moyenne: aucune matière valide trouvée.");
        }
    } catch (err) {
        console.error("Erreur lors du calcul de la moyenne:", err);
        afficherMessageFlottant("Erreur lors du calcul de la moyenne.");
    }
}
