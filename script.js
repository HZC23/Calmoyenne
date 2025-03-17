// Script d'analyse des tableaux pour identifier celui des notes
console.log("Extension Calculateur de Moyenne - Script d'analyse chargé");
console.log("Type de navigateur : " + (typeof browser !== 'undefined' ? "Firefox" : "Chrome"));

// Créer un espace isolé pour éviter les conflits avec des bibliothèques comme MathJax
(function() {
    // Variable pour éviter les analyses multiples
    let analyseEnCours = false;
    let analyseTerminee = false;
    let dernierURL = "";
    let dernierTableauHash = ""; // Pour stocker l'empreinte du dernier tableau analysé
    let dernierCheck = Date.now();
    let contenuPrecedent = ""; // Stocke le contenu précédent pour comparaison directe
    const isFirefox = typeof browser !== 'undefined'; // Détection de Firefox
    
    // Classe détectée de l'élève (par défaut: non détectée)
    let classeEleve = "";
    
    // Essayer de récupérer la classe sauvegardée dans le stockage local
    try {
        const classeEnregistree = localStorage.getItem('calmoyenne_classe');
        if (classeEnregistree) {
            classeEleve = classeEnregistree;
            console.log(`Classe chargée depuis le stockage local: ${classeEleve}`);
        }
    } catch (e) {
        console.error("Erreur lors de la récupération de la classe enregistrée:", e);
    }
    
    // Définition des coefficients par défaut selon la classe
    // Basé sur le tableau officiel du Ministère de l'Éducation nationale de Côte d'Ivoire (2021-2022)
    const coefficientsParClasse = {
        '6': { // 6ème
            'Français': 4,
            'FRANCAIS': 4,
            'Maths': 3,
            'Mathématiques': 3,
            'MATHEMATIQUES': 3,
            'Histoire-Géo': 2,
            'Histoire-Géographie': 2,
            'HISTOIRE & GEOGRAPH.': 2,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'LCA Latin': 1,
            'LCA Grec': 1,
            'SVT': 2,
            'SCIENCES VIE & TERRE': 2,
            'Physique-Chimie': 2,
            'PHYSIQUE-CHIMIE': 2,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        '5': { // 5ème
            'Français': 3,
            'FRANCAIS': 3,
            'Maths': 3,
            'Mathématiques': 3,
            'MATHEMATIQUES': 3,
            'Histoire-Géo': 2,
            'Histoire-Géographie': 2,
            'HISTOIRE & GEOGRAPH.': 2,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'LCA Latin': 1,
            'LCA Grec': 1,
            'SVT': 2,
            'SCIENCES VIE & TERRE': 2,
            'Physique-Chimie': 2,
            'PHYSIQUE-CHIMIE': 2,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        '4': { // 4ème
            'Français': 3,
            'FRANCAIS': 3,
            'Maths': 3,
            'Mathématiques': 3,
            'MATHEMATIQUES': 3,
            'Histoire-Géo': 2,
            'Histoire-Géographie': 2,
            'HISTOIRE & GEOGRAPH.': 2,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'LCA Latin': 1,
            'LCA Grec': 1,
            'SVT': 2,
            'SCIENCES VIE & TERRE': 2,
            'Physique-Chimie': 2,
            'PHYSIQUE-CHIMIE': 2,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        '3': { // 3ème
            'Français': 3,
            'FRANCAIS': 3,
            'Maths': 3,
            'Mathématiques': 3,
            'MATHEMATIQUES': 3,
            'Histoire-Géo': 2,
            'Histoire-Géographie': 2,
            'HISTOIRE & GEOGRAPH.': 2,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'LCA Latin': 1,
            'LCA Grec': 1,
            'SVT': 2,
            'SCIENCES VIE & TERRE': 2,
            'Physique-Chimie': 2,
            'PHYSIQUE-CHIMIE': 2,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        '2': { // 2nde (2-A)
            'Français': 3,
            'FRANCAIS': 3,
            'Maths': 3,
            'Mathématiques': 3,
            'MATHEMATIQUES': 3,
            'Histoire-Géo': 3,
            'Histoire-Géographie': 3,
            'HISTOIRE & GEOGRAPH.': 3,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'LCA Latin': 1,
            'LCA Grec': 1,
            'SVT': 2,
            'SCIENCES VIE & TERRE': 2,
            'Physique-Chimie': 2,
            'PHYSIQUE-CHIMIE': 2,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'SES': 2,
            'SNT': 1,
            'TECHNOLOGIE': 1
        },
        '2C': { // 2nde C
            'Français': 3,
            'FRANCAIS': 3,
            'Maths': 5,
            'Mathématiques': 5,
            'MATHEMATIQUES': 5,
            'Histoire-Géo': 2,
            'Histoire-Géographie': 2,
            'HISTOIRE & GEOGRAPH.': 2,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'SVT': 2,
            'SCIENCES VIE & TERRE': 2,
            'Physique-Chimie': 4,
            'PHYSIQUE-CHIMIE': 4,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        '1': { // 1ère A
            'Français': 4,
            'FRANCAIS': 4,
            'Maths': 3,
            'Mathématiques': 3,
            'MATHEMATIQUES': 3,
            'Histoire-Géo': 3,
            'Histoire-Géographie': 3,
            'HISTOIRE & GEOGRAPH.': 3,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'Philosophie': 3,
            'SVT': 1,
            'SCIENCES VIE & TERRE': 1,
            'Physique-Chimie': 1,
            'PHYSIQUE-CHIMIE': 1,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        '1C': { // 1ère C
            'Français': 2,
            'FRANCAIS': 2,
            'Maths': 5,
            'Mathématiques': 5,
            'MATHEMATIQUES': 5,
            'Histoire-Géo': 2,
            'Histoire-Géographie': 2,
            'HISTOIRE & GEOGRAPH.': 2,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'Philosophie': 2,
            'SVT': 5,
            'SCIENCES VIE & TERRE': 5,
            'Physique-Chimie': 5,
            'PHYSIQUE-CHIMIE': 5,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        '1D': { // 1ère D
            'Français': 2,
            'FRANCAIS': 2,
            'Maths': 4,
            'Mathématiques': 4,
            'MATHEMATIQUES': 4,
            'Histoire-Géo': 2,
            'Histoire-Géographie': 2,
            'HISTOIRE & GEOGRAPH.': 2,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'Philosophie': 2,
            'SVT': 4,
            'SCIENCES VIE & TERRE': 4,
            'Physique-Chimie': 4,
            'PHYSIQUE-CHIMIE': 4,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        'T': { // Terminale A
            'Philosophie': 4,
            'Maths': 1,
            'Mathématiques': 1,
            'MATHEMATIQUES': 1,
            'Histoire-Géo': 3,
            'Histoire-Géographie': 3,
            'HISTOIRE & GEOGRAPH.': 3,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'SVT': 2,
            'SCIENCES VIE & TERRE': 2,
            'Physique-Chimie': 2,
            'PHYSIQUE-CHIMIE': 2,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        'TC': { // Terminale C
            'Philosophie': 2,
            'Maths': 5,
            'Mathématiques': 5,
            'MATHEMATIQUES': 5,
            'Histoire-Géo': 2,
            'Histoire-Géographie': 2,
            'HISTOIRE & GEOGRAPH.': 2,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'SVT': 2,
            'SCIENCES VIE & TERRE': 2,
            'Physique-Chimie': 5,
            'PHYSIQUE-CHIMIE': 5,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        },
        'TD': { // Terminale D
            'Philosophie': 2,
            'Maths': 4,
            'Mathématiques': 4,
            'MATHEMATIQUES': 4,
            'Histoire-Géo': 2,
            'Histoire-Géographie': 2,
            'HISTOIRE & GEOGRAPH.': 2,
            'Anglais': 2,
            'LV1': 2,
            'ANGLAIS LV1': 2,
            'LV2': 1,
            'ALLEMAND LV2': 1,
            'Espagnol': 1,
            'Allemand': 1,
            'Italien': 1,
            'SVT': 4,
            'SCIENCES VIE & TERRE': 4,
            'Physique-Chimie': 4,
            'PHYSIQUE-CHIMIE': 4,
            'Arts Plastiques': 1,
            'ARTS PLASTIQUES': 1,
            'Dessin': 1,
            'Musique': 1,
            'Ed.Musicale': 1,
            'EDUCATION MUSICALE': 1,
            'EPS': 1,
            'ED.PHYSIQUE & SPORT.': 1,
            'EDHC': 1,
            'Enseignement Moral et Civique': 1,
            'EMC': 1,
            'ENS. MORAL & CIVIQUE': 1,
            'TECHNOLOGIE': 1
        }
    };
    
    // Fonction pour obtenir un identifiant simple du contenu d'un tableau
    function getTableauContenu(tableau) {
        if (!tableau) return "";
        try {
            // Prendre juste le texte des cellules pour une comparaison plus légère
            return Array.from(tableau.querySelectorAll("td"))
                .slice(0, 20) // Limiter pour performance
                .map(td => td.textContent.trim())
                .join("|");
        } catch (e) {
            console.error("Erreur dans getTableauContenu:", e);
            return "";
        }
    }
    
    // Fonction pour calculer une empreinte simple d'un tableau
    function calculerHashTableau(tableau) {
        if (!tableau) return "";
        // Prendre les 10 premières lignes max pour éviter les calculs trop lourds
        const lignes = Array.from(tableau.querySelectorAll("tr")).slice(0, 10);
        let contenu = "";
        
        for (const ligne of lignes) {
            contenu += ligne.textContent.trim() + "|";
        }
        
        return contenu;
    }

    // Observer les changements de navigation
    const observateurURL = new MutationObserver((mutations) => {
        // Ne vérifier que si l'URL a changé
        if (window.location.href !== dernierURL) {
            console.log("Changement de page détecté: " + window.location.href);
            dernierURL = window.location.href;
            analyseTerminee = false;
            setTimeout(lancerAnalyse, 1000);
        }
    });
    
    // Observer les changements dans les tableaux pour détecter les changements de trimestre
    const observateurTableaux = new MutationObserver((mutations) => {
        if (analyseEnCours) return;
        
        // Vérifier si les mutations affectent potentiellement un tableau
        const tableauAffecte = mutations.some(mutation => {
            // Si mutation concerne un tableau ou un élément contenant un tableau
            try {
                // Vérifier si la cible est un élément valide
                if (mutation.target && mutation.target.nodeType === 1) {
                    // Si c'est un tableau
                    if (mutation.target.tagName === 'TABLE') return true;
                    
                    // Si contient un tableau
                    if (mutation.target.querySelector && mutation.target.querySelector('table')) return true;
                }
                
                // Vérifier les nœuds ajoutés pour détecter un tableau
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    return Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType !== 1) return false;
                        if (node.tagName === 'TABLE') return true;
                        return node.querySelector && !!node.querySelector('table');
                    });
                }
            } catch (e) {
                console.error("Erreur dans la détection de tableau:", e);
            }
            return false;
        });
        
        if (tableauAffecte) {
            console.log("Modification potentielle de tableau détectée");
            verifierChangementTableau();
        }
    });
    
    // Fonction centrale pour vérifier si le tableau a changé
    function verifierChangementTableau() {
        const tableau = document.querySelector("table");
        if (!tableau) return false;
        
        try {
            // Vérification double avec deux méthodes différentes
            const nouveauHash = calculerHashTableau(tableau);
            const nouveauContenu = getTableauContenu(tableau);
            
            // Si l'une des deux méthodes détecte un changement
            if ((nouveauHash !== dernierTableauHash && nouveauHash !== "") || 
                (nouveauContenu !== contenuPrecedent && nouveauContenu !== "")) {
                
                console.log("CHANGEMENT DE CONTENU DU TABLEAU DÉTECTÉ!");
                
                // Mettre à jour les deux valeurs
                dernierTableauHash = nouveauHash;
                contenuPrecedent = nouveauContenu;
                
                // Relancer l'analyse
                analyseTerminee = false;
                setTimeout(lancerAnalyse, 500);
                dernierCheck = Date.now();
                return true;
            }
        } catch (e) {
            console.error("Erreur lors de la vérification du changement:", e);
        }
        return false;
    }

    // Attendre que la page soit complètement chargée
    window.addEventListener("load", function() {
        console.log("Page entièrement chargée, démarrage de l'analyse...");
        console.log("URL actuelle: " + window.location.href);
        dernierURL = window.location.href;
        
        // Configuration des observateurs
        try {
            // Observer les changements d'URL
            observateurURL.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Observer les changements dans les tableaux
            observateurTableaux.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
            
            console.log("Observateurs DOM configurés avec succès");
            
            // Configuration spécifique pour Firefox
                if (isFirefox) {
                // Observer les modifications du DOM avec le nouveau MutationObserver
                observateurNodesAjoutes.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                console.log("Observateurs modernes configurés pour Firefox");
            }
            
            // Rechercher et surveiller les éléments spécifiques qui pourraient être des sélecteurs de période
            setTimeout(() => {
                try {
                    // Sélecteurs pour les contrôles potentiels de périodes
                    const selecPeriodes = document.querySelectorAll(
                        'select, button, .btn, .button, .periode, .trimestre, .nav-item, ' +
                        '.nav-link, .tab, .tabs-item, .onglet, [role="tab"], .menu-item, ' +
                        '.dropdown-item, .selecteur, .selector, [data-periode]'
                    );
                    
                    if (selecPeriodes.length > 0) {
                        console.log(`${selecPeriodes.length} éléments potentiels de sélection trouvés`);
                        
                        selecPeriodes.forEach(elem => {
                            ['click', 'change', 'mouseup'].forEach(evt => {
                                elem.addEventListener(evt, function(e) {
                                    console.log(`Événement ${evt} sur sélecteur potentiel:`, elem.tagName);
                                    // Vérifications multiples après interaction
                                    for (let i = 1; i <= 5; i++) {
                                        setTimeout(() => verifierChangementTableau(), i * 350);
                                    }
                                });
                            });
                        });
                    }
                } catch (err) {
                    console.error("Erreur lors de la surveillance des sélecteurs de période:", err);
                }
            }, 1500);
            
            // Pour Firefox: vérification périodique très fréquente
            if (isFirefox) {
                // Vérification toutes les secondes au début
                for (let i = 1; i <= 10; i++) {
                    setTimeout(() => verifierChangementTableau(), i * 1000);
                }
                
                // Puis vérification régulière toutes les 2 secondes
                setInterval(() => {
                    if (Date.now() - dernierCheck > 2000 && !analyseEnCours) {
                        dernierCheck = Date.now();
                        verifierChangementTableau();
                    }
                }, 2000);
            }
            
            // Ajouter un bouton de recalcul manuel pour Firefox
            if (isFirefox) {
                setTimeout(() => {
                    const boutonRecalcul = document.createElement('button');
                    boutonRecalcul.textContent = '↻ Recalculer moyenne';
                    boutonRecalcul.style.position = 'fixed';
                    boutonRecalcul.style.bottom = '10px';
                    boutonRecalcul.style.right = '10px';
                    boutonRecalcul.style.zIndex = '9999';
                    boutonRecalcul.style.backgroundColor = '#0056b3';
                    boutonRecalcul.style.color = 'white';
                    boutonRecalcul.style.border = 'none';
                    boutonRecalcul.style.borderRadius = '4px';
                    boutonRecalcul.style.padding = '8px 15px';
                    boutonRecalcul.style.cursor = 'pointer';
                    boutonRecalcul.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
                    
                    boutonRecalcul.addEventListener('click', function() {
                        // Forcer l'analyse indépendamment du hash
                        analyseTerminee = false;
                        dernierTableauHash = "";
                        contenuPrecedent = "";
                        setTimeout(lancerAnalyse, 100);
                        this.textContent = '✓ Recalcul lancé';
                        setTimeout(() => {
                            this.textContent = '↻ Recalculer moyenne';
                        }, 2000);
                    });
                    
                    document.body.appendChild(boutonRecalcul);
                    console.log("Bouton de recalcul manuel ajouté pour Firefox");
                }, 5000);
            }
            
        } catch (err) {
            console.error("Erreur lors de la configuration des observateurs:", err);
        }
        
        // Premier lancement
        setTimeout(lancerAnalyse, 3000);
        
        // Ajouter le bouton de classe flottant
        setTimeout(ajouterBoutonClasse, 1000);
    });

    // Fonction d'initialisation qui évite les analyses multiples
    function lancerAnalyse() {
        console.log("Tentative de lancement d'analyse...");
        
        if (analyseEnCours) {
            console.log("Analyse déjà en cours, ignorée");
            return;
        }
        
        // On vérifie si c'est le même tableau qu'on a déjà analysé
        const tableau = document.querySelector("table");
        if (tableau) {
            const nouveauHash = calculerHashTableau(tableau);
            const nouveauContenu = getTableauContenu(tableau);
            
            if (analyseTerminee && nouveauHash === dernierTableauHash && nouveauContenu === contenuPrecedent) {
                console.log("Analyse déjà effectuée pour ce tableau, ignorée");
                return;
            }
            
            dernierTableauHash = nouveauHash;
            contenuPrecedent = nouveauContenu;
        }
        
        analyseEnCours = true;
        console.log("Lancement de l'analyse...");
        analyserTableau();
    }

    // Fonction pour nettoyer les répétitions excessives de coefficients
    function nettoyerCoefficientsRepetes(texte) {
        if (!texte) return texte;
        
        // Cas extrême: très longue chaîne de "Coef X" répétés des centaines de fois
        if (texte.length > 50 && texte.includes("Coef")) {
            // Compter les occurrences de "Coef"
            const occurences = (texte.match(/Coef/g) || []).length;
            
            if (occurences > 1) {
                console.log(`Détection d'une répétition de coefficients (${occurences} fois)`);
                
                // Vérifier s'il y a du texte avant le premier "Coef"
                const partiesTexte = texte.split(/Coef\s+\d+(\.\d+)?/i);
                const debutTexte = partiesTexte[0].trim();
                
                // Extraire le premier coefficient complet
                const premierCoeffMatch = texte.match(/Coef\s+(\d+(\.\d+)?)/i);
                if (premierCoeffMatch) {
                    const valeurCoeff = premierCoeffMatch[1];
                    
                    // Reformater le texte avec un seul coefficient
                    if (debutTexte) {
                        return `${debutTexte} (Coef ${valeurCoeff})`;
                    } else {
                        return `Coef ${valeurCoeff}`;
                    }
                }
            }
        }
        
        // Préserve la casse originale pour la sortie mais utilise une version
        // en minuscules pour la détection
        let texteOriginal = texte;
        let texteMinuscule = texte.toLowerCase();
        let texteNettoye = texteOriginal;
        
        // Recherche tous les coefficients dans le texte
        const listeCoeffs = Array.from(texteMinuscule.matchAll(/coef\s+(\d+(\.\d+)?)/gi));
        
        // S'il y a plus d'un coefficient et qu'ils sont tous identiques
        if (listeCoeffs.length > 1) {
            const valeurs = listeCoeffs.map(match => match[1]);
            const toutesIdentiques = valeurs.every(val => val === valeurs[0]);
            
            if (toutesIdentiques) {
                // Extraire le texte avant le premier coefficient
                const indexPremierCoeff = texteMinuscule.indexOf("coef");
                const debutTexte = indexPremierCoeff > 0 ? texteOriginal.substring(0, indexPremierCoeff).trim() : "";
                
                // Reconstruire avec un seul coefficient (préserver la casse du mot "Coef" original)
                const coefOriginal = texteOriginal.substring(indexPremierCoeff, indexPremierCoeff + 4);
                
                if (debutTexte) {
                    texteNettoye = `${debutTexte} (${coefOriginal} ${valeurs[0]})`;
                } else {
                    texteNettoye = `${coefOriginal} ${valeurs[0]}`;
                }
            }
        }
        
        // Cas particulier: texte qui contient uniquement des répétitions de coefficients
        if (texteMinuscule.trim().startsWith("coef ") && listeCoeffs.length > 1) {
            // Extraire le premier coefficient et préserver la casse originale
            const premierCoeffIndex = texteOriginal.search(/Coef\s+\d+(\.\d+)?/i);
            if (premierCoeffIndex >= 0) {
                const match = texteOriginal.substring(premierCoeffIndex).match(/Coef\s+\d+(\.\d+)?/i);
                if (match) {
                    texteNettoye = match[0];
                }
            }
        }
        
        // Supprimer les espaces multiples
        return texteNettoye.replace(/\s{2,}/g, ' ').trim();
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
        
        // Détecter la classe de l'élève au début de l'analyse
        classeEleve = detecterClasseEleve();
        console.log(`Classe détectée: ${classeEleve || "Non détectée"}`);
        
        console.log("Tableau trouvé, calcul de la moyenne...");
        calculerEtAfficherMoyenne(tableau);
        
        // Marquer l'analyse comme terminée
        analyseTerminee = true;
        analyseEnCours = false;
        
        // Ajouter le bouton de classe flottant
        setTimeout(ajouterBoutonClasse, 1000);
    }

    // Fonction pour nettoyer les éléments ajoutés par l'extension
    function nettoyerAffichagePrecedent() {
        try {
            // Supprimer les messages flottants
            document.querySelectorAll('.message-flottant-extension').forEach(message => {
                message.remove();
            });
            
            // Supprimer les lignes de moyenne générale
            document.querySelectorAll('.ligne-moyenne-generale').forEach(ligne => {
                ligne.remove();
            });
            
            console.log("Nettoyage des affichages précédents effectué");
        } catch (err) {
            console.error("Erreur lors du nettoyage des affichages précédents:", err);
        }
    }

    // Fonction pour afficher un message flottant avec un callback optionnel au clic
    function afficherMessageFlottant(texte, callback) {
        try {
            // Supprimer les messages existants
            const existants = document.querySelectorAll('.message-flottant-extension');
            existants.forEach(msg => msg.remove());
            
            const message = document.createElement("div");
            message.className = 'message-flottant-extension';
            message.style.position = "fixed";
            message.style.top = "10px";
            message.style.left = "10px";
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
        } catch (err) {
            console.error("Erreur lors de l'affichage du message flottant:", err);
        }
    }

    // Fonction pour calculer et afficher la moyenne générale
    function calculerEtAfficherMoyenne(tableau) {
        console.log("Calcul de la moyenne pour le tableau:", tableau);
        
        try {
            // Variables pour le calcul
            let sommeCoeffs = 0;
            let sommeProduits = 0;
            let nbMatieresValides = 0;
            const matieresDetectees = [];
            let classeEleve = detecterClasseEleve();
            
            // Initialiser possiblesIndexMoyenne comme un tableau vide
            let possiblesIndexMoyenne = [];
            
            // Essayer de récupérer la classe dans le stockage local si elle existe
            try {
                const classeStockee = localStorage.getItem('calmoyenne_classe');
                if (classeStockee) {
                    classeEleve = classeStockee;
                    console.log(`Classe récupérée depuis le stockage local: ${classeEleve}`);
                }
            } catch (e) {
                console.error("Erreur lors de la récupération de la classe stockée:", e);
            }
            
            // Vérifier si le tableau contient des données
            const lignes = tableau.querySelectorAll("tr");
            
            if (lignes.length <= 1) {
                console.log("Tableau trop petit, pas de calcul de moyenne");
                return;
            }
            
            // Parcourir les lignes du tableau (sauf l'en-tête)
            for (let i = 1; i < lignes.length; i++) {
                const ligne = lignes[i];
                
                // Variables pour cette ligne
                let moyenne = null;
                let coeff = null;
                let coeffSource = "";
                let matiereNom = null;
                let indexMoyenne = -1; // Pour la colonne de moyenne
                
                // Vérifier si cette ligne contient des données de matière (au moins 3 cellules)
                if (ligne.querySelectorAll("td").length < 3) {
                    console.log(`Ligne ${i} ignorée: pas assez de cellules (${ligne.querySelectorAll("td").length})`);
                    continue;
                }
                
                // Chercher la cellule qui contient la moyenne
                let moyenneCellule = ligne.querySelectorAll("td")[0];
                if (moyenneCellule) {
                    // Nettoyer le texte de la matière en supprimant complètement tous les coefficients
                    const texteOriginal = moyenneCellule.textContent.trim();
                    
                    // Extraire seulement la partie avant tout "Coef"
                    const partieMatiere = texteOriginal.split(/Coef\s+\d+/i)[0].trim();
                    
                    // S'il y a un nom de professeur, le conserver
                    const partiesProfesseur = partieMatiere.match(/(.+)M[a-zéèê\.]+\s+[A-Z]/);
                    
                    if (partiesProfesseur && partiesProfesseur[1]) {
                        matiereNom = partiesProfesseur[1].trim();
                    } else {
                        matiereNom = partieMatiere;
                    }
                    
                    // Si il y a des coefficients dans le texte original, nettoyer la cellule
                    if (texteOriginal.includes("Coef")) {
                        try {
                            // Sauvegarder le contenu original dans un attribut de données
                            moyenneCellule.setAttribute("data-original-content", texteOriginal);
                            // Remplacer le texte visible par seulement le nom de la matière
                            moyenneCellule.textContent = matiereNom;
                            console.log(`Nettoyage complet des coefficients pour ${matiereNom}`);
                        } catch (e) {
                            console.error("Erreur lors du nettoyage de la cellule:", e);
                        }
                    }
                    
                    console.log(`Matière trouvée: ${matiereNom}`);
                }
                
                // Recherche améliorée de la moyenne
                // 1. Chercher dans les en-têtes du tableau s'il y a une colonne "Moyenne"
                let possiblesIndexMoyenne = [];
                
                if (i === 1) { // Seulement pour la première ligne de données
                    const enTetes = tableau.querySelectorAll("th");
                    for (let j = 0; j < enTetes.length; j++) {
                        const texte = enTetes[j].textContent.trim().toLowerCase();
                        if (texte.includes("moyenne") || texte === "moy" || texte === "moy." || 
                            texte.includes("note") || texte.includes("résultat") || texte.includes("resultat") ||
                            texte.includes("eval") || texte.includes("éval")) {
                            indexMoyenne = j;
                            console.log(`Colonne de moyenne identifiée à l'index ${j}`);
                            break;
                        }
                    }
                }
                
                // 2. Si on a identifié la colonne de moyenne, l'utiliser directement
                if (indexMoyenne !== -1 && indexMoyenne < ligne.querySelectorAll("td").length) {
                    const texte = ligne.querySelectorAll("td")[indexMoyenne].textContent.trim();
                    // Regex améliorée pour détecter plus de formats: "15,2" "15.2" "15,2/20" "15.2/20" "15/20" "7,5/10"
                    if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*\/?(20|10)?\s*$/.test(texte)) {
                        const valeurNumerique = texte.replace(",", ".").match(/\d{1,2}([,.]\d{1,2})?/)[0];
                        moyenne = parseFloat(valeurNumerique);
                        
                        // Convertir la note sur 10 en note sur 20 si nécessaire
                        if (texte.includes("/10")) {
                            moyenne = moyenne * 2;
                            console.log(`Moyenne trouvée sur 10 et convertie en /20: ${moyenne}`);
                        } else {
                        console.log(`Moyenne trouvée dans la colonne identifiée (${indexMoyenne}): ${moyenne}`);
                        }
                    }
                }
                
                // 3. Si pas trouvé, chercher dans les positions typiques
                if (moyenne === null) {
                    possiblesIndexMoyenne = [4, 3, 2, 1, ligne.querySelectorAll("td").length - 1, ligne.querySelectorAll("td").length - 2]; // Plus de positions
                    
                    for (const idx of possiblesIndexMoyenne) {
                        if (idx >= 0 && idx < ligne.querySelectorAll("td").length) {
                            const texte = ligne.querySelectorAll("td")[idx].textContent.trim();
                            // Regex améliorée pour détecter plus de formats
                            if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*\/?(20|10)?\s*$/.test(texte)) {
                                const valeurNumerique = texte.replace(",", ".").match(/\d{1,2}([,.]\d{1,2})?/)[0];
                                moyenne = parseFloat(valeurNumerique);
                                
                                // Convertir la note sur 10 en note sur 20 si nécessaire
                                if (texte.includes("/10")) {
                                    moyenne = moyenne * 2;
                                    console.log(`Moyenne trouvée sur 10 et convertie en /20: ${moyenne}`);
                                } else {
                            console.log(`Moyenne trouvée dans la cellule d'index ${idx}: ${moyenne}`);
                                }
                            break;
                            }
                        }
                    }
                }
                
                // 4. Si toujours pas trouvé, parcourir toutes les cellules en cherchant un format de note
                if (moyenne === null) {
                    for (let j = 0; j < ligne.querySelectorAll("td").length; j++) {
                        // Ignorer les cellules déjà vérifiées dans les étapes précédentes
                        if (possiblesIndexMoyenne.includes(j) || j === indexMoyenne) continue;
                        
                        const texte = ligne.querySelectorAll("td")[j].textContent.trim();
                        
                        // Différentes regex pour capturer différents formats de notes
                        const regexFormats = [
                            /^\s*(\d{1,2}([,.]\d{1,2})?)\s*\/?(20|10)?\s*$/,           // Format standard: 15,5 ou 15,5/20
                            /^\s*(\d{1,2}([,.]\d{1,2})?)\s*\/\s*(20|10)\s*$/,          // Format avec espace: 15,5 / 20
                            /^\s*note\s*:?\s*(\d{1,2}([,.]\d{1,2})?)\s*\/?(20|10)?\s*$/i,  // Format avec "note:" devant
                            /^\s*moy\w*\s*:?\s*(\d{1,2}([,.]\d{1,2})?)\s*\/?(20|10)?\s*$/i // Format avec "moyenne:" devant
                        ];
                        
                        let aFormatDeNote = false;
                        let valeurNumerique = null;
                        let estSur10 = false;
                        
                        // Tester chaque format
                        for (const regex of regexFormats) {
                            const match = texte.match(regex);
                            if (match) {
                                valeurNumerique = match[1].replace(",", ".");
                                estSur10 = texte.includes("/10");
                                aFormatDeNote = true;
                                break;
                            }
                        }
                        
                        if (aFormatDeNote && valeurNumerique) {
                            moyenne = parseFloat(valeurNumerique);
                            
                            // Convertir si note sur 10
                            if (estSur10) {
                                moyenne = moyenne * 2;
                                console.log(`Moyenne trouvée sur 10 et convertie en /20: ${moyenne}`);
                            } else {
                                console.log(`Moyenne trouvée dans la cellule d'index ${j}: ${moyenne}`);
                            }
                            
                            // Vérifier si la valeur semble être une moyenne valide (entre 0 et 20)
                            if (moyenne >= 0 && moyenne <= 20) {
                                break;
                            } else {
                                console.log(`Valeur ${moyenne} ignorée car hors plage d'une note standard`);
                                moyenne = null; // Réinitialiser si hors plage
                            }
                        }
                    }
                }
                
                // 5. Chercher des indices textuels dans les cellules adjacentes
                if (moyenne === null) {
                    const textesIndicateurs = ["moyenne", "moy", "general", "générale", "résultat", "note", 
                                              "eval", "éval", "bilan", "trimestre", "semestre"];
                    
                    for (let j = 0; j < ligne.querySelectorAll("td").length; j++) {
                        const texte = ligne.querySelectorAll("td")[j].textContent.trim().toLowerCase();
                        
                        // Vérifier si le texte contient un des indicateurs
                        const contientIndicateur = textesIndicateurs.some(indicateur => texte.includes(indicateur));
                        
                        if (contientIndicateur) {
                            // Vérifier les cellules voisines (précédente, suivante, et à côté)
                            const cellulesAVerifier = [j+1, j-1, j+2];
                            
                            for (const indexCellule of cellulesAVerifier) {
                                if (indexCellule >= 0 && indexCellule < ligne.querySelectorAll("td").length) {
                                    const valeurTexte = ligne.querySelectorAll("td")[indexCellule].textContent.trim();
                                    // Utiliser la même regex améliorée
                                    if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*\/?(20|10)?\s*$/.test(valeurTexte)) {
                                        const valeurNumerique = valeurTexte.replace(",", ".").match(/\d{1,2}([,.]\d{1,2})?/)[0];
                                        moyenne = parseFloat(valeurNumerique);
                                        
                                        // Convertir la note sur 10 en note sur 20 si nécessaire
                                        if (valeurTexte.includes("/10")) {
                                            moyenne = moyenne * 2;
                                            console.log(`Moyenne trouvée sur 10 et convertie en /20: ${moyenne}`);
                                        } else {
                                            console.log(`Moyenne trouvée près d'un indicateur à l'index ${indexCellule}: ${moyenne}`);
                                        }
                                        
                                        if (moyenne >= 0 && moyenne <= 20) {
                                    break;
                                        } else {
                                            moyenne = null;
                                        }
                                    }
                                }
                            }
                            
                            if (moyenne !== null) break; // Sortir de la boucle si on a trouvé une moyenne valide
                        }
                    }
                }
                
                // 6. Recherche avancée : parcourir toutes les cellules et analyser les textes complexes
                if (moyenne === null) {
                    for (let j = 0; j < ligne.querySelectorAll("td").length; j++) {
                        const texte = ligne.querySelectorAll("td")[j].textContent.trim();
                        
                        // Rechercher des patterns comme "Moyenne: 12,5/20" ou "Note: 14/20"
                        const complexMatch = texte.match(/(?:moyenne|note|résultat|bilan)\s*:?\s*(\d{1,2}([,.]\d{1,2})?)\s*\/?\s*(20|10)?/i);
                        
                        if (complexMatch) {
                            const valeurNumerique = complexMatch[1].replace(",", ".");
                            moyenne = parseFloat(valeurNumerique);
                            
                            // Convertir la note sur 10 en note sur 20 si nécessaire
                            if (complexMatch[3] === "10") {
                                moyenne = moyenne * 2;
                                console.log(`Moyenne complexe trouvée sur 10 et convertie en /20: ${moyenne}`);
                            } else {
                                console.log(`Moyenne complexe trouvée dans la cellule d'index ${j}: ${moyenne}`);
                            }
                            
                            if (moyenne >= 0 && moyenne <= 20) {
                                        break;
                            } else {
                                moyenne = null;
                            }
                        }
                    }
                }
                
                // Essayer d'abord d'obtenir le coefficient selon la classe et la matière
                let coeffClasse = null;
                if (classeEleve && matiereNom) {
                    const resultatCoeff = suggererCoefficient(matiereNom, classeEleve);
                    if (resultatCoeff !== null) {
                        coeff = resultatCoeff.valeur;
                        coeffSource = resultatCoeff.source;
                        console.log(`Coefficient ${coeff} appliqué pour ${matiereNom} (source: ${coeffSource})`);
                    }
                }
                
                // Si aucun coefficient n'a été trouvé via la classe, utiliser la valeur par défaut
                if (coeff === null) {
                    coeff = 1; // Coefficient par défaut
                    coeffSource = "défaut";
                    console.log(`Aucun coefficient trouvé pour ${matiereNom}, utilisation du coefficient par défaut: ${coeff}`);
                }
                
                // Suppression de la détection automatique des coefficients
                
                // Ajouter la ligne au résultat
                if (moyenne !== null) {
                    sommeCoeffs += coeff;
                    sommeProduits += moyenne * coeff;
                    nbMatieresValides++;
                    console.log(`Matière ${matiereNom || i}: moyenne=${moyenne}, coeff=${coeff} (source: ${coeffSource})`);
                    
                    // Stocker les informations de la matière pour le tableau récapitulatif
                    matieresDetectees.push({
                        nom: matiereNom,
                        moyenne: moyenne,
                        coefficient: coeff,
                        produit: moyenne * coeff,
                        coeffSource: coeffSource
                    });
                    
                    // Mettre en évidence les valeurs utilisées pour le calcul
                    try {
                        // Ajouter des styles spécifiques pour les coefficients de classe
                        const couleurCoeff = coeffSource.includes("classe") ? "#e6fffa" : "#e6f7ff";
                        const bordureCoeff = coeffSource.includes("classe") ? "#5cdbd3" : "#91d5ff";
                        
                        // Mettre en évidence le coefficient
                        const coeffDetecte = coeffSource !== "classe";
                        if (coeffDetecte) {
                            ligne.querySelectorAll("td").forEach((cellule, index) => {
                                const texte = cellule.textContent.trim().replace(",", ".");
                                
                                // Mise en évidence du coefficient
                                if (texte == coeff.toString() && index < 5) {
                                    cellule.style.backgroundColor = couleurCoeff;
                                    cellule.style.fontWeight = "bold";
                                    cellule.style.border = `1px solid ${bordureCoeff}`;
                                    cellule.setAttribute("title", `Coefficient ${coeff} ${coeffSource.includes("classe") ? "(basé sur votre niveau scolaire)" : "utilisé"}`);
                                }
                            });
                        }
                        
                        // Toujours mettre en évidence la moyenne
                        ligne.querySelectorAll("td").forEach((cellule, index) => {
                            const texte = cellule.textContent.trim().replace(",", ".");
                            
                            // Mise en évidence de la moyenne
                            if (texte == moyenne.toString() || texte == moyenne.toFixed(2).replace(".", ",")) {
                                cellule.style.backgroundColor = "#f6ffed";
                                cellule.style.fontWeight = "bold";
                                cellule.style.border = "1px solid #b7eb8f";
                                
                                // Adapter le tooltip selon la source du coefficient
                                let tooltipText = `Moyenne: ${moyenne}`;
                                if (coeffSource.includes("classe")) {
                                    tooltipText += ` × Coefficient ${coeff} (adapté à votre classe de ${classeEleve})`;
                                } else {
                                    tooltipText += ` × Coefficient ${coeff}`;
                                }
                                tooltipText += ` = ${(moyenne * coeff).toFixed(2)}`;
                                
                                cellule.setAttribute("title", tooltipText);
                            }
                        });
                        
                        // Ajouter un badge sur la ligne pour indiquer la source du coefficient
                        if (coeffSource.includes("classe")) {
                            // S'assurer qu'aucun badge n'existe déjà
                            const badgesExistants = ligne.querySelectorAll('.badge-coefficient');
                            badgesExistants.forEach(badge => badge.remove());
                            
                            const badgeCoeff = document.createElement("span");
                            badgeCoeff.className = 'badge-coefficient';
                            badgeCoeff.textContent = `Coef ${coeff}`;
                            badgeCoeff.style.backgroundColor = "#13c2c2";
                            badgeCoeff.style.color = "white";
                            badgeCoeff.style.padding = "2px 5px";
                            badgeCoeff.style.borderRadius = "3px";
                            badgeCoeff.style.marginLeft = "5px";
                            badgeCoeff.style.fontWeight = "bold";
                            badgeCoeff.setAttribute("title", `Coefficient adapté à votre classe de ${classeEleve}`);
                            
                            // Ajouter le badge près du nom de la matière
                            ligne.appendChild(badgeCoeff);
                        }
                        
                        // Ajouter un effet visuel à la ligne entière
                        let tooltipInfo = `${matiereNom}: Moyenne ${moyenne} × Coefficient ${coeff}`;
                        if (coeffSource.includes("classe")) {
                            tooltipInfo += ` (adapté à votre classe de ${classeEleve})`;
                        }
                        ligne.setAttribute("title", tooltipInfo);
                        ligne.style.transition = "background-color 0.3s";
                        
                        // Ajouter des écouteurs d'événements pour mettre en évidence au survol
                        ligne.addEventListener("mouseenter", function() {
                            this.style.backgroundColor = "#f9f9f9";
                        });
                        
                        ligne.addEventListener("mouseleave", function() {
                            this.style.backgroundColor = "";
                        });
                    } catch (e) {
                        console.error("Erreur lors de la mise en évidence des valeurs:", e);
                    }
                } else {
                    console.log(`Ligne ${i} ignorée: pas de moyenne valide trouvée`);
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
                console.log(`Nombre de colonnes dans le tableau: ${nbColonnes}`);
                
                // Créer la cellule d'étiquette et la cellule de valeur
                const celluleEtiquette = document.createElement("td");
                celluleEtiquette.setAttribute("colspan", Math.max(1, nbColonnes-1));
                celluleEtiquette.style.textAlign = "right";
                celluleEtiquette.style.paddingRight = "15px";
                
                // Créer un bouton pour afficher le détail du calcul
                const btnDetail = document.createElement("button");
                
                // Adapter le texte du bouton si une classe est détectée
                if (classeEleve) {
                    btnDetail.textContent = `MOYENNE GÉNÉRALE (classe de ${classeEleve}):`;
                } else {
                    btnDetail.textContent = `MOYENNE GÉNÉRALE:`;
                }
                
                btnDetail.style.border = "none";
                btnDetail.style.background = "none";
                btnDetail.style.fontWeight = "bold";
                btnDetail.style.cursor = "pointer";
                btnDetail.style.color = "#0056b3";
                btnDetail.style.fontSize = "14px";
                btnDetail.style.padding = "5px";
                btnDetail.setAttribute("title", "Cliquez pour voir le détail du calcul");
                celluleEtiquette.appendChild(btnDetail);
                
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
                    console.log("Ligne de moyenne insérée au début du tableau");
                } else {
                    tbody.appendChild(nouvelleLigne);
                    console.log("Ligne de moyenne ajoutée à la fin du tableau (tbody vide)");
                }
                
                // Créer le tableau récapitulatif
                const calculDetail = [];
                const detailContainer = document.createElement("div");
                detailContainer.style.display = "none";
                detailContainer.style.position = "fixed";
                detailContainer.style.top = "50%";
                detailContainer.style.left = "50%";
                detailContainer.style.transform = "translate(-50%, -50%)";
                detailContainer.style.backgroundColor = "white";
                detailContainer.style.padding = "20px";
                detailContainer.style.borderRadius = "8px";
                detailContainer.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
                detailContainer.style.zIndex = "9999";
                detailContainer.style.maxWidth = "90%";
                detailContainer.style.maxHeight = "90vh";
                detailContainer.style.overflow = "auto";
                
                const detailTitle = document.createElement("h3");
                
                // Adapter le titre si une classe est détectée
                if (classeEleve) {
                    detailTitle.textContent = `Détail du calcul de la moyenne générale - Classe de ${classeEleve}`;
                } else {
                    detailTitle.textContent = "Détail du calcul de la moyenne générale";
                }
                
                detailTitle.style.marginTop = "0";
                detailTitle.style.color = "#0056b3";
                detailContainer.appendChild(detailTitle);
                
                // Ajouter un message concernant le nettoyage des coefficients si nécessaire
                const infoNettoyage = document.createElement("div");
                infoNettoyage.style.marginBottom = "15px";
                infoNettoyage.style.padding = "10px";
                infoNettoyage.style.backgroundColor = "#fff1f0";
                infoNettoyage.style.borderRadius = "5px";
                infoNettoyage.style.border = "1px solid #ffa39e";
                
                const infoNettoyageText = document.createElement("p");
                infoNettoyageText.style.margin = "0";
                
                // Version sécurisée sans innerHTML
                const boldText = document.createElement("b");
                boldText.textContent = "Problème détecté et corrigé :";
                infoNettoyageText.appendChild(boldText);
                infoNettoyageText.appendChild(document.createTextNode(" Des coefficients répétés de manière excessive ont été détectés et nettoyés automatiquement pour un affichage plus clair."));
                
                infoNettoyage.appendChild(infoNettoyageText);
                detailContainer.appendChild(infoNettoyage);
                
                // Ajouter le sélecteur de classe
                const classeSelector = document.createElement("div");
                classeSelector.style.marginBottom = "20px";
                classeSelector.style.display = "flex";
                classeSelector.style.alignItems = "center";
                classeSelector.style.gap = "10px";
                
                const classeLabel = document.createElement("label");
                classeLabel.textContent = "Changer de classe :";
                classeLabel.style.fontWeight = "bold";
                classeSelector.appendChild(classeLabel);
                
                const classeSelect = document.createElement("select");
                classeSelect.style.padding = "5px";
                classeSelect.style.borderRadius = "4px";
                classeSelect.style.border = "1px solid #ccc";
                
                // Options de classes
                const options = [
                    { value: "", label: "Auto-détection" },
                    { value: "6", label: "6ème" },
                    { value: "5", label: "5ème" },
                    { value: "4", label: "4ème" },
                    { value: "3", label: "3ème" },
                    { value: "2", label: "2nde (A)" },
                    { value: "2C", label: "2nde C" },
                    { value: "1", label: "1ère (A)" },
                    { value: "1C", label: "1ère C" },
                    { value: "1D", label: "1ère D" },
                    { value: "T", label: "Terminale (A)" },
                    { value: "TC", label: "Terminale C" },
                    { value: "TD", label: "Terminale D" }
                ];
                
                options.forEach(opt => {
                    const option = document.createElement("option");
                    option.value = opt.value;
                    option.textContent = opt.label;
                    if (opt.value === classeEleve) {
                        option.selected = true;
                    }
                    classeSelect.appendChild(option);
                });
                
                classeSelector.appendChild(classeSelect);
                
                const btnAppliquer = document.createElement("button");
                btnAppliquer.textContent = "Appliquer";
                btnAppliquer.style.padding = "5px 10px";
                btnAppliquer.style.backgroundColor = "#0056b3";
                btnAppliquer.style.color = "white";
                btnAppliquer.style.border = "none";
                btnAppliquer.style.borderRadius = "4px";
                btnAppliquer.style.cursor = "pointer";
                
                btnAppliquer.addEventListener("click", () => {
                    const nouvelleClasse = classeSelect.value;
                    console.log(`Changement de classe demandé : ${nouvelleClasse}`);
                    
                    // Enregistrer la nouvelle classe dans le stockage local
                    try {
                        if (nouvelleClasse) {
                            localStorage.setItem('calmoyenne_classe', nouvelleClasse);
                            console.log(`Classe "${nouvelleClasse}" enregistrée dans le stockage local`);
                        } else {
                            // Si "Auto-détection" est sélectionné, supprimer la classe enregistrée
                            localStorage.removeItem('calmoyenne_classe');
                            console.log("Préférence de classe supprimée, retour à l'auto-détection");
                        }
                    } catch (e) {
                        console.error("Erreur lors de l'enregistrement de la classe:", e);
                    }
                    
                    // Actualiser le calcul
                    detailContainer.style.display = "none";
                    
                    // Mettre à jour la variable
                    classeEleve = nouvelleClasse;
                    
                    // Forcer une réanalyse
                    dernierTableauHash = "";
                    contenuPrecedent = "";
                    analyseTerminee = false;
                    
                    // Afficher un message de confirmation
                    const messageClasse = nouvelleClasse 
                        ? `Classe changée pour: ${nouvelleClasse}`
                        : "Retour à la détection automatique de classe";
                    
                    afficherMessageFlottant(messageClasse);
                    
                    setTimeout(() => {
                        if (typeof window.lancerAnalyse === 'function') {
                            window.lancerAnalyse();
                        }
                    }, 100);
                });
                
                classeSelector.appendChild(btnAppliquer);
                detailContainer.appendChild(classeSelector);
                
                // Information sur les coefficients
                if (classeEleve) {
                    const infoCoeffs = document.createElement("div");
                    infoCoeffs.style.marginBottom = "15px";
                    infoCoeffs.style.padding = "10px";
                    infoCoeffs.style.backgroundColor = "#e6fffa";
                    infoCoeffs.style.borderRadius = "5px";
                    infoCoeffs.style.border = "1px solid #5cdbd3";
                    
                    const infoText = document.createElement("p");
                    infoText.style.margin = "0";
                    
                    // Version sécurisée sans innerHTML
                    const boldInfoText = document.createElement("b");
                    boldInfoText.textContent = `Coefficients adaptés pour la classe de ${classeEleve}.`;
                    infoText.appendChild(boldInfoText);
                    infoText.appendChild(document.createTextNode(" Les matières sont pondérées selon les coefficients recommandés pour votre niveau."));
                    
                    infoCoeffs.appendChild(infoText);
                    detailContainer.appendChild(infoCoeffs);
                }
                
                const detailTable = document.createElement("table");
                detailTable.style.width = "100%";
                detailTable.style.borderCollapse = "collapse";
                
                // En-têtes du tableau détaillé
                const headerRow = detailTable.createTHead().insertRow();
                const headers = ["Matière", "Moyenne", "Coefficient", "Source", "Produit"];
                headers.forEach(headerText => {
                    const th = document.createElement("th");
                    th.textContent = headerText;
                    th.style.padding = "8px";
                    th.style.borderBottom = "1px solid #ddd";
                    th.style.backgroundColor = "#f2f2f2";
                    headerRow.appendChild(th);
                });
                
                // Corps du tableau détaillé
                const detailTbody = document.createElement("tbody");
                detailTable.appendChild(detailTbody);
                
                // Remplir le tableau avec les informations collectées
                matieresDetectees.forEach(matiere => {
                    const detailRow = detailTbody.insertRow();
                    
                    // Cellule nom matière
                    const cellNom = detailRow.insertCell();
                    cellNom.textContent = matiere.nom || "Matière sans nom";
                    cellNom.style.padding = "8px";
                    cellNom.style.borderBottom = "1px solid #ddd";
                    cellNom.style.fontWeight = "bold";
                    
                    // Cellule moyenne
                    const cellMoyenne = detailRow.insertCell();
                    cellMoyenne.textContent = matiere.moyenne.toString().replace(".", ",");
                    cellMoyenne.style.padding = "8px";
                    cellMoyenne.style.borderBottom = "1px solid #ddd";
                    
                    // Cellule coefficient
                    const cellCoeff = detailRow.insertCell();
                    
                    // Modification: Rendre le coefficient modifiable avec un contrôle de nombre
                    const coeffInput = document.createElement("input");
                    coeffInput.type = "number";
                    coeffInput.min = "0";
                    coeffInput.max = "20";
                    coeffInput.step = "0.5";
                    coeffInput.value = matiere.coefficient;
                    coeffInput.style.width = "60px";
                    coeffInput.style.padding = "5px";
                    coeffInput.style.borderRadius = "4px";
                    coeffInput.style.border = "1px solid #ccc";
                    coeffInput.dataset.matiere = matiere.nom;
                    coeffInput.addEventListener("change", function() {
                        // Limiter à des nombres entre 0 et 20
                        if (this.value < 0) this.value = 0;
                        if (this.value > 20) this.value = 20;
                    });
                    
                    cellCoeff.appendChild(coeffInput);
                    
                    cellCoeff.style.padding = "8px";
                    cellCoeff.style.borderBottom = "1px solid #ddd";
                    if (matiere.coeffSource.includes("classe")) {
                        coeffInput.style.backgroundColor = "#e6fffa";
                        coeffInput.style.fontWeight = "bold";
                    }
                    
                    // Cellule source du coefficient
                    const cellSource = detailRow.insertCell();
                    if (matiere.coeffSource.includes("classe")) {
                        cellSource.textContent = "Adapté à la classe";
                        cellSource.style.color = "#13c2c2";
                    } else if (matiere.coeffSource.includes("personnalisé")) {
                        cellSource.textContent = "Personnalisé";
                        cellSource.style.color = "#722ed1";
                        cellSource.style.fontWeight = "bold";
                    } else if (matiere.coeffSource === "tableau") {
                        cellSource.textContent = "Détecté dans le tableau";
                    } else {
                        cellSource.textContent = "Par défaut";
                    }
                    cellSource.style.padding = "8px";
                    cellSource.style.borderBottom = "1px solid #ddd";
                    cellSource.style.fontSize = "12px";
                    
                    // Cellule produit
                    const cellProduit = detailRow.insertCell();
                    cellProduit.textContent = matiere.produit.toFixed(2).replace(".", ",");
                    cellProduit.style.padding = "8px";
                    cellProduit.style.borderBottom = "1px solid #ddd";
                });
                
                // Ligne des totaux
                const totalRow = detailTbody.insertRow();
                totalRow.style.fontWeight = "bold";
                totalRow.style.backgroundColor = "#f2f2f2";
                
                const totalLabel = totalRow.insertCell();
                totalLabel.textContent = "TOTAL";
                totalLabel.style.padding = "8px";
                
                const emptyCell = totalRow.insertCell();
                emptyCell.textContent = "";
                
                const coeffTotal = totalRow.insertCell();
                coeffTotal.textContent = sommeCoeffs.toString().replace(".", ",");
                coeffTotal.style.padding = "8px";
                
                const emptySource = totalRow.insertCell();
                emptySource.textContent = "";
                
                const produitTotal = totalRow.insertCell();
                produitTotal.textContent = sommeProduits.toFixed(2).replace(".", ",");
                produitTotal.style.padding = "8px";
                
                // Ligne du résultat final
                const resultRow = detailTbody.insertRow();
                resultRow.style.fontWeight = "bold";
                resultRow.style.color = "#0056b3";
                
                const resultLabel = resultRow.insertCell();
                resultLabel.setAttribute("colspan", "4");
                resultLabel.textContent = "MOYENNE GÉNÉRALE";
                resultLabel.style.padding = "8px";
                resultLabel.style.textAlign = "right";
                
                const resultValue = resultRow.insertCell();
                resultValue.textContent = moyenneGenerale.replace(".", ",");
                resultValue.style.padding = "8px";
                resultValue.style.fontSize = "16px";
                
                // Ajouter la formule de calcul
                const formula = document.createElement("p");
                formula.style.marginTop = "15px";
                
                // Version sécurisée sans innerHTML
                const formulaText = document.createTextNode(`Formule: Somme des (Moyenne × Coefficient) / Somme des Coefficients = `);
                formula.appendChild(formulaText);
                
                const boldResult = document.createElement("b");
                boldResult.textContent = `${sommeProduits.toFixed(2).replace(".", ",")} / ${sommeCoeffs.toString().replace(".", ",")} = ${moyenneGenerale.replace(".", ",")}`;
                formula.appendChild(boldResult);
                
                detailContainer.appendChild(formula);
                
                detailContainer.appendChild(detailTable);
                
                // Créer un conteneur pour les onglets
                const tabsContainer = document.createElement("div");
                tabsContainer.style.display = "flex";
                tabsContainer.style.marginTop = "20px";
                tabsContainer.style.borderBottom = "1px solid #ddd";
                tabsContainer.style.marginBottom = "15px";
                
                // Créer les onglets
                const tabDetail = document.createElement("div");
                tabDetail.textContent = "Détail";
                tabDetail.dataset.tab = "detail-tab";
                tabDetail.className = "tab-button active";
                tabDetail.style.padding = "8px 15px";
                tabDetail.style.cursor = "pointer";
                tabDetail.style.backgroundColor = "#f9f9f9";
                tabDetail.style.border = "1px solid #ddd";
                tabDetail.style.borderBottom = "none";
                tabDetail.style.borderTopLeftRadius = "4px";
                tabDetail.style.borderTopRightRadius = "4px";
                tabDetail.style.marginRight = "5px";
                
                const tabCoeffs = document.createElement("div");
                tabCoeffs.textContent = "Coefficients";
                tabCoeffs.dataset.tab = "coeffs-tab";
                tabCoeffs.className = "tab-button";
                tabCoeffs.style.padding = "8px 15px";
                tabCoeffs.style.cursor = "pointer";
                tabCoeffs.style.backgroundColor = "#f0f0f0";
                tabCoeffs.style.border = "1px solid #ddd";
                tabCoeffs.style.borderBottom = "none";
                tabCoeffs.style.borderTopLeftRadius = "4px";
                tabCoeffs.style.borderTopRightRadius = "4px";
                
                tabsContainer.appendChild(tabDetail);
                tabsContainer.appendChild(tabCoeffs);
                detailContainer.appendChild(tabsContainer);
                
                // Contenu pour les onglets
                const detailContent = document.createElement("div");
                detailContent.id = "detail-content";
                detailContent.style.display = "block";
                
                const coeffsContent = document.createElement("div");
                coeffsContent.id = "coeffs-content";
                coeffsContent.style.display = "none";
                
                // Fonction pour changer d'onglet
                function switchTab(tab) {
                    // Réinitialiser tous les onglets
                    document.querySelectorAll(".tab-button").forEach(t => {
                        t.classList.remove("active");
                        t.style.backgroundColor = "#f0f0f0";
                    });
                    
                    // Cacher tous les contenus
                    detailContent.style.display = "none";
                    coeffsContent.style.display = "none";
                    
                    // Activer l'onglet sélectionné
                    if (tab === "detail") {
                        tabDetail.classList.add("active");
                        tabDetail.style.backgroundColor = "#007bff";
                        detailContent.style.display = "block";
                    } else if (tab === "coeffs") {
                        tabCoeffs.classList.add("active");
                        tabCoeffs.style.backgroundColor = "#007bff";
                        coeffsContent.style.display = "block";
                    }
                }
                
                // Ajouter les écouteurs d'événements pour les onglets
                tabDetail.addEventListener("click", () => switchTab("detail"));
                tabCoeffs.addEventListener("click", () => switchTab("coeffs"));
                
                // Ajouter les contenus au container
                detailContainer.appendChild(detailContent);
                detailContainer.appendChild(coeffsContent);
                
                // Ajouter l'interface au document
                document.body.appendChild(detailContainer);
                
                // Événement pour afficher le détail
                btnDetail.addEventListener("click", () => {
                    detailContainer.style.display = "block";
                });
                
                // Message adapté à la classe si détectée
                let messageTooltip = `Moyenne générale calculée: ${moyenneGenerale.replace(".", ",")} (${nbMatieresValides} matières)`;
                if (classeEleve) {
                    messageTooltip += ` - Coefficients adaptés à la classe de ${classeEleve}`;
                }
                afficherMessageFlottant(messageTooltip);
                
                // Contenu de l'onglet coefficients
                coeffsContent.innerHTML = `
                    <div style="margin-bottom: 15px;">
                        <h4 style="margin: 0 0 10px 0;">Gestion des coefficients</h4>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px;">Classe:</label>
                            <select id="classe-select-tab" style="width: 100%; padding: 5px; margin-bottom: 10px;">
                                <option value="">-- Sélectionner une classe --</option>
                                <option value="6EME">6ème</option>
                                <option value="5EME">5ème</option>
                                <option value="4EME">4ème</option>
                                <option value="3EME">3ème</option>
                                <option value="2NDE">2nde</option>
                                <option value="1ERE">1ère</option>
                                <option value="TERM">Terminale</option>
                            </select>
                        </div>
                        <div id="coeffs-list" style="margin-top: 15px;"></div>
                    </div>
                `;
                
                // Ajouter l'écouteur pour le sélecteur de classe
                const classeSelectTab = coeffsContent.querySelector("#classe-select-tab");
                classeSelectTab.addEventListener("change", function() {
                    const classe = this.value;
                    if (classe) {
                        // Sauvegarder la classe dans le stockage local
                        localStorage.setItem("calmoyenne_classe", classe);
                        // Recalculer la moyenne avec la nouvelle classe
                        calculerEtAfficherMoyenne(tableau);
                        // Mettre à jour l'affichage des coefficients
                        afficherCoefficients(classe, coeffsContent.querySelector("#coeffs-list"));
                    }
                });
                
                // Essayer de récupérer la classe préalablement sélectionnée
                try {
                    const classeStockee = localStorage.getItem("calmoyenne_classe");
                    if (classeStockee) {
                        classeSelectTab.value = classeStockee;
                        // Afficher les coefficients pour cette classe
                        afficherCoefficients(classeStockee, coeffsContent.querySelector("#coeffs-list"));
                    }
                } catch (e) {
                    console.error("Erreur lors de la récupération de la classe stockée:", e);
                }
            } else {
                console.log("Impossible de calculer la moyenne: pas assez de matières valides");
                afficherMessageFlottant("Impossible de calculer la moyenne: aucune matière valide trouvée.");
            }
        } catch (err) {
            console.error("Erreur lors du calcul de la moyenne:", err);
            afficherMessageFlottant("Erreur lors du calcul de la moyenne.");
        }
    }

    // Fonction pour détecter la classe de l'élève
    function detecterClasseEleve() {
        // Si une classe a déjà été définie manuellement par l'utilisateur, l'utiliser
        try {
            const classeEnregistree = localStorage.getItem('calmoyenne_classe');
            if (classeEnregistree) {
                console.log(`Utilisation de la classe définie par l'utilisateur: ${classeEnregistree}`);
                return classeEnregistree;
            }
        } catch (e) {
            console.error("Erreur lors de la récupération de la classe enregistrée:", e);
        }
        
        try {
            // Recherche directe dans le HTML pour des formats spécifiques (comme "4ème 2")
            const toutLeTexte = document.body.innerText;
            // Recherche des formats comme "Xème Y" où X est le niveau et Y le numéro de classe
            const classeNumeroteePattern = /([1-6])(?:ème|eme|e)(?:\s+|\s*-\s*)(\d+)/i;
            const classeNumeroteeMatch = toutLeTexte.match(classeNumeroteePattern);
            
            if (classeNumeroteeMatch) {
                const niveauClasse = classeNumeroteeMatch[1];
                console.log(`Classe avec numéro détectée: ${classeNumeroteeMatch[0]}, niveau extrait: ${niveauClasse}`);
                return niveauClasse; // On retourne juste le niveau (4 pour 4ème 2)
            }
            
            // Méthode 1: Chercher dans l'URL (souvent dans les paramètres ou le chemin)
            const urlPattern = /(?:classe|niveau|grade)[=\/]([1-6]|2nd|2nde|1e?re?|T[A-Za-z]*)/i;
            const urlMatch = window.location.href.match(urlPattern);
            
            if (urlMatch) {
                const classeFromURL = urlMatch[1].toUpperCase();
                console.log(`Classe détectée depuis l'URL: ${classeFromURL}`);
                return normaliserClasse(classeFromURL);
            }
            
            // Méthode 2: Chercher dans les éléments du menu ou en-têtes de la page
            const elementsNiveau = document.querySelectorAll(
                '.niveau, .classe, .grade, h1, h2, h3, .header-title, .user-info, .profil-eleve, .student-info, .etudiant-info'
            );
            
            for (const element of elementsNiveau) {
                const texte = element.textContent.trim();
                // Recherche pour format "Xème Y" dans les éléments spécifiques
                const classeNumeroteeMatch = texte.match(classeNumeroteePattern);
                if (classeNumeroteeMatch) {
                    const niveauClasse = classeNumeroteeMatch[1];
                    console.log(`Classe avec numéro détectée dans élément: ${classeNumeroteeMatch[0]}, niveau: ${niveauClasse}`);
                    return niveauClasse;
                }
                
                // Patterns plus restrictifs pour éviter les faux positifs
                const patterns = [
                    /\b([1-6])e(?:me)?\b/i,          // 6e, 6eme, etc.
                    /\b([1-6])ème\b/i,               // 6ème, etc.
                    /\bsixième\b/i,                  // sixième (donne 6)
                    /\bcinquième\b/i,                // cinquième (donne 5)
                    /\bquatrième\b/i,                // quatrième (donne 4)
                    /\btroisième\b/i,                // troisième (donne 3)
                    /\b2n?de?\b/i,                   // 2nde, 2de, 2d (donne 2)
                    /\bseconde\b/i,                  // seconde (donne 2)
                    /\b1[èe]?r?e?\b/i,               // 1ere, 1re, 1e (donne 1)
                    /\bpremière\b/i,                 // première (donne 1)
                    /\bT[A-Za-z]*\s+\b/i,            // Terminale suivie d'un espace (plus restrictif)
                    /\bterminale\s+\b/i              // terminale suivie d'un espace (plus restrictif)
                ];
                
                for (const pattern of patterns) {
                    const match = texte.match(pattern);
                    if (match) {
                        // Vérifier que ce n'est pas un faux positif (comme une date ou un compteur)
                        const contexte = texte.substring(Math.max(0, match.index - 10), match.index + match[0].length + 10);
                        if (!contexte.match(/\b(date|nombre|total|temps|montant|somme|compte|note)\b/i)) {
                            let classeDetectee = match[0];
                            console.log(`Classe potentielle détectée dans le texte "${texte}": ${classeDetectee}`);
                            return normaliserClasse(classeDetectee);
                        }
                    }
                }
            }
            
            // Méthode 3: Chercher dans le contenu de la page de façon plus précise
            const pageContent = document.body.textContent;
            
            // Chercher d'abord pour format "Xème Y" dans la page entière
            const pageClasseNumeroteeMatch = pageContent.match(classeNumeroteePattern);
            if (pageClasseNumeroteeMatch) {
                const niveauClasse = pageClasseNumeroteeMatch[1];
                console.log(`Classe avec numéro détectée dans page: ${pageClasseNumeroteeMatch[0]}, niveau: ${niveauClasse}`);
                return niveauClasse;
            }
            
            const pagePatterns = [
                /classe\s*(?:de|:)?\s*([1-6])[eèé]/i,
                /classe\s*(?:de|:)?\s*(seconde|première|terminale)/i,
                /\ben\s+([1-6])e\b/i,
                /élève\s+(?:de|en)\s+([1-6])[eèé]/i,
                /élève\s+(?:de|en)\s+(seconde|première|terminale)/i,
                /\bniveau\s*:?\s*([1-6])[eèé]/i
            ];
            
            for (const pattern of pagePatterns) {
                const match = pageContent.match(pattern);
                if (match) {
                    console.log(`Classe potentielle détectée dans le contenu de la page: ${match[1]}`);
                    return normaliserClasse(match[1]);
                }
            }
            
            console.log("Aucune classe détectée automatiquement");
            // Par défaut, ne pas assigner de classe plutôt que de risquer une mauvaise détection
            return "";
        } catch (err) {
            console.error("Erreur lors de la détection de la classe:", err);
            return "";
        }
    }
    
    // Fonction pour normaliser les formats de classe
    function normaliserClasse(classe) {
        if (!classe) return null;
        
        // Convertir en minuscules et supprimer les accents
        let classeNormalisee = classe.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // Supprimer les espaces et caractères spéciaux
        classeNormalisee = classeNormalisee.replace(/[\s-_.]/g, "");
        
        // Mapper les différentes variantes
        const mappingClasses = {
            // Collège
            "6": "6eme", "6e": "6eme", "6ème": "6eme", "6eme": "6eme", "sixieme": "6eme", "sixième": "6eme",
            "5": "5eme", "5e": "5eme", "5ème": "5eme", "5eme": "5eme", "cinquieme": "5eme", "cinquième": "5eme",
            "4": "4eme", "4e": "4eme", "4ème": "4eme", "4eme": "4eme", "quatrieme": "4eme", "quatrième": "4eme",
            "3": "3eme", "3e": "3eme", "3ème": "3eme", "3eme": "3eme", "troisieme": "3eme", "troisième": "3eme",
            
            // Lycée
            "2": "2nde", "2e": "2nde", "2nd": "2nde", "2nde": "2nde", "seconde": "2nde", 
            "1": "1ere", "1e": "1ere", "1er": "1ere", "1ere": "1ere", "1ère": "1ere", "premiere": "1ere", "première": "1ere",
            "t": "terminale", "tle": "terminale", "term": "terminale", "terminale": "terminale", "tale": "terminale"
        };
        
        // Extraire la classe de base (sans la section)
        let classeBase = classeNormalisee;
        // Rechercher les variantes connues
        for (const [variante, normalisee] of Object.entries(mappingClasses)) {
            if (classeNormalisee.startsWith(variante)) {
                classeBase = normalisee;
                break;
            }
        }
        
        console.log(`Classe normalisée: "${classe}" -> "${classeBase}"`);
        return classeBase;
    }
    
    // Fonction pour normaliser le nom d'une matière
    function normaliserNomMatiere(matiere) {
        if (!matiere) return null;
        
        // Convertir en minuscules, supprimer les accents et les caractères spéciaux
        let matiereNormalisee = matiere.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        
        // Mapper les différentes variantes de noms de matières
        const mappingMatieres = {
            // Français et langues
            "francais": "francais", "français": "francais", "lettres": "francais", "fr": "francais",
            "anglais": "anglais", "ang": "anglais", "lv1": "anglais", "langue vivante 1": "anglais", "anglophone": "anglais",
            "allemand": "allemand", "all": "allemand", "lve allemand": "allemand",
            "espagnol": "espagnol", "esp": "espagnol", "lve espagnol": "espagnol",
            "lv2": "lv2", "langue vivante 2": "lv2",
            "latin": "latin", "grec": "grec", "langues anciennes": "latin",
            
            // Mathématiques et sciences
            "math": "mathematiques", "maths": "mathematiques", "mathematiques": "mathematiques", "mathématiques": "mathematiques",
            "physique": "physique-chimie", "chimie": "physique-chimie", "physique chimie": "physique-chimie", "pc": "physique-chimie",
            "svt": "svt", "sciences naturelles": "svt", "biologie": "svt", "sciences de la vie et de la terre": "svt",
            "technologie": "technologie", "techno": "technologie", "tech": "technologie",
            "si": "si", "sciences de l'ingenieur": "si", "sciences de l'ingénieur": "si",
            "nsi": "nsi", "numerique et sciences informatiques": "nsi", "numérique et sciences informatiques": "nsi",
            
            // Sciences humaines
            "histoire": "histoire-geographie", "geo": "histoire-geographie", "géographie": "histoire-geographie", 
            "histoire geo": "histoire-geographie", "histoire géo": "histoire-geographie", "hg": "histoire-geographie",
            "emc": "emc", "education civique": "emc", "éducation civique": "emc", "morale et civique": "emc",
            "ses": "ses", "sciences economiques": "ses", "sciences économiques": "ses", "sciences eco": "ses",
            "philosophie": "philosophie", "philo": "philosophie", "phi": "philosophie",
            
            // Enseignements artistiques et sport
            "eps": "eps", "sport": "eps", "education physique": "eps", "éducation physique": "eps",
            "musique": "musique", "education musicale": "musique", "éducation musicale": "musique",
            "arts": "arts plastiques", "art": "arts plastiques", "arts plastiques": "arts plastiques",
            
            // Spécialités lycée
            "specialite maths": "mathematiques", "spé maths": "mathematiques", "maths spe": "mathematiques", 
            "specialite ses": "ses", "spé ses": "ses",
            "specialite physique": "physique-chimie", "spé physique": "physique-chimie", "spe pc": "physique-chimie",
            "specialite svt": "svt", "spé svt": "svt",
            "hlp": "hlp", "humanites": "hlp", "humanités": "hlp",
            "llce": "llce", "langues litteratures cultures etrangeres": "llce", "langues littératures cultures étrangères": "llce",
            "hggsp": "hggsp", "geopolitique": "hggsp", "géopolitique": "hggsp", "sciences politiques": "hggsp",
            
            // Options
            "option math": "maths complementaires", "maths complementaires": "maths complementaires", "maths complémentaires": "maths complementaires",
            "option maths expertes": "maths expertes", "maths expertes": "maths expertes",
            "dgemc": "dgemc", "droit": "dgemc"
        };
        
        // Rechercher une correspondance précise
        if (mappingMatieres[matiereNormalisee]) {
            return mappingMatieres[matiereNormalisee];
        }
        
        // Rechercher une correspondance partielle
        for (const [cle, valeur] of Object.entries(mappingMatieres)) {
            if (matiereNormalisee.includes(cle)) {
                return valeur;
            }
        }
        
        // Si aucune correspondance trouvée, retourner la matière normalisée
        return matiereNormalisee;
    }

    // Fonction pour suggérer des coefficients adaptés à la matière et à la classe
    function suggererCoefficient(matiere, classe) {
        // Normaliser les entrées pour la recherche
        const matiereNormalisee = normaliserNomMatiere(matiere);
        const classeNormalisee = normaliserClasse(classe);
        
        // Vérifier d'abord s'il y a des coefficients personnalisés
        try {
            console.log(`Recherche de coefficient personnalisé pour ${matiere} (${matiereNormalisee})`);
            const coefficientsPersonnalises = JSON.parse(localStorage.getItem('calmoyenne_coefficients_personnalises') || '{}');
            console.log('Coefficients personnalisés trouvés:', coefficientsPersonnalises);
            
            // 1. Recherche exacte avec le nom original
            if (coefficientsPersonnalises[matiere]) {
                console.log(`Coefficient personnalisé trouvé pour ${matiere}: ${coefficientsPersonnalises[matiere]}`);
                return {
                    valeur: parseFloat(coefficientsPersonnalises[matiere]),
                    source: "personnalisé (exact)"
                };
            }
            
            // 2. Recherche exacte avec le nom normalisé
            if (matiereNormalisee && coefficientsPersonnalises[matiereNormalisee]) {
                console.log(`Coefficient personnalisé trouvé pour ${matiereNormalisee}: ${coefficientsPersonnalises[matiereNormalisee]}`);
                return {
                    valeur: parseFloat(coefficientsPersonnalises[matiereNormalisee]),
                    source: "personnalisé (normalisé)"
                };
            }
            
            // 3. Recherche insensible à la casse
            const matiereMinuscule = matiere.toLowerCase().trim();
            for (const [key, value] of Object.entries(coefficientsPersonnalises)) {
                if (key.toLowerCase().trim() === matiereMinuscule) {
                    console.log(`Coefficient personnalisé trouvé (insensible à la casse) pour ${matiere}: ${value}`);
                    return {
                        valeur: parseFloat(value),
                        source: "personnalisé (insensible à la casse)"
                    };
                }
            }
            
            // 4. Recherche partielle
            for (const [key, value] of Object.entries(coefficientsPersonnalises)) {
                // Vérifier si la clé ou la matière est un sous-ensemble de l'autre
                if (key.toLowerCase().includes(matiereMinuscule) || 
                    matiereMinuscule.includes(key.toLowerCase())) {
                    console.log(`Coefficient personnalisé trouvé (correspondance partielle) pour ${matiere}: ${value}`);
                    return {
                        valeur: parseFloat(value),
                        source: "personnalisé (correspondance partielle)"
                    };
                }
            }
            
            // 5. Recherche avec le nom normalisé de façon partielle
            if (matiereNormalisee) {
                for (const [key, value] of Object.entries(coefficientsPersonnalises)) {
                    if (key.toLowerCase().includes(matiereNormalisee.toLowerCase()) || 
                        matiereNormalisee.toLowerCase().includes(key.toLowerCase())) {
                        console.log(`Coefficient personnalisé trouvé (correspondance normalisée) pour ${matiere}: ${value}`);
                        return {
                            valeur: parseFloat(value),
                            source: "personnalisé (correspondance normalisée)"
                        };
                    }
                }
            }
        } catch(e) {
            console.error("Erreur lors de la récupération des coefficients personnalisés:", e);
        }
        
        // Si pas de coefficient personnalisé, utiliser les coefficients par classe
        if (!classeNormalisee) {
            console.log(`Pas de classe identifiée pour ${matiere}, utilisant coefficient par défaut`);
            return {
                valeur: 1,
                source: "défaut (pas de classe identifiée)"
            };
        }
        
        // Créer l'objet de coefficients par classe s'il n'existe pas déjà
        if (typeof coefficientsParClasse === 'undefined') {
            // Définir les coefficients par classe
            window.coefficientsParClasse = {
                // Collège
                "6eme": {
                    "francais": 5, "français": 5, "lettres": 5,
                    "mathematiques": 5, "mathématiques": 5, "maths": 5,
                    "histoire": 3, "géographie": 3, "histoire-géographie": 3, "histoire-geographie": 3,
                    "anglais": 3, "lv1": 3, "langue vivante 1": 3,
                    "allemand": 2, "espagnol": 2, "lv2": 2, "langue vivante 2": 2,
                    "physique": 2, "physique-chimie": 2, 
                    "svt": 2, "sciences de la vie et de la terre": 2,
                    "technologie": 2, "techno": 2,
                    "eps": 2, "éducation physique et sportive": 2, "sport": 2,
                    "arts plastiques": 1, "art plastique": 1,
                    "education musicale": 1, "éducation musicale": 1, "musique": 1
                },
                "5eme": {
                    "francais": 5, "français": 5, "lettres": 5,
                    "mathematiques": 5, "mathématiques": 5, "maths": 5,
                    "histoire": 3, "géographie": 3, "histoire-géographie": 3, "histoire-geographie": 3,
                    "anglais": 3, "lv1": 3, "langue vivante 1": 3,
                    "allemand": 2, "espagnol": 2, "lv2": 2, "langue vivante 2": 2,
                    "physique": 2, "physique-chimie": 2, 
                    "svt": 2, "sciences de la vie et de la terre": 2,
                    "technologie": 2, "techno": 2,
                    "eps": 2, "éducation physique et sportive": 2, "sport": 2,
                    "arts plastiques": 1, "art plastique": 1,
                    "education musicale": 1, "éducation musicale": 1, "musique": 1
                },
                "4eme": {
                    "francais": 5, "français": 5, "lettres": 5,
                    "mathematiques": 5, "mathématiques": 5, "maths": 5,
                    "histoire": 3, "géographie": 3, "histoire-géographie": 3, "histoire-geographie": 3,
                    "anglais": 3, "lv1": 3, "langue vivante 1": 3,
                    "allemand": 3, "espagnol": 3, "lv2": 3, "langue vivante 2": 3,
                    "physique": 3, "physique-chimie": 3, 
                    "svt": 3, "sciences de la vie et de la terre": 3,
                    "technologie": 2, "techno": 2,
                    "eps": 2, "éducation physique et sportive": 2, "sport": 2,
                    "arts plastiques": 1, "art plastique": 1,
                    "education musicale": 1, "éducation musicale": 1, "musique": 1
                },
                "3eme": {
                    "francais": 5, "français": 5, "lettres": 5,
                    "mathematiques": 5, "mathématiques": 5, "maths": 5,
                    "histoire": 3, "géographie": 3, "histoire-géographie": 3, "histoire-geographie": 3,
                    "anglais": 3, "lv1": 3, "langue vivante 1": 3,
                    "allemand": 3, "espagnol": 3, "lv2": 3, "langue vivante 2": 3,
                    "physique": 3, "physique-chimie": 3, 
                    "svt": 3, "sciences de la vie et de la terre": 3,
                    "technologie": 2, "techno": 2,
                    "eps": 2, "éducation physique et sportive": 2, "sport": 2,
                    "arts plastiques": 1, "art plastique": 1,
                    "education musicale": 1, "éducation musicale": 1, "musique": 1
                },
                // Lycée - Seconde
                "2nde": {
                    "francais": 4, "français": 4, "lettres": 4,
                    "mathematiques": 4, "mathématiques": 4, "maths": 4,
                    "histoire": 3, "géographie": 3, "histoire-géographie": 3, "histoire-geographie": 3,
                    "anglais": 3, "lv1": 3, "langue vivante 1": 3,
                    "allemand": 3, "espagnol": 3, "lv2": 3, "langue vivante 2": 3,
                    "physique": 3, "physique-chimie": 3, 
                    "svt": 3, "sciences de la vie et de la terre": 3,
                    "sns": 2, "sciences numériques et sociales": 2,
                    "ses": 2, "sciences économiques et sociales": 2,
                    "eps": 2, "éducation physique et sportive": 2, "sport": 2
                },
                // Lycée - Première générale
                "1ere": {
                    "francais": 5, "français": 5, "lettres": 5,
                    "enseignement scientifique": 2,
                    "histoire": 3, "géographie": 3, "histoire-géographie": 3, "histoire-geographie": 3,
                    "anglais": 3, "lv1": 3, "langue vivante 1": 3,
                    "allemand": 3, "espagnol": 3, "lv2": 3, "langue vivante 2": 3,
                    "eps": 2, "éducation physique et sportive": 2, "sport": 2,
                    // Spécialités
                    "mathematiques": 6, "mathématiques": 6, "maths": 6, "spé maths": 6, "spe maths": 6,
                    "physique": 6, "physique-chimie": 6, "spé physique": 6, "spe physique": 6,
                    "svt": 6, "sciences de la vie et de la terre": 6, "spé svt": 6, "spe svt": 6,
                    "ses": 6, "sciences économiques et sociales": 6, "spé ses": 6, "spe ses": 6,
                    "hlp": 6, "humanités littérature philosophie": 6, "spé hlp": 6, "spe hlp": 6,
                    "llce": 6, "langues littératures cultures étrangères": 6, "spé llce": 6, "spe llce": 6,
                    "hggsp": 6, "histoire-géographie géopolitique sciences politiques": 6, "spé hggsp": 6, "histoire-geographie geopolitique sciences politiques": 6, "spe hggsp": 6,
                    "nsi": 6, "numérique sciences informatiques": 6, "spé nsi": 6, "numerique sciences informatiques": 6, "spe nsi": 6
                },
                // Lycée - Terminale générale
                "terminale": {
                    "philosophie": 4, "philo": 4,
                    "enseignement scientifique": 2,
                    "histoire": 3, "géographie": 3, "histoire-géographie": 3, "histoire-geographie": 3,
                    "anglais": 3, "lv1": 3, "langue vivante 1": 3,
                    "allemand": 3, "espagnol": 3, "lv2": 3, "langue vivante 2": 3,
                    "eps": 2, "éducation physique et sportive": 2, "sport": 2,
                    // Spécialités (coefficient plus élevé car seulement 2 en terminale)
                    "mathematiques": 8, "mathématiques": 8, "maths": 8, "spé maths": 8, "spe maths": 8,
                    "physique": 8, "physique-chimie": 8, "spé physique": 8, "spe physique": 8,
                    "svt": 8, "sciences de la vie et de la terre": 8, "spé svt": 8, "spe svt": 8,
                    "ses": 8, "sciences économiques et sociales": 8, "spé ses": 8, "spe ses": 8,
                    "hlp": 8, "humanités littérature philosophie": 8, "spé hlp": 8, "spe hlp": 8,
                    "llce": 8, "langues littératures cultures étrangères": 8, "spé llce": 8, "spe llce": 8,
                    "hggsp": 8, "histoire-géographie géopolitique sciences politiques": 8, "spé hggsp": 8, "histoire-geographie geopolitique sciences politiques": 8, "spe hggsp": 8,
                    "nsi": 8, "numérique sciences informatiques": 8, "spé nsi": 8, "numerique sciences informatiques": 8, "spe nsi": 8
                },
                // Options qui s'appliquent à tous les niveaux
                "options": {
                    "latin": 2, "grec": 2, "langues anciennes": 2,
                    "lv3": 2, "langue vivante 3": 2,
                    "maths complementaires": 2, "maths complémentaires": 2,
                    "maths expertes": 2, "maths expertes": 2,
                    "dgemc": 2, "droit et grands enjeux du monde contemporain": 2
                }
            };
        }
        
        // Accéder aux coefficientsParClasse
        const coeffParClasse = window.coefficientsParClasse || {};
        
        // Si on a une classe normalisée, chercher dans les coefficients par classe
        if (classeNormalisee && coeffParClasse[classeNormalisee]) {
            // Vérifier si la matière normalisée existe dans cette classe
            if (matiereNormalisee && coeffParClasse[classeNormalisee][matiereNormalisee]) {
                return {
                    valeur: coeffParClasse[classeNormalisee][matiereNormalisee],
                    source: `classe ${classeNormalisee} (${matiereNormalisee})`
                };
            }
            
            // Vérifier avec le nom original
            if (coeffParClasse[classeNormalisee][matiere]) {
                return {
                    valeur: coeffParClasse[classeNormalisee][matiere],
                    source: `classe ${classeNormalisee} (correspondance exacte)`
                };
            }
            
            // Vérifier avec matière lowercase
            const matiereMinuscule = matiere.toLowerCase();
            for (const [cle, valeur] of Object.entries(coeffParClasse[classeNormalisee])) {
                if (cle.toLowerCase() === matiereMinuscule) {
                return {
                    valeur: valeur,
                        source: `classe ${classeNormalisee} (insensible à la casse)`
                    };
                }
            }
            
            // Recherche partielle dans la classe
            for (const [cle, valeur] of Object.entries(coeffParClasse[classeNormalisee])) {
                if (cle.toLowerCase().includes(matiereMinuscule) || 
                    matiereMinuscule.includes(cle.toLowerCase())) {
                    return {
                        valeur: valeur,
                        source: `classe ${classeNormalisee} (correspondance partielle)`
                    };
                }
            }
        }
        
        // Si matière non trouvée dans la classe, vérifier dans les options
        if (coeffParClasse["options"]) {
            // Recherche exacte
            if (matiereNormalisee && coeffParClasse["options"][matiereNormalisee]) {
                return {
                    valeur: coeffParClasse["options"][matiereNormalisee],
                    source: "option (correspondance exacte)"
                };
            }
            
            // Recherches variées
            const matiereMinuscule = matiere.toLowerCase();
            for (const [cle, valeur] of Object.entries(coeffParClasse["options"])) {
                if (cle.toLowerCase() === matiereMinuscule) {
                    return {
                        valeur: valeur,
                        source: "option (insensible à la casse)"
                    };
                } else if (cle.toLowerCase().includes(matiereMinuscule) || 
                          matiereMinuscule.includes(cle.toLowerCase())) {
                    return {
                        valeur: valeur,
                        source: "option (correspondance partielle)"
                    };
                }
            }
        }
        
        // Si aucun coefficient trouvé, retourner la valeur par défaut
        return {
            valeur: 1,
            source: "défaut (matière non reconnue)"
        };
    }

    // Fonction pour afficher la classe actuelle et permettre son changement rapide
    function ajouterBoutonClasse() {
        try {
            // Supprimer les anciens boutons s'ils existent
            document.querySelectorAll('.bouton-classe-flottant').forEach(btn => btn.remove());
            
            // Créer le bouton flottant de classe
            const btnClasse = document.createElement('button');
            btnClasse.className = 'bouton-classe-flottant';
            btnClasse.textContent = classeEleve ? `Classe : ${classeEleve}` : 'Choisir classe';
            btnClasse.style.position = 'fixed';
            btnClasse.style.top = '10px';
            btnClasse.style.right = '10px';
            btnClasse.style.zIndex = '9999';
            btnClasse.style.backgroundColor = classeEleve ? '#13c2c2' : '#ff7875';
            btnClasse.style.color = 'white';
            btnClasse.style.border = 'none';
            btnClasse.style.borderRadius = '4px';
            btnClasse.style.padding = '8px 15px';
            btnClasse.style.cursor = 'pointer';
            btnClasse.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            btnClasse.style.fontWeight = 'bold';
            
            // Fonction pour afficher le sélecteur de classe
            btnClasse.addEventListener('click', function() {
                // Vérifier si le sélecteur existe déjà
                let selecteurClasse = document.querySelector('.selecteur-classe-flottant');
                
                if (selecteurClasse) {
                    // Si oui, le supprimer
                    selecteurClasse.remove();
                    return;
                }
                
                // Sinon, créer le sélecteur
                selecteurClasse = document.createElement('div');
                selecteurClasse.className = 'selecteur-classe-flottant';
                selecteurClasse.style.position = 'fixed';
                selecteurClasse.style.top = '50px';
                selecteurClasse.style.right = '10px';
                selecteurClasse.style.zIndex = '99999';
                selecteurClasse.style.backgroundColor = 'white';
                selecteurClasse.style.border = '1px solid #ccc';
                selecteurClasse.style.borderRadius = '4px';
                selecteurClasse.style.padding = '15px';
                selecteurClasse.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                
                // Titre
                const titre = document.createElement('h3');
                titre.textContent = 'Choisir votre classe';
                titre.style.margin = '0 0 10px 0';
                titre.style.color = '#0056b3';
                selecteurClasse.appendChild(titre);
                
                // Informations
                const info = document.createElement('p');
                info.textContent = 'Ce choix sera enregistré pour les prochaines visites.';
                info.style.fontSize = '12px';
                info.style.marginBottom = '10px';
                selecteurClasse.appendChild(info);
                
                // Options de classes
                const options = [
                    { value: "", label: "Auto-détection" },
                    { value: "6", label: "6ème" },
                    { value: "5", label: "5ème" },
                    { value: "4", label: "4ème" },
                    { value: "3", label: "3ème" },
                    { value: "2", label: "2nde (A)" },
                    { value: "2C", label: "2nde C" },
                    { value: "1", label: "1ère (A)" },
                    { value: "1C", label: "1ère C" },
                    { value: "1D", label: "1ère D" },
                    { value: "T", label: "Terminale (A)" },
                    { value: "TC", label: "Terminale C" },
                    { value: "TD", label: "Terminale D" }
                ];
                
                // Créer les boutons pour chaque classe
                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.textContent = opt.label;
                    btn.style.display = 'block';
                    btn.style.width = '100%';
                    btn.style.padding = '8px';
                    btn.style.margin = '5px 0';
                    btn.style.border = 'none';
                    btn.style.borderRadius = '4px';
                    btn.style.cursor = 'pointer';
                    
                    // Mettre en évidence la classe actuelle
                    if (opt.value === classeEleve) {
                        btn.style.backgroundColor = '#e6fffa';
                        btn.style.color = '#13c2c2';
                        btn.style.fontWeight = 'bold';
                        btn.style.border = '1px solid #13c2c2';
                    } else {
                        btn.style.backgroundColor = '#f5f5f5';
                        btn.style.color = '#333';
                    }
                    
                    btn.addEventListener('click', function() {
                        const nouvelleClasse = opt.value;
                        
                        // Enregistrer la nouvelle classe
                        try {
                            if (nouvelleClasse) {
                                localStorage.setItem('calmoyenne_classe', nouvelleClasse);
                                console.log(`Classe "${nouvelleClasse}" enregistrée dans le stockage local`);
                            } else {
                                localStorage.removeItem('calmoyenne_classe');
                                console.log("Préférence de classe supprimée, retour à l'auto-détection");
                            }
                        } catch (e) {
                            console.error("Erreur lors de l'enregistrement de la classe:", e);
                        }
                        
                        // Mettre à jour la variable
                        classeEleve = nouvelleClasse;
                        
                        // Mettre à jour le bouton
                        btnClasse.textContent = classeEleve ? `Classe : ${classeEleve}` : 'Choisir classe';
                        btnClasse.style.backgroundColor = classeEleve ? '#13c2c2' : '#ff7875';
                        
                        // Forcer une réanalyse
                        dernierTableauHash = "";
                        contenuPrecedent = "";
                        analyseTerminee = false;
                        
                        // Afficher un message de confirmation
                        const messageClasse = nouvelleClasse 
                            ? `Classe changée pour: ${opt.label}`
                            : "Retour à la détection automatique de classe";
                        
                        afficherMessageFlottant(messageClasse);
                        
                        // Fermer le sélecteur
                        selecteurClasse.remove();
                        
                        // Relancer l'analyse
                        setTimeout(() => {
                            if (typeof window.lancerAnalyse === 'function') {
                                window.lancerAnalyse();
                            }
                        }, 100);
                    });
                    
                    selecteurClasse.appendChild(btn);
                });
                
                document.body.appendChild(selecteurClasse);
            });
            
            document.body.appendChild(btnClasse);
            console.log("Bouton de classe ajouté");
        } catch (err) {
            console.error("Erreur lors de l'ajout du bouton de classe:", err);
        }
    }
    
    // Ajouter l'écouteur de messages pour le recalcul
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "recalculerMoyennes") {
            console.log("Recalcul des moyennes demandé");
            // Forcer une réanalyse
            dernierTableauHash = "";
            contenuPrecedent = "";
            analyseTerminee = false;
            setTimeout(lancerAnalyse, 100);
        }
    });
    
    // Exposer la fonction lancerAnalyse dans la portée globale window
    window.lancerAnalyse = lancerAnalyse;
    
    // Exposer également la fonction analyserTableau pour les tentatives d'analyse manuelle
    window.analyserTableau = analyserTableau;
    console.log("Fonctions d'analyse exposées globalement: lancerAnalyse et analyserTableau disponibles");
})();

// Modèle des fonctions pour les coefficients et l'affichage
(function() {
    // Fonction pour afficher les coefficients 
    window.afficherCoefficients = function(classe, container) {
        if (!container) {
            console.error("Container pour les coefficients non trouvé");
            return;
        }
        
        container.innerHTML = '';
        
        // Récupérer les coefficients pour cette classe
        const coefficients = obtenirCoefficientsParClasse(classe);
        
        // Créer des éléments pour chaque matière et son coefficient
        for (const [matiere, coeff] of Object.entries(coefficients)) {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                padding: 5px;
                border-bottom: 1px solid #eee;
            `;
            
            const matiereSpan = document.createElement('span');
            matiereSpan.textContent = matiere;
            
            const coeffInput = document.createElement('input');
            coeffInput.type = 'number';
            coeffInput.min = '0';
            coeffInput.max = '10';
            coeffInput.step = '0.5';
            coeffInput.value = coeff;
            coeffInput.style.width = '60px';
            
            coeffInput.addEventListener('change', function() {
                // Mettre à jour le coefficient dans l'objet
                coefficients[matiere] = parseFloat(this.value) || 0;
                
                // Sauvegarder les nouveaux coefficients
                sauvegarderCoefficients(classe, coefficients);
                
                // Recalculer la moyenne
                const tableauActuel = document.querySelector('table.table');
                if (tableauActuel) {
                    calculerEtAfficherMoyenne(tableauActuel);
                }
            });
            
            row.appendChild(matiereSpan);
            row.appendChild(coeffInput);
            container.appendChild(row);
        }
    };

    // Fonction pour sauvegarder les coefficients
    window.sauvegarderCoefficients = function(classe, coefficients) {
        try {
            // Récupérer tous les coefficients stockés
            let tousCoefficients = {};
            try {
                tousCoefficients = JSON.parse(localStorage.getItem('calmoyenne_coefficients') || '{}');
            } catch (e) {
                console.error("Erreur lors de la récupération des coefficients:", e);
            }
            
            // Mettre à jour les coefficients pour cette classe
            tousCoefficients[classe] = coefficients;
            
            // Sauvegarder dans le stockage local
            localStorage.setItem('calmoyenne_coefficients', JSON.stringify(tousCoefficients));
            console.log(`Coefficients sauvegardés pour la classe ${classe}`);
        } catch (e) {
            console.error("Erreur lors de la sauvegarde des coefficients:", e);
        }
    };
    
    // Fonction pour obtenir les coefficients par classe
    window.obtenirCoefficientsParClasse = function(classe) {
        // Coefficients par défaut selon la classe
        const coefficientsDefaut = {
            // Collège
            '6EME': {
                'Français': 1,
                'Mathématiques': 1,
                'Histoire-Géographie': 1,
                'Anglais': 1,
                'SVT': 1,
                'Technologie': 1,
                'Arts plastiques': 0.5,
                'Musique': 0.5,
                'EPS': 1
            },
            '5EME': {
                'Français': 1,
                'Mathématiques': 1,
                'Histoire-Géographie': 1,
                'Anglais': 1,
                'SVT': 1,
                'Technologie': 1,
                'Physique-Chimie': 1,
                'Arts plastiques': 0.5,
                'Musique': 0.5,
                'EPS': 1,
                'LV2': 1
            },
            '4EME': {
                'Français': 1,
                'Mathématiques': 1,
                'Histoire-Géographie': 1,
                'Anglais': 1,
                'SVT': 1,
                'Technologie': 1,
                'Physique-Chimie': 1,
                'Arts plastiques': 0.5,
                'Musique': 0.5,
                'EPS': 1,
                'LV2': 1
            },
            '3EME': {
                'Français': 1.5,
                'Mathématiques': 1.5,
                'Histoire-Géographie': 1.5,
                'Anglais': 1,
                'SVT': 1,
                'Technologie': 1,
                'Physique-Chimie': 1,
                'Arts plastiques': 0.5,
                'Musique': 0.5,
                'EPS': 1,
                'LV2': 1
            },
            // Lycée
            '2NDE': {
                'Français': 1.5,
                'Mathématiques': 1.5,
                'Histoire-Géographie': 1,
                'Anglais': 1,
                'LV2': 1,
                'SES': 1,
                'SVT': 1,
                'Physique-Chimie': 1,
                'EPS': 1
            },
            '1ERE': {
                // Tronc commun
                'Français': 2,
                'Histoire-Géographie': 1.5,
                'Anglais': 1.5,
                'LV2': 1.5,
                'Enseignement scientifique': 1,
                'EPS': 1,
                // Spécialités
                'Mathématiques': 2,
                'Physique-Chimie': 2,
                'SVT': 2,
                'SES': 2,
                'HGGSP': 2,
                'LLCE': 2,
                'Humanités': 2,
                'Arts': 2
            },
            'TERM': {
                // Tronc commun
                'Philosophie': 2,
                'Histoire-Géographie': 1.5,
                'Anglais': 1.5,
                'LV2': 1.5,
                'Enseignement scientifique': 1,
                'EPS': 1,
                // Spécialités
                'Mathématiques': 2.5,
                'Physique-Chimie': 2.5,
                'SVT': 2.5,
                'SES': 2.5,
                'HGGSP': 2.5,
                'LLCE': 2.5,
                'Humanités': 2.5,
                'Arts': 2.5,
                // Options
                'Maths complémentaires': 1.5,
                'Maths expertes': 1.5,
                'Droits et grands enjeux': 1
            }
        };
        
        // Essayer de récupérer les coefficients personnalisés pour cette classe
        try {
            const tousCoefficients = JSON.parse(localStorage.getItem('calmoyenne_coefficients') || '{}');
            const coefficientsPersonnalises = tousCoefficients[classe] || {};
            
            // Combiner les coefficients par défaut avec les personnalisés
            return { ...coefficientsDefaut[classe] || {}, ...coefficientsPersonnalises };
        } catch (e) {
            console.error("Erreur lors de la récupération des coefficients personnalisés:", e);
            return coefficientsDefaut[classe] || {};
        }
    };
})();