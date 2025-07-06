import "../assets/styles/styles.scss";
// Importation des variables d'environnement
import { env } from "../config/env.js";

// Importation des fonctions de validation et d'affichage d'erreurs
import { formIsValid, displayErrors } from "../utils/validation.js";

import { estConnecte, mettreAJourHeader } from "../utils/auth.js";

// Vérifier si l'utilisateur est connecté
if (!estConnecte()) {
    alert('Vous devez être connecté pour modifier un produit');
    window.location.href = '../connexion/connexion.html';
}

// Mettre à jour le header
mettreAJourHeader();

// Sélection du formulaire et des éléments d'affichage des messages
const form = document.getElementById('productForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Récupérer l'ID du produit à modifier depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Si pas d'ID, rediriger vers la page d'accueil
if (!productId) {
    window.location.href = '../index.html';
} else {
    // Charger les données du produit à modifier
    loadProductData(productId);
}

// Écouteur d’événement pour la soumission du formulaire
form.addEventListener('submit', async function(e) {
    e.preventDefault();  // Empêche le rechargement de la page
    
    // Cacher les messages
    hideMessages();
    
    // Récupérer les données du formulaire
    const formData = new FormData(form);
    const montre = Object.fromEntries(formData.entries());
    
    // Utiliser la fonction de validation importée
    const validation = formIsValid(montre);
    
    if (validation.isValid) {
        // Mettre à jour le produit
        await updateProduct(productId, montre);
    } else {
        // Afficher les erreurs avec la fonction importée
        displayErrors(validation.errors, errorMessage, successMessage);
    }
});

/**
 * Charger les données du produit depuis le backend
 */
async function loadProductData(id) {
    try {
        console.log("Chargement du produit depuis le backend...");
        
        // Récupérer le produit spécifique du backend
        const response = await fetch(`${env.BACKEND_PRODUCTS_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const product = await response.json();
        console.log("Produit récupéré:", product);
        
        // Remplir le formulaire avec les données du produit
        populateForm(product);
        
    } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        showError('Erreur lors du chargement du produit.');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }
}

/**
 * Remplir le formulaire avec les données du produit
 */
function populateForm(product) {
    document.getElementById('nom').value = product.nom || '';
    document.getElementById('marque').value = product.marque || '';
    document.getElementById('description').value = product.description || '';
    document.getElementById('prix').value = product.prix || '';
    document.getElementById('stock').value = product.stock || '';
    document.getElementById('categorie').value = product.categorie || '';
    document.getElementById('materiau').value = product.materiau || '';
    document.getElementById('mouvement').value = product.mouvement || '';
    document.getElementById('etancheite').value = product.etancheite || '';
    document.getElementById('image').value = product.image || '';
}

/**
 * Mettre à jour le produit via le backend
 */
async function updateProduct(id, updatedData) {
    try {
        console.log("Mise à jour du produit:", id, updatedData);
        
        // Préparation des données 
        const productData = {
            nom: updatedData.nom,
            marque: updatedData.marque,
            description: updatedData.description,
            categorie: updatedData.categorie,
            materiau: updatedData.materiau,
            mouvement: updatedData.mouvement,
            etancheite: updatedData.etancheite,
            prix: parseFloat(updatedData.prix),
            stock: parseInt(updatedData.stock),
            prix: parseFloat(updatedData.prix),
            image: updatedData.image?.trim() || null
        };
        
        // Requête PUT vers le backend
        const response = await fetch(`${env.BACKEND_PRODUCTS_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Réponse du serveur:", result);
        
        // Afficher le message de succès
        showSuccess('Produit modifié avec succès !');
        
    } catch (error) {
        console.error('Erreur lors de la modification du produit:', error);
        showError('Erreur lors de la modification du produit.');
    }
}

/**
 * Afficher un message de succès
*/
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Faire défiler vers le haut pour voir le message
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Afficher un message d'erreur
*/
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Faire défiler vers le haut pour voir le message
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Cacher tous les messages
 */
function hideMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}