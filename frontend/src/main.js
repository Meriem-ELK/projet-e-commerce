// ===================== main.js
import "./assets/styles/styles.scss";

//Import des variables d'environnement depuis un fichier de config
import { env } from "./config/env.js";

import { mettreAJourHeader, estConnecte, estAdmin } from "./utils/auth.js";
import { initialiserCompteurPanier, addCartEvents  } from "./utils/panier.js";
import { showSuccessMessage, showErrorMessage } from "./utils/messages.js";
import { supprimerProduit, recupererTousLesProduits } from "./utils/produits.js";

mettreAJourHeader();

initialiserCompteurPanier();

const content = document.querySelector(".content");

/* ============================================================= fetchProduits */
// Fonction pour récupérer et afficher les produits depuis le backend
const fetchProduits = async () => {
  try {
    // Utiliser la fonction utilitaire pour récupérer les produits
    const produits = await recupererTousLesProduits();
    
    if (produits.length === 0) {
      showErrorMessage("Aucun produit disponible.", content);
      return;
    }
     
    // Afficher les produits dans la page
    displayProduits(produits);
    
  } catch (error) {
    console.error("Une erreur est survenue lors de la récupération.", error);
    showErrorMessage("Échec du chargement des produits.", content);
  }
};

/* ============================================================= displayProduits */
// Fonction pour afficher les produits dans le DOM
const displayProduits = (produits) => {

  // Réinitialiser le conteneur
  content.innerHTML = "";
  
  // Création d'un conteneur pour les cartes produit
  const productsContainer = document.createElement("div");
  productsContainer.className = "products-container";
  
  // Créer et afficher chaque produit (ordre inversé)
  const products = produits
    .slice(0)
    .reverse()
    .map((produit) => createProductElement(produit));
  
  // Ajouter tous les produits au conteneur
  productsContainer.append(...products);
  
  // Ajouter les événements pour modifier/supprimer SEULEMENT si admin
  if (estAdmin()) {
    addEditDeleteEvents(productsContainer);
  }
  
  // Ajouter les événements pour le panier
  addCartEvents(productsContainer, (message) => showSuccessMessage(message, content));
  
  // Ajouter le conteneur à la page
  content.append(productsContainer);
};

/* ============================================================= createProductElement */
// Fonction pour créer un élément produit
const createProductElement = (produit) => {
  const div = document.createElement("div");
  div.className = "product-card";
  
  // Afficher les boutons d'actions SEULEMENT si l'utilisateur est admin
  const actionsHTML = estAdmin() ? `
    <div class="product-actions product_btn">
      <button class="btn-edit" data-id="${produit.id}" title='Modifier'>
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button class="btn-delete" data-id="${produit.id}" title='Supprimer'>
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  ` : '';
  
  // Déterminer le texte et l'état du bouton selon le stock
  const boutonTexte = produit.stock > 0 ? 
    '<i class="fas fa-cart-plus"></i> Ajouter au panier' : 
    '<i class="fas fa-shopping-cart"></i> Rupture de stock';
  
  const boutonClasse = produit.stock > 0 ? 'btn-add-to-cart' : 'disabled';
  
  // Contenu HTML de la carte produit
    let contentHTML = `
      ${actionsHTML}

      <div class="product-content">
        <div class="product-image">
          <a href="/produit/produit.html?id=${produit.id}">
            <img src="${produit.image}" alt="${produit.nom}">
          </a>
        </div>
        
        <div class="product-info">
          <h3 class="brand">${produit.marque}</h3>
          <h2 class="title">${produit.nom}</h2>
          <p class="price">${produit.prix}$</p>
        </div>
    `;

    // Ajout du bouton si connecté et pas admin (dans .product-content)
    if (estConnecte() && !estAdmin()) {
      contentHTML += `
        <div class="product-link">
          <button class="btn-acheter ${boutonClasse}" data-produit='${JSON.stringify(produit)}' ${produit.stock <= 0 ? 'disabled' : ''}>
            ${boutonTexte}
          </button>
        </div>
      `;
    }

    // Fermeture du bloc .product-content
    contentHTML += `
      </div>
    `;
    
    div.innerHTML = contentHTML;

    return div;
    };

/* ============================================================= addEditDeleteEvents */
// Fonction pour ajouter les événements de modification et suppression
const addEditDeleteEvents = (container) => {

  // Vérifier si l'utilisateur est admin
  if (!estAdmin()) {
    console.log("Utilisateur non admin - pas d'événements ajoutés");
    return;
  }

  // =============== Boutons de modification
  const editButtons = container.querySelectorAll(".btn-edit");

  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.closest(".btn-edit").dataset.id;

      // Redirection vers la page de modification
      window.location.assign(`/produitModification/produitModif.html?id=${productId}`);
    });
  });
  

  // ============== Boutons de suppression
  const deleteButtons = container.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.closest(".btn-delete").dataset.id;
      
      // Utiliser la fonction utilitaire pour supprimer
      const suppressionReussie = await supprimerProduit(productId, false);
      
      if (suppressionReussie) {
        // Recharger les produits depuis le backend
        await fetchProduits();
        showSuccessMessage("Produit supprimé avec succès", content);
      } else {
        showErrorMessage("Erreur lors de la suppression du produit", content);
      }
    });
  });
};

// Initialiser l'application - charger les produits au démarrage
fetchProduits();