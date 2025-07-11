import { estConnecte} from "../utils/auth.js";
import { showSuccessMessage, showErrorMessage } from "../utils/messages.js";

/**
* 1- Obtenir le panier depuis sessionStorage
// Cette fonction lit le panier stocké dans sessionStorage et le transforme en objet JavaScript. Si aucun panier n'est trouvé, elle retourne un tableau vide.
*/
export function obtenirPanier() {
    const panier = sessionStorage.getItem('panier');
    return panier ? JSON.parse(panier) : [];
}

/**
* 2- Sauvegarder le panier dans sessionStorage
Cette fonction prend le panier (tableau d'objets) et le sauvegarde dans sessionStorage après l'avoir transformé en chaîne JSON.
*/
export function sauvegarderPanier(panier) {
    sessionStorage.setItem('panier', JSON.stringify(panier));
}

/**
* 3- Ajouter un produit au panier
Cette fonction ajoute un produit au panier. 
Si le produit existe déjà (même ID), elle augmente la quantité.
Sinon, elle ajoute un nouvel objet produit avec une quantité initiale de 1.
*/
export function ajouterAuPanier(produit) {
    const panier = obtenirPanier();
    
    // Vérifier si le produit existe déjà dans le panier
    const produitExistant = panier.find(item => item.id === produit.id);
    
    if (produitExistant) {
        produitExistant.quantite += 1;
    } else {
        // Ajouter le nouveau produit avec quantité 1
        panier.push({
            id: produit.id,
            nom: produit.nom,
            marque: produit.marque,
            prix: produit.prix,
            image: produit.image,
            quantite: 1
        });
    }
    
    sauvegarderPanier(panier);
    mettreAJourCompteurPanier();
}

/**
* 4- Supprimer un produit du panier
// Cette fonction enlève un produit spécifique du panier (grâce à son id).
*/
export function supprimerDuPanier(produitId) {
    const panier = obtenirPanier();

    // Filtrer pour garder uniquement les produits dont l'ID est différent de celui à supprimer
    const nouveauPanier = panier.filter(item => item.id !== produitId);
    sauvegarderPanier(nouveauPanier);
    mettreAJourCompteurPanier();
}

/**
* 5- Vider le panier
// Cette fonction supprime totalement le panier de sessionStorage.
*/
export function viderPanier() {
    sessionStorage.removeItem('panier');
    mettreAJourCompteurPanier();
}

/**
 * 6- Obtenir le nombre total d'articles dans le panier
// Cette fonction additionne les quantités de tous les produits du panier pour obtenir le total.
 */
export function obtenirNombreTotalArticles() {
    const panier = obtenirPanier();
    return panier.reduce((total, item) => total + item.quantite, 0);
}

/**
* 7- Mettre à jour le compteur
// Cette fonction met à jour le badge du panier dans le header.
*/
export function mettreAJourCompteurPanier() {
    const nombreArticles = obtenirNombreTotalArticles();
    const iconePanier = document.querySelector('.cart-icon');
    
    if (iconePanier) {

        // Supprimer l'ancien badge s'il existe
        const ancienBadge = iconePanier.querySelector('.cart-badge');
        if (ancienBadge) {
            ancienBadge.remove();
        }
        
        // Ajouter le nouveau badge si des articles sont présents
        if (nombreArticles > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = nombreArticles;
            iconePanier.appendChild(badge);
        }
    }
}

/**
* 8- Initialiser le compteur du panier au chargement de la page
// Cette fonction permet de mettre à jour le compteur dès que la page est chargée
*/
export function initialiserCompteurPanier() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mettreAJourCompteurPanier);
    } else {
        mettreAJourCompteurPanier();
    }
}

/**
* 9- Ajouter les événements pour les boutons "Ajouter au panier"
* Cette fonction peut être utilisée dans différentes pages
*/
export const addCartEvents = (container, successCallback) => {
  const addToCartButtons = container.querySelectorAll(".btn-add-to-cart");
  
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      
      // Récupérer les données du produit
      const produitData = JSON.parse(button.dataset.produit);
      
      // Vérifier si l'utilisateur est connecté
      if (!estConnecte()) {
        alert("Vous devez être connecté pour ajouter un produit au panier.");
        window.location.href = "/connexion/connexion.html";
        return;
      }
      
      // Ajouter au panier
      ajouterAuPanier(produitData);
      
      // Afficher un message de succès
      const message = `"${produitData.nom}" a été ajouté au panier.`;
      
      if (successCallback && typeof successCallback === 'function') {
        successCallback(message);
      } else {
        showSuccessMessage(message, container);
      }
    });
  });
};