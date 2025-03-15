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
            
            // Écouter TOUS les clics sur la page pour Firefox
            document.addEventListener('click', function(e) {
                if (isFirefox) {
                    // Plus de délais pour Firefox: étaler sur 1,5 secondes
                    const delaisFirefox = [100, 300, 500, 800, 1200, 1500];
                    delaisFirefox.forEach(delai => {
                        setTimeout(() => verifierChangementTableau(), delai);
                    });
                } else {
                    // Chrome: juste deux vérifications
                    setTimeout(() => verifierChangementTableau(), 500);
                    setTimeout(() => verifierChangementTableau(), 1000);
                }
            }, true); // Mode capture pour intercepter tous les clics
            
            // Capture des événements qui pourraient signifier un changement de période
            const captureEvenements = (e) => {
                console.log("Événement potentiel de changement détecté:", e.type);
                // Vérifier plusieurs fois pour être sûr
                setTimeout(() => verifierChangementTableau(), 300);
                setTimeout(() => verifierChangementTableau(), 700);
                setTimeout(() => verifierChangementTableau(), 1200);
            };
            
            // Liste des événements à surveiller
            const evenementsImportants = ['change', 'input', 'click', 'mouseup'];
            
            // Ajouter une détection agressive pour Firefox
            if (isFirefox) {
                evenementsImportants.forEach(event => {
                    document.addEventListener(event, captureEvenements, true);
                });
                
                // Remplacer DOMNodeInserted par un MutationObserver
                const observateurNodesAjoutes = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            setTimeout(() => verifierChangementTableau(), 500);
                        }
                    });
                });
                
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
                                }, true);
                            });
                        });
                    }
                } catch (err) {
                    console.error("Erreur lors de l'ajout d'écouteurs sur sélecteurs:", err);
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
                const partiesTexte = texte.split(/Coef\s+\d+/i);
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
        
        // Motif pour détecter les coefficients répétés (ex: "Coef 6 Coef 6 Coef 6...")
        const patternCoeff = /(Coef\s+\d+(\.\d+)?)\s+(\1\s+)+/gi;
        
        // Remplacer les répétitions par une seule occurrence
        let texteNettoye = texte.replace(patternCoeff, "$1 ");
        
        // Cas particulier: texte qui contient uniquement des répétitions de coefficients
        if (texteNettoye.trim().startsWith("Coef ") && (texteNettoye.match(/Coef\s+\d+(\.\d+)?/gi)?.length > 1)) {
            // Extraire le premier coefficient
            const premierCoeff = texteNettoye.match(/Coef\s+\d+(\.\d+)?/i);
            if (premierCoeff) {
                return premierCoeff[0];
            }
        }
        
        return texteNettoye;
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
            
            // Tableaux pour collecter les infos sur les matières détectées
            const matieresDetectees = [];
            
            // Parcourir chaque ligne à partir de la deuxième
            for (let i = 1; i < lignes.length; i++) {
                const ligne = lignes[i];
                const cellules = ligne.querySelectorAll("td");
                
                // Vérifier si cette ligne contient des données de matière (au moins 3 cellules)
                if (cellules.length < 3) {
                    console.log(`Ligne ${i} ignorée: pas assez de cellules (${cellules.length})`);
                    continue;
                }
                
                // Chercher la cellule qui contient la moyenne
                let moyenne = null;
                let coeff = 1;
                let matiereNom = "";
                let indexMoyenne = -1;
                let coeffSource = "défaut"; // Pour indiquer l'origine du coefficient
                
                // Récupérer le nom de la matière (généralement dans la première cellule)
                if (cellules[0]) {
                    // Nettoyer le texte de la matière en supprimant complètement tous les coefficients
                    const texteOriginal = cellules[0].textContent.trim();
                    
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
                            cellules[0].setAttribute("data-original-content", texteOriginal);
                            // Remplacer le texte visible par seulement le nom de la matière
                            cellules[0].textContent = matiereNom;
                            console.log(`Nettoyage complet des coefficients pour ${matiereNom}`);
                        } catch (e) {
                            console.error("Erreur lors du nettoyage de la cellule:", e);
                        }
                    }
                    
                    console.log(`Matière trouvée: ${matiereNom}`);
                }
                
                // Recherche améliorée de la moyenne
                // 1. Chercher dans les en-têtes du tableau s'il y a une colonne "Moyenne"
                if (i === 1) { // Seulement pour la première ligne de données
                    const enTetes = tableau.querySelectorAll("th");
                    for (let j = 0; j < enTetes.length; j++) {
                        const texte = enTetes[j].textContent.trim().toLowerCase();
                        if (texte.includes("moyenne") || texte === "moy" || texte === "moy." || texte.includes("note")) {
                            indexMoyenne = j;
                            console.log(`Colonne de moyenne identifiée à l'index ${j}`);
                            break;
                        }
                    }
                }
                
                // 2. Si on a identifié la colonne de moyenne, l'utiliser directement
                if (indexMoyenne !== -1 && indexMoyenne < cellules.length) {
                    const texte = cellules[indexMoyenne].textContent.trim();
                    if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*$/.test(texte)) {
                        moyenne = parseFloat(texte.replace(",", "."));
                        console.log(`Moyenne trouvée dans la colonne identifiée (${indexMoyenne}): ${moyenne}`);
                    }
                }
                
                // 3. Si pas trouvé, chercher dans les positions typiques
                if (moyenne === null) {
                    const possiblesIndexMoyenne = [4, 3, 2, 1]; // Indices possibles pour la cellule de moyenne (0-based)
                    
                    for (const idx of possiblesIndexMoyenne) {
                        if (cellules[idx] && /^\s*(\d{1,2}([,.]\d{1,2})?)\s*$/.test(cellules[idx].textContent)) {
                            moyenne = parseFloat(cellules[idx].textContent.trim().replace(",", "."));
                            console.log(`Moyenne trouvée dans la cellule d'index ${idx}: ${moyenne}`);
                            break;
                        }
                    }
                }
                
                // 4. Si toujours pas trouvé, parcourir toutes les cellules
                if (moyenne === null) {
                    for (let j = 0; j < cellules.length; j++) {
                        const texte = cellules[j].textContent.trim();
                        if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*$/.test(texte)) {
                            moyenne = parseFloat(texte.replace(",", "."));
                            console.log(`Moyenne trouvée dans la cellule d'index ${j}: ${moyenne}`);
                            break;
                        }
                    }
                }
                
                // Essayer d'abord d'obtenir le coefficient selon la classe et la matière
                let coeffClasse = null;
                if (classeEleve && matiereNom) {
                    coeffClasse = suggererCoefficient(matiereNom, classeEleve);
                    if (coeffClasse !== null) {
                        coeff = coeffClasse;
                        coeffSource = `classe ${classeEleve}`;
                        console.log(`Coefficient ${coeff} appliqué pour ${matiereNom} en classe de ${classeEleve}`);
                    }
                }
                
                // Si aucun coefficient n'a été trouvé via la classe, utiliser la détection standard
                if (coeffClasse === null) {
                    // Recherche améliorée des coefficients
                    // 1. Chercher une cellule avec "coef" ou "coefficient"
                    let coeffTrouve = false;
                    for (let j = 0; j < cellules.length; j++) {
                        // Nettoyer le texte de la cellule pour éviter les répétitions
                        const texteOriginal = cellules[j].textContent.trim();
                        const texteNettoye = nettoyerCoefficientsRepetes(texteOriginal).toLowerCase();
                        
                        // Si le texte a été modifié, mettre à jour l'affichage
                        if (texteNettoye !== texteOriginal.toLowerCase()) {
                            try {
                                // Sauvegarder le contenu original et remplacer le texte visible
                                cellules[j].setAttribute("data-original-content", texteOriginal);
                                cellules[j].textContent = texteNettoye;
                            } catch (e) {
                                console.error("Erreur lors du nettoyage de la cellule de coefficient:", e);
                            }
                        }
                        
                        if (texteNettoye.includes("coef") || texteNettoye.includes("coefficient")) {
                            // Vérifier la cellule suivante pour le coefficient numérique
                            if (j+1 < cellules.length) {
                                const valeurTexteOriginal = cellules[j+1].textContent.trim();
                                const valeurTexte = nettoyerCoefficientsRepetes(valeurTexteOriginal);
                                
                                // Mettre à jour si nécessaire
                                if (valeurTexte !== valeurTexteOriginal) {
                                    cellules[j+1].setAttribute("data-original-content", valeurTexteOriginal);
                                    cellules[j+1].textContent = valeurTexte;
                                }
                                
                                if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*$/.test(valeurTexte)) {
                                    coeff = parseFloat(valeurTexte.replace(",", "."));
                                    console.log(`Coefficient trouvé après label "coef": ${coeff}`);
                                    coeffTrouve = true;
                                    coeffSource = "tableau";
                                    break;
                                }
                            }
                            
                            // Chercher dans la même cellule si format "Coef: X"
                            const match = texteNettoye.match(/coef(?:ficient)?[^\d]*(\d+(?:[,.]\d+)?)/i);
                            if (match) {
                                coeff = parseFloat(match[1].replace(",", "."));
                                console.log(`Coefficient extrait du texte "${texteNettoye}": ${coeff}`);
                                coeffTrouve = true;
                                coeffSource = "tableau";
                                break;
                            }
                        }
                    }
                    
                    // 2. Si pas trouvé, chercher dans les en-têtes du tableau
                    if (!coeffTrouve && i === 1) { // Seulement pour la première ligne de données
                        const enTetes = tableau.querySelectorAll("th");
                        for (let j = 0; j < enTetes.length; j++) {
                            const texte = enTetes[j].textContent.trim().toLowerCase();
                            if (texte.includes("coef") || texte.includes("coefficient")) {
                                // Regarder la cellule correspondante pour chaque ligne
                                if (j < cellules.length) {
                                    const valeurTexte = cellules[j].textContent.trim();
                                    if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*$/.test(valeurTexte)) {
                                        coeff = parseFloat(valeurTexte.replace(",", "."));
                                        console.log(`Coefficient trouvé dans la colonne ${j}: ${coeff}`);
                                        coeffTrouve = true;
                                        coeffSource = "tableau";
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                    // 3. Si toujours pas trouvé, méthode par défaut
                    if (!coeffTrouve) {
                        for (let j = 0; j < Math.min(3, cellules.length); j++) {
                            const texte = cellules[j].textContent.trim();
                            if (/^\s*(\d{1,2}([,.]\d{1,2})?)\s*$/.test(texte) && parseFloat(texte.replace(",", ".")) <= 10) {
                                coeff = parseFloat(texte.replace(",", "."));
                                console.log(`Coefficient trouvé dans la cellule d'index ${j}: ${coeff}`);
                                coeffSource = "détecté";
                                break;
                            }
                        }
                    }
                }
                
                // Si on a trouvé une moyenne valide
                if (moyenne !== null && !isNaN(moyenne) && moyenne >= 0 && moyenne <= 20) {
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
                            cellules.forEach((cellule, index) => {
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
                        cellules.forEach((cellule, index) => {
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
                            const badgesExistants = cellules[0].querySelectorAll('.badge-coefficient');
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
                            cellules[0].appendChild(badgeCoeff);
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
                    cellCoeff.textContent = matiere.coefficient.toString().replace(".", ",");
                    cellCoeff.style.padding = "8px";
                    cellCoeff.style.borderBottom = "1px solid #ddd";
                    if (matiere.coeffSource.includes("classe")) {
                        cellCoeff.style.backgroundColor = "#e6fffa";
                        cellCoeff.style.fontWeight = "bold";
                    }
                    
                    // Cellule source du coefficient
                    const cellSource = detailRow.insertCell();
                    if (matiere.coeffSource.includes("classe")) {
                        cellSource.textContent = "Adapté à la classe";
                        cellSource.style.color = "#13c2c2";
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
                
                // Bouton de fermeture
                const closeBtn = document.createElement("button");
                closeBtn.textContent = "Fermer";
                closeBtn.style.marginTop = "15px";
                closeBtn.style.padding = "8px 16px";
                closeBtn.style.backgroundColor = "#0056b3";
                closeBtn.style.color = "white";
                closeBtn.style.border = "none";
                closeBtn.style.borderRadius = "4px";
                closeBtn.style.cursor = "pointer";
                
                closeBtn.addEventListener("click", () => {
                    detailContainer.style.display = "none";
                });
                
                detailContainer.appendChild(closeBtn);
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
        if (!classe) return "";
        
        // Convertir en minuscules et supprimer les espaces
        const classeLower = classe.toLowerCase().trim();
        
        // Mapper les différentes représentations vers un format standard
        if (/^6/.test(classeLower) || classeLower.includes("sixieme") || classeLower.includes("sixième")) {
            return "6";
        } else if (/^5/.test(classeLower) || classeLower.includes("cinquieme") || classeLower.includes("cinquième")) {
            return "5";
        } else if (/^4/.test(classeLower) || classeLower.includes("quatrieme") || classeLower.includes("quatrième")) {
            return "4";
        } else if (/^3/.test(classeLower) || classeLower.includes("troisieme") || classeLower.includes("troisième")) {
            return "3";
        } else if (/^2c/i.test(classeLower) || classeLower.includes("seconde c")) {
            return "2C";
        } else if (/^2/.test(classeLower) || classeLower.includes("seconde")) {
            return "2";
        } else if (/^1c/i.test(classeLower) || classeLower.includes("premiere c") || classeLower.includes("première c")) {
            return "1C";
        } else if (/^1d/i.test(classeLower) || classeLower.includes("premiere d") || classeLower.includes("première d")) {
            return "1D";
        } else if (/^1/.test(classeLower) || classeLower.includes("premiere") || classeLower.includes("première")) {
            return "1";
        } else if (/^tc/i.test(classeLower) || classeLower.includes("terminale c")) {
            return "TC";
        } else if (/^td/i.test(classeLower) || classeLower.includes("terminale d")) {
            return "TD";
        } else if (/^t/.test(classeLower) || classeLower.includes("terminale")) {
            return "T";
        }
        
        // Si aucune correspondance, retourner vide
        return "";
    }
    
    // Fonction pour suggérer des coefficients adaptés à la matière et à la classe
    function suggererCoefficient(matiere, classe) {
        // Si pas de classe détectée, retourner coefficient par défaut
        if (!classe || !coefficientsParClasse[classe]) {
            return null;
        }
        
        // Nettoyer le nom de la matière pour la recherche
        const matiereLower = matiere.toLowerCase().trim();
        
        // Recherche directe dans le dictionnaire des coefficients
        for (const [nomMatiere, coeff] of Object.entries(coefficientsParClasse[classe])) {
            if (matiereLower === nomMatiere.toLowerCase()) {
                return coeff;
            }
        }
        
        // Recherche partielle avec les mots-clés
        const matchingKeywords = {
            'français': 'Français',
            'francais': 'Français',
            'math': 'Maths',
            'histoire': 'Histoire-Géo',
            'geo': 'Histoire-Géo',
            'anglais': 'Anglais',
            'lv1': 'Anglais',
            'espagnol': 'Espagnol',
            'lv2': 'Espagnol',
            'allemand': 'Allemand',
            'italien': 'Italien',
            'latin': 'LCA Latin',
            'grec': 'LCA Grec',
            'svt': 'SVT',
            'sciences': 'SVT',
            'physique': 'Physique-Chimie',
            'chimie': 'Physique-Chimie',
            'phys': 'Physique-Chimie',
            'techno': 'Technologie',
            'art': 'Arts Plastiques',
            'plastique': 'Arts Plastiques',
            'musique': 'Musique',
            'eps': 'EPS',
            'sport': 'EPS',
            'philo': 'Philosophie',
            'philosophie': 'Philosophie',
            'ses': 'SES',
            'eco': 'SES',
            'nsi': 'NSI',
            'info': 'NSI',
            'snt': 'SNT',
            'numerique': 'SNT',
            'ens.sci': 'Enseignement Scientifique',
            'hggsp': 'HGGSP',
            'humanité': 'Humanités',
            'llce': 'LLCE Anglais'
        };
        
        for (const [keyword, nomMatiere] of Object.entries(matchingKeywords)) {
            if (matiereLower.includes(keyword)) {
                // Vérifier si cette matière a un coefficient dans la classe actuelle
                if (coefficientsParClasse[classe][nomMatiere]) {
                    return coefficientsParClasse[classe][nomMatiere];
                }
            }
        }
        
        // Si aucune correspondance, retourner null
        return null;
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
    
    // Exposer la fonction lancerAnalyse dans la portée globale window
    window.lancerAnalyse = lancerAnalyse;
    
    // Exposer également la fonction analyserTableau pour les tentatives d'analyse manuelle
    window.analyserTableau = analyserTableau;
    
    console.log("Fonctions d'analyse exposées globalement: lancerAnalyse et analyserTableau disponibles");
})();
