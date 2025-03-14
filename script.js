document.addEventListener("DOMContentLoaded", function() {
    // On vérifie régulièrement si le tableau des notes est chargé
    const checkInterval = setInterval(function() {
        if (document.querySelector(".notes-eleve")) {
            clearInterval(checkInterval);
            calculerMoyenneGenerale();
        }
    }, 500);
});

// Fonction principale pour calculer et afficher la moyenne générale
function calculerMoyenneGenerale() {
    // On observe les changements dans le DOM pour réagir aux changements de page
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (document.querySelector(".notes-eleve")) {
                afficherMoyenneGenerale();
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Premier affichage
    afficherMoyenneGenerale();
}

// Fonction pour calculer et afficher la moyenne générale
function afficherMoyenneGenerale() {
    // On attend que le tableau soit complètement chargé
    setTimeout(() => {
        // Sélectionne le tableau des moyennes
        const tableauMoyennes = document.querySelector(".notes-eleve");
        
        if (!tableauMoyennes) return;
        
        // Récupère toutes les lignes du tableau (chaque matière)
        const lignesMatiere = tableauMoyennes.querySelectorAll("tr.ng-scope:not(.hidden):not(.groupematiere)");
        
        let sommeCoeffs = 0;
        let sommeProduits = 0;
        
        // Parcours chaque ligne pour récupérer la moyenne et le coefficient
        lignesMatiere.forEach(ligne => {
            // Récupère la cellule de la moyenne (5ème colonne)
            const celluleMoyenne = ligne.querySelector("td:nth-child(5)");
            
            if (!celluleMoyenne) return;
            
            // Récupère la cellule du coefficient (3ème colonne)
            const celluleCoeff = ligne.querySelector("td:nth-child(3)");
            
            // Récupère les valeurs de la moyenne et du coefficient
            const moyenneTexte = celluleMoyenne.textContent.trim();
            const coeffTexte = celluleCoeff ? celluleCoeff.textContent.trim() : "1";
            
            // Convertit en nombres
            const moyenne = parseFloat(moyenneTexte.replace(",", "."));
            const coeff = parseFloat(coeffTexte.replace(",", ".")) || 1;
            
            // Vérifie que la moyenne est un nombre valide
            if (!isNaN(moyenne)) {
                sommeCoeffs += coeff;
                sommeProduits += moyenne * coeff;
            }
        });
        
        // Calcule la moyenne générale
        const moyenneGenerale = sommeCoeffs > 0 ? (sommeProduits / sommeCoeffs).toFixed(2) : "N/A";
        
        // Supprime l'ancienne ligne de moyenne générale si elle existe
        const ancienneLigne = document.getElementById("ligne-moyenne-generale");
        if (ancienneLigne) {
            ancienneLigne.remove();
        }
        
        // Crée une nouvelle ligne pour la moyenne générale
        const nouvelleLigne = document.createElement("tr");
        nouvelleLigne.id = "ligne-moyenne-generale";
        nouvelleLigne.style.backgroundColor = "#f2f2f2";
        nouvelleLigne.style.fontWeight = "bold";
        
        nouvelleLigne.innerHTML = `
            <td colspan="4" style="text-align: right; padding-right: 15px;">MOYENNE GÉNÉRALE :</td>
            <td style="text-align: center; color: #0056b3;">${moyenneGenerale.replace(".", ",")}</td>
            <td colspan="3"></td>
        `;
        
        // Insère la nouvelle ligne au début du tableau
        const tbody = tableauMoyennes.querySelector("tbody");
        if (tbody) {
            tbody.insertBefore(nouvelleLigne, tbody.firstChild);
        } else {
            tableauMoyennes.insertBefore(nouvelleLigne, tableauMoyennes.firstChild);
        }
    }, 1000);
}
