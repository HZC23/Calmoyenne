/**
 * Polyfill complet pour la compatibilité entre Chrome et Firefox
 * Basé sur webextension-polyfill
 */
(function() {
    'use strict';
    
    // Détection plus fiable de Firefox
    const isFirefox = typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined';
    
    // Si nous sommes déjà sur Firefox, browser est déjà défini
    if (isFirefox) {
        console.log("Environnement Firefox détecté, polyfill non nécessaire");
        return;
    }
    
    console.log("Environnement Chrome détecté, application du polyfill");
    
    // Créer l'objet browser s'il n'existe pas
    window.browser = window.browser || {};
    
    // Fonction utilitaire pour promisifier les API Chrome
    const promisify = function(api, ...args) {
        return new Promise((resolve, reject) => {
            try {
                api(...args, result => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    };
    
    // Runtime API
    if (chrome.runtime) {
        window.browser.runtime = window.browser.runtime || {
            get lastError() { return chrome.runtime.lastError; },
            
            sendMessage(...args) {
                return promisify(chrome.runtime.sendMessage, ...args);
            },
            
            onMessage: {
                addListener(callback) {
                    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                        const result = callback(message, sender);
                        
                        // Si le résultat est une Promise, gérer le sendResponse
                        if (result && typeof result.then === 'function') {
                            result.then(sendResponse);
                            return true; // Indique que sendResponse sera appelé de façon asynchrone
                        }
                    });
                },
                removeListener(callback) {
                    chrome.runtime.onMessage.removeListener(callback);
                }
            },
            
            getURL(path) {
                return chrome.runtime.getURL(path);
            },
            
            get id() {
                return chrome.runtime.id;
            }
        };
    }
    
    // Tabs API
    if (chrome.tabs) {
        window.browser.tabs = window.browser.tabs || {
            query(queryInfo) {
                return promisify(chrome.tabs.query, queryInfo);
            },
            
            create(createProperties) {
                return promisify(chrome.tabs.create, createProperties);
            },
            
            update(tabId, updateProperties) {
                return promisify(chrome.tabs.update, tabId, updateProperties);
            },
            
            get(tabId) {
                return promisify(chrome.tabs.get, tabId);
            }
        };
    }
    
    // Storage API
    if (chrome.storage) {
        window.browser.storage = window.browser.storage || {};
        
        for (const area of ['local', 'sync', 'managed']) {
            if (chrome.storage[area]) {
                window.browser.storage[area] = window.browser.storage[area] || {
                    get(keys) {
                        return promisify(chrome.storage[area].get, keys);
                    },
                    set(items) {
                        return promisify(chrome.storage[area].set, items);
                    },
                    remove(keys) {
                        return promisify(chrome.storage[area].remove, keys);
                    },
                    clear() {
                        return promisify(chrome.storage[area].clear);
                    }
                };
            }
        }
    }
    
    console.log("Polyfill appliqué avec succès");
})(); 