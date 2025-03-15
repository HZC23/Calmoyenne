/**
 * Script d'initialisation de l'extension
 * Ce script charge les dépendances dans le bon ordre pour Firefox et Chrome
 */

console.log("Initialisation de l'extension Calculateur de Moyenne...");

// Détection améliorée pour Firefox/Chrome
const isFirefox = typeof browser !== 'undefined';
const browserAPI = isFirefox ? browser : chrome;
const userAgent = navigator.userAgent;
console.log("Environnement détecté:", isFirefox ? "Firefox" : "Chrome");
console.log("User Agent:", userAgent);

// Adaptation pour Chrome (Manifest V3) et Firefox
// Vérifier si nous sommes sur un Chromium récent (v88+)
const chromeVersion = userAgent.match(/Chrome\/(\d+)/);
const isModernChrome = chromeVersion && parseInt(chromeVersion[1], 10) >= 88;

// Vérifier si nous sommes bien sur École Directe
if (window.location.hostname.includes('ecoledirecte.com')) {
    console.log("Site École Directe détecté, chargement des scripts...");
    
    // Attendre que la page soit complètement chargée
    if (document.readyState === 'complete') {
        console.log("Document déjà chargé, initialisation immédiate");
        initializeExtension();
    } else {
        console.log("En attente du chargement complet du document");
        window.addEventListener('load', initializeExtension);
    }
} else {
    console.log("Ce n'est pas le site École Directe, l'extension ne sera pas chargée");
}

// Fonction principale d'initialisation
function initializeExtension() {
    console.log("Initialisation de l'extension...");
    
    // Délais adaptés à chaque navigateur
    const delaiInitial = isFirefox ? 2000 : 1000;
    
    // Pinger le background script pour vérifier qu'il est actif (pour Chrome avec Manifest V3)
    if (!isFirefox && isModernChrome) {
        try {
            browserAPI.runtime.sendMessage({ type: "ping" }, function(response) {
                console.log("Réponse du background script:", response);
            });
        } catch (err) {
            console.error("Erreur lors du ping au background script:", err);
        }
    }
    
    // Ajouter une fonction pour analyser le contenu de la page à la recherche de classes
    function detecterClasseDansHTML() {
        console.log("Recherche de classe dans le HTML...");
        
        // Recherche des formats comme "Xème Y" où X est le niveau et Y le numéro de classe
        const classeNumeroteePattern = /([1-6])(?:ème|eme|e)(?:\s+|\s*-\s*)(\d+)/i;
        const toutLeTexte = document.body.innerText;
        const classeNumeroteeMatch = toutLeTexte.match(classeNumeroteePattern);
        
        if (classeNumeroteeMatch) {
            console.log("DEBUG - Classe avec numéro trouvée dans HTML:", classeNumeroteeMatch[0]);
            console.log("DEBUG - Niveau extrait:", classeNumeroteeMatch[1]);
        } else {
            console.log("DEBUG - Aucune classe avec numéro trouvée dans le HTML");
            
            // Rechercher d'autres formats de classe
            const elementsNiveau = document.querySelectorAll(
                '.niveau, .classe, .grade, h1, h2, h3, .header-title, .user-info, .profil-eleve, .student-info, .etudiant-info'
            );
            
            elementsNiveau.forEach((element, index) => {
                console.log(`DEBUG - Élément ${index} contenu:`, element.textContent.trim());
            });
        }
    }
    
    // Exécuter la détection de classe après un délai
    setTimeout(detecterClasseDansHTML, delaiInitial + 500);
    
    // Assurer que script.js est chargé avant de lancer l'analyse
    function chargerScriptAnalyse() {
        // Vérifier si script.js est déjà chargé
        if (typeof window.lancerAnalyse === 'function') {
            console.log("Fonction lancerAnalyse trouvée, lancement de l'analyse...");
            window.lancerAnalyse();
            return true;
        } else {
            console.warn("Fonction lancerAnalyse non disponible, tentative d'injection du script...");
            
            // Créer et injecter le script manuellement
            const scriptElement = document.createElement('script');
            scriptElement.src = browserAPI.runtime.getURL('script.js');
            scriptElement.onload = function() {
                console.log("Script d'analyse chargé manuellement");
                // Vérifier à nouveau après chargement
                setTimeout(() => {
                    if (typeof window.lancerAnalyse === 'function') {
                        console.log("Fonction lancerAnalyse disponible après chargement manuel");
                        window.lancerAnalyse();
                    } else {
                        console.error("Fonction lancerAnalyse toujours non disponible après chargement manuel");
                    }
                }, 500);
            };
            scriptElement.onerror = function() {
                console.error("Erreur lors du chargement manuel du script d'analyse");
            };
            
            document.head.appendChild(scriptElement);
            return false;
        }
    }
    
    // Attendre que tout soit chargé avant de démarrer l'analyse
    setTimeout(() => {
        try {
            console.log("Démarrage de l'analyse après délai initial...");
            const scriptCharge = chargerScriptAnalyse();
            
            // Observer les changements de contenu pour déclencher l'analyse à nouveau
            // lorsque la navigation entre les pages se fait sans rechargement complet
            if (scriptCharge) {
                configurerObservateurs();
            } else {
                // Si le script n'a pas pu être chargé, réessayer plus tard
                setTimeout(configurerObservateurs, 1000);
            }
            
        } catch (err) {
            console.error("Erreur lors du lancement de l'analyse:", err);
        }
    }, delaiInitial);
}

// Observer les changements dans le DOM pour relancer l'analyse si nécessaire
function configurerObservateurs() {
    console.log("Configuration des observateurs de changements...");
    
    // Attendre un peu avant de configurer les observateurs
    setTimeout(() => {
        try {
            // Observer les changements dans le corps du document
            const observateur = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Vérifier si des tableaux ont été ajoutés
                        const tableauxAjoutes = Array.from(mutation.addedNodes)
                            .filter(node => {
                                // Vérifier que node est un élément DOM avant d'appeler querySelector
                                if (node.nodeType === 1) { // 1 = ELEMENT_NODE
                                    return node.tagName === 'TABLE' || node.querySelector && node.querySelector('table');
                                }
                                return false;
                            });
                        
                        if (tableauxAjoutes.length > 0) {
                            console.log("Nouveaux tableaux détectés, relance de l'analyse...");
                            
                            // Relance l'analyse après un court délai
                            setTimeout(() => {
                                if (typeof window.lancerAnalyse === 'function') {
                                    window.lancerAnalyse();
                                }
                            }, 500);
                            
                            break;
                        }
                    }
                }
            });
            
            // Observer tout le document avec une configuration adaptée
            observateur.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
            
            console.log("Observateurs configurés avec succès");
            
        } catch (err) {
            console.error("Erreur lors de la configuration des observateurs:", err);
        }
    }, 1000);
}

// Observer les changements d'URL
window.addEventListener('hashchange', () => {
    console.log("Changement d'URL détecté, relance de l'analyse...");
    
    // Attendre un peu que la page soit mise à jour
    setTimeout(() => {
        if (typeof window.lancerAnalyse === 'function') {
            window.lancerAnalyse();
        }
    }, 1000);
});

// Attendre avant de déclencher l'analyse pour éviter les conflits
console.log("Script d'initialisation terminé"); 