// Script d'arrière-plan adapté pour Manifest V3 (service worker)
console.log("Background script chargé");

// Déterminer si nous sommes dans un contexte de service worker (Manifest V3, Chrome)
const isServiceWorker = typeof window === 'undefined' && typeof self !== 'undefined';

// Variables pour stocker les API browser/chrome
let browserAPI;

// Configuration en fonction du contexte d'exécution
if (isServiceWorker) {
    // Contexte service worker (Manifest V3, Chrome)
    console.log("Exécution en tant que service worker");
    browserAPI = chrome;
} else {
    // Contexte standard (Manifest V2, Firefox ou contexte d'extension Chrome)
    try {
        // Tenter d'utiliser le polyfill si disponible
        if (typeof browser !== 'undefined') {
            console.log("API browser détectée, probablement Firefox");
            browserAPI = browser;
        } else {
            console.log("API browser non détectée, utilisation de chrome");
            browserAPI = chrome;
        }
    } catch (e) {
        console.error("Erreur lors de la détection du navigateur:", e);
        browserAPI = chrome; // Fallback à chrome
    }
}

// Lorsque l'extension est installée
browserAPI.runtime.onInstalled.addListener(() => {
    console.log("Extension Calculateur de Moyenne installée !");
});

// Écouteur de messages entre scripts
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message reçu:", message);
    
    if (message.type === "ping") {
        console.log("Ping reçu, envoi d'un pong");
        sendResponse({ type: "pong", message: "Background script actif" });
    }
    
    return true;
});

// Pour Manifest V3: ajout d'un écouteur d'activation pour les service workers
if (isServiceWorker) {
    // Ajout d'un gestionnaire d'activation pour les service workers (Chrome uniquement)
    self.addEventListener('activate', event => {
        console.log('Service worker activé');
    });
    
    // Garder le service worker actif
    self.addEventListener('fetch', event => {
        // Un simple gestionnaire vide pour garder le service worker actif
    });
}

console.log("Background script initialisé");
