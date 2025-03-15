// Attendre que le DOM soit complètement chargé avant d'initialiser
window.addEventListener('load', function() {
    console.log('Chargement complet de la popup...');
    
    // Charger les données
    loadCoefficients();
    loadDefaultClasse();
    
    // Initialiser les gestionnaires d'événements
    setTimeout(() => {
        console.log('Initialisation des événements...');
        initTabButtons();
        initActionButtons();
        initSearchField();
        initImportField();
    }, 100);
});

// Backup en cas de problème avec l'événement load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé...');
    if (!document.querySelector('.tab-btn.active')) {
        console.log('Initialisation de secours...');
        initTabButtons();
    }
});

// Fonction d'initialisation principale
function initializePopup() {
    console.log('Initialisation de la popup...');
    
    // Charger les données
    loadCoefficients();
    loadDefaultClasse();
    
    // Initialiser les gestionnaires d'événements
    initTabButtons();
    initActionButtons();
    initSearchField();
    initImportField();
}

// Initialiser les boutons d'onglets
function initTabButtons() {
    console.log('Initialisation des boutons d\'onglets...');
    const tabButtons = document.querySelectorAll('.tab-btn');
    console.log(`Nombre de boutons d'onglets trouvés : ${tabButtons.length}`);
    
    tabButtons.forEach((button, index) => {
        button.removeEventListener('click', handleTabClick);
        button.addEventListener('click', handleTabClick);
    });
}

// Gestionnaire d'événement pour les clics sur les onglets
function handleTabClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const tabId = this.getAttribute('data-tab');
    console.log(`Clic sur l'onglet: ${tabId}`);
    showTab(tabId);
}

// --------- FONCTIONS D'INITIALISATION DES ÉVÉNEMENTS ---------

// Initialiser les boutons d'action
function initActionButtons() {
    // Ajout de coefficient
    const addButton = document.querySelector('.btn[data-action="add-coeff"]');
    if (addButton) {
        addButton.addEventListener('click', addCoefficient);
    }
    
    // Enregistrer les coefficients
    const saveButton = document.querySelector('.btn[data-action="save-coeffs"]');
    if (saveButton) {
        saveButton.addEventListener('click', saveCoefficients);
    }
    
    // Réinitialiser les coefficients
    const resetButton = document.querySelector('.btn[data-action="reset-coeffs"]');
    if (resetButton) {
        resetButton.addEventListener('click', resetCoefficients);
    }
    
    // Sauvegarder la classe par défaut
    const saveClasseButton = document.querySelector('.btn[data-action="save-classe"]');
    if (saveClasseButton) {
        saveClasseButton.addEventListener('click', saveDefaultClasse);
    }
    
    // Exporter les coefficients
    const exportButton = document.querySelector('.btn[data-action="export-coeffs"]');
    if (exportButton) {
        exportButton.addEventListener('click', exportCoefficients);
    }
    
    // Importer les coefficients
    const importButton = document.querySelector('.btn[data-action="import-coeffs"]');
    if (importButton) {
        importButton.addEventListener('click', importCoefficients);
    }
}

// Initialiser le champ de recherche
function initSearchField() {
    const searchField = document.getElementById('search-coeff');
    if (searchField) {
        searchField.addEventListener('keyup', searchCoeffs);
    }
}

// Initialiser le champ d'import de fichier
function initImportField() {
    const importFile = document.getElementById('import-file');
    if (importFile) {
        importFile.addEventListener('change', handleFileImport);
    }
}

// --------- FONCTIONS DE GESTION DES ONGLETS ---------

// Fonction pour afficher un onglet et masquer les autres
function showTab(tabId) {
    if (!tabId) return;
    console.log(`Affichage de l'onglet: ${tabId}`);
    
    try {
        // Récupérer tous les boutons et contenus
        const allButtons = document.querySelectorAll('.tab-btn');
        const allContents = document.querySelectorAll('.tab-content');
        
        // Désactiver tous les onglets et contenus
        allButtons.forEach(btn => btn.classList.remove('active'));
        allContents.forEach(content => content.classList.remove('active'));
        
        // Activer le bouton sélectionné
        const selectedButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
        
        // Activer le contenu sélectionné
        const targetContent = document.getElementById(`${tabId}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
        } else {
            console.error(`Contenu non trouvé pour l'onglet: ${tabId}-tab`);
        }
    } catch (error) {
        console.error('Erreur lors du changement d\'onglet:', error);
    }
}

// --------- FONCTIONS DE GESTION DES COEFFICIENTS ---------

// Fonction pour afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Supprimer la notification après l'animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fonction de recherche de coefficients
function searchCoeffs() {
    const searchTerm = document.getElementById('search-coeff').value.toLowerCase();
    const rows = document.querySelectorAll('#coeff-list tr');
    
    rows.forEach(row => {
        if (row.querySelector('.empty-table-message')) return;
        
        const matiere = row.querySelector('.matiere-col').textContent.toLowerCase();
        if (matiere.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Fonction pour ajouter un coefficient
function addCoefficient() {
    const matiereInput = document.getElementById('new-matiere');
    const coeffInput = document.getElementById('new-coeff');
    
    const matiere = matiereInput.value.trim();
    const coeff = parseFloat(coeffInput.value);
    
    if (!matiere) {
        showNotification("Veuillez entrer le nom de la matière");
        return;
    }
    
    if (isNaN(coeff) || coeff < 0 || coeff > 20) {
        showNotification("Le coefficient doit être entre 0 et 20");
        return;
    }
    
    try {
        const coeffsData = JSON.parse(localStorage.getItem('calmoyenne_coefficients_personnalises') || '{}');
        coeffsData[matiere] = coeff;
        localStorage.setItem('calmoyenne_coefficients_personnalises', JSON.stringify(coeffsData));
        
        // Réinitialiser les champs
        matiereInput.value = '';
        coeffInput.value = '';
        
        // Recharger la liste
        loadCoefficients();
        showNotification(`Coefficient pour "${matiere}" ajouté`);
    } catch (e) {
        console.error("Erreur lors de l'ajout du coefficient:", e);
        showNotification("Erreur lors de l'ajout du coefficient");
    }
}

// Fonction pour sauvegarder les coefficients modifiés
function saveCoefficients() {
    try {
        const inputs = document.querySelectorAll('.coeff-input[data-matiere]');
        const coefficientsModifies = {};
        
        inputs.forEach(input => {
            const matiere = input.dataset.matiere;
            const coefficient = parseFloat(input.value);
            if (!isNaN(coefficient) && matiere) {
                coefficientsModifies[matiere] = coefficient;
            }
        });
        
        localStorage.setItem('calmoyenne_coefficients_personnalises', JSON.stringify(coefficientsModifies));
        
        // Recharger la liste pour refléter les changements
        loadCoefficients();
        
        // Forcer le recalcul des moyennes dans tous les onglets ouverts
        chrome.tabs.query({url: "*://*.ecoledirecte.com/*"}, function(tabs) {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {action: "recalculerMoyennes"});
            });
        });
        
        showNotification("Coefficients personnalisés enregistrés avec succès");
    } catch (e) {
        console.error("Erreur lors de l'enregistrement des coefficients:", e);
        showNotification("Erreur lors de l'enregistrement des coefficients");
    }
}

// Fonction pour réinitialiser les coefficients
function resetCoefficients() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les coefficients personnalisés ?')) {
        try {
            localStorage.removeItem('calmoyenne_coefficients_personnalises');
            
            // Recharger la liste pour refléter les changements
            loadCoefficients();
            
            // Forcer le recalcul des moyennes dans tous les onglets ouverts
            chrome.tabs.query({url: "*://*.ecoledirecte.com/*"}, function(tabs) {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {action: "recalculerMoyennes"});
                });
            });
            
            showNotification("Coefficients réinitialisés aux valeurs par défaut");
        } catch (e) {
            console.error("Erreur lors de la réinitialisation des coefficients:", e);
            showNotification("Erreur lors de la réinitialisation des coefficients");
        }
    }
}

// Fonction pour sauvegarder la classe par défaut
function saveDefaultClasse() {
    const classeSelect = document.getElementById('default-classe');
    const classeValue = classeSelect.value;
    
    try {
        if (classeValue) {
            localStorage.setItem('calmoyenne_classe', classeValue);
            showNotification(`Classe par défaut définie : ${classeSelect.options[classeSelect.selectedIndex].text}`);
        } else {
            localStorage.removeItem('calmoyenne_classe');
            showNotification("Retour à l'auto-détection de classe");
        }
    } catch (e) {
        console.error("Erreur lors de l'enregistrement de la classe:", e);
        showNotification("Erreur lors de l'enregistrement de la classe");
    }
}

// Fonction pour exporter les coefficients
function exportCoefficients() {
    try {
        const coeffsData = JSON.parse(localStorage.getItem('calmoyenne_coefficients_personnalises') || '{}');
        
        // Créer un objet Blob avec les données
        const blob = new Blob([JSON.stringify(coeffsData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        // Créer un lien de téléchargement temporaire
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calmoyenne_coefficients.json';
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
        showNotification("Coefficients exportés avec succès");
    } catch (e) {
        console.error("Erreur lors de l'exportation des coefficients:", e);
        showNotification("Erreur lors de l'exportation des coefficients");
    }
}

// Fonction pour importer les coefficients
function importCoefficients() {
    document.getElementById('import-file').click();
}

// Fonction pour gérer l'importation de fichier
function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Valider que c'est un objet
            if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                throw new Error("Format de fichier invalide");
            }
            
            // Valider les coefficients
            for (const [matiere, coeff] of Object.entries(data)) {
                if (typeof matiere !== 'string' || typeof coeff !== 'number' || coeff < 0 || coeff > 20) {
                    throw new Error(`Coefficient invalide pour "${matiere}"`);
                }
            }
            
            // Enregistrer les coefficients
            localStorage.setItem('calmoyenne_coefficients_personnalises', JSON.stringify(data));
            
            // Recharger la liste
            loadCoefficients();
            showNotification(`${Object.keys(data).length} coefficients importés avec succès`);
        } catch (err) {
            console.error("Erreur lors de l'importation:", err);
            showNotification("Erreur lors de l'importation: " + err.message);
        }
    };
    reader.readAsText(file);
    
    // Réinitialiser l'input file pour permettre de sélectionner le même fichier
    this.value = '';
}

// Fonction pour supprimer un coefficient
function deleteCoefficient(matiere) {
    try {
        const coeffsData = JSON.parse(localStorage.getItem('calmoyenne_coefficients_personnalises') || '{}');
        delete coeffsData[matiere];
        localStorage.setItem('calmoyenne_coefficients_personnalises', JSON.stringify(coeffsData));
        loadCoefficients();
        showNotification(`Coefficient pour "${matiere}" supprimé`);
    } catch (e) {
        console.error("Erreur lors de la suppression du coefficient:", e);
        showNotification("Erreur lors de la suppression du coefficient");
    }
}

// Charger les données initiales de classe
function loadDefaultClasse() {
    try {
        const classeEnregistree = localStorage.getItem('calmoyenne_classe');
        if (classeEnregistree) {
            document.getElementById('default-classe').value = classeEnregistree;
        }
    } catch (e) {
        console.error("Erreur lors du chargement de la classe par défaut:", e);
    }
}

// Chargement des coefficients personnalisés
function loadCoefficients() {
    try {
        const coeffsList = document.getElementById('coeff-list');
        const coeffsData = JSON.parse(localStorage.getItem('calmoyenne_coefficients_personnalises') || '{}');
        
        // Mise à jour du compteur
        const coeffCount = document.getElementById('coeff-count');
        if (coeffCount) {
            coeffCount.textContent = Object.keys(coeffsData).length;
        }
        
        // Effacer le contenu actuel
        if (coeffsList) {
            coeffsList.innerHTML = '';
            
            if (Object.keys(coeffsData).length === 0) {
                coeffsList.innerHTML = '<tr><td colspan="3" class="empty-table-message">Aucun coefficient personnalisé</td></tr>';
                return;
            }
            
            // Trier les matières par ordre alphabétique
            const matieres = Object.keys(coeffsData).sort((a, b) => a.localeCompare(b, 'fr'));
            
            // Ajouter chaque coefficient dans le tableau
            for (const matiere of matieres) {
                const coeff = coeffsData[matiere];
                const row = document.createElement('tr');
                
                // Colonne matière
                const matiereCell = document.createElement('td');
                matiereCell.className = 'matiere-col';
                matiereCell.textContent = matiere;
                
                // Colonne coefficient
                const coeffCell = document.createElement('td');
                coeffCell.className = 'coeff-col';
                const coeffInput = document.createElement('input');
                coeffInput.type = 'number';
                coeffInput.className = 'coeff-input';
                coeffInput.value = coeff;
                coeffInput.min = '0';
                coeffInput.max = '20';
                coeffInput.step = '0.5';
                coeffInput.dataset.matiere = matiere;
                coeffCell.appendChild(coeffInput);
                
                // Colonne actions
                const actionsCell = document.createElement('td');
                actionsCell.className = 'actions-col';
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-red btn-icon';
                deleteBtn.textContent = '×';
                deleteBtn.title = 'Supprimer';
                deleteBtn.dataset.action = 'delete-coeff';
                deleteBtn.dataset.matiere = matiere;
                deleteBtn.addEventListener('click', function() {
                    deleteCoefficient(matiere);
                });
                actionsCell.appendChild(deleteBtn);
                
                // Assembler la ligne
                row.appendChild(matiereCell);
                row.appendChild(coeffCell);
                row.appendChild(actionsCell);
                coeffsList.appendChild(row);
            }
        }
    } catch (e) {
        console.error("Erreur lors du chargement des coefficients:", e);
        showNotification("Erreur lors du chargement des coefficients");
    }
}

// Attendre que le DOM soit complètement chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePopup);
} else {
    initializePopup();
}