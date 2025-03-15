// Script d'arrière-plan adapté pour Manifest V3 (service worker)
console.log("Background script chargé");

// Importer le polyfill pour Firefox
import './browser-polyfill.js';

// Déterminer si nous sommes sur Firefox ou Chrome
const isFirefox = typeof browser !== 'undefined';
const browserAPI = isFirefox ? browser : chrome;

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
if (!isFirefox && typeof self !== 'undefined') {
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
