// Script d'arrière-plan simplifié
console.log("Background script chargé");

// Lorsque l'extension est installée
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Calculateur de Moyenne installée !");
});

// Écouteur de messages entre scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message reçu:", message);
    return true;
});
