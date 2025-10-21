// Fonctions utilitaires

/**
 * Exemple de fonction utilitaire
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-CA', options);
}

/**
 * Validation de formulaire
 */
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    return form.checkValidity();
}

/**
 * Debounce pour optimiser les événements répétitifs
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Exportez vos fonctions si vous utilisez des modules ES6
