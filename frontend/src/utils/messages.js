/**
 * Affiche un message de succès
 */
export function showSuccessMessage(message, container = document.body, duration = 5000) {
    const successDiv = document.createElement("div");
    successDiv.className = "message success";
    successDiv.textContent = message;
    
    // Ajouter au début du conteneur
    container.insertBefore(successDiv, container.firstChild);
    
    // Supprimer après la durée spécifiée
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, duration);
}

/**
 * Affiche un message d'erreur
*/
export function showErrorMessage(message, container = document.body, duration = 5000) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "message error";
    errorDiv.textContent = message;
    
    // Ajouter au début du conteneur
    container.insertBefore(errorDiv, container.firstChild);
    
    // Supprimer après la durée spécifiée
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, duration);
}

/**
 * Supprime tous les messages existants d'un conteneur
 */
export function clearMessages(container = document.body) {
    const messages = container.querySelectorAll('.message');
    messages.forEach(message => message.remove());
}