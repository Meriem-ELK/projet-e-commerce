// ===================== main.js
import "./assets/styles/styles.scss";

//Import des variables d'environnement depuis un fichier de config
import { env } from "./config/env.js";

import { mettreAJourHeader, estConnecte } from "./utils/auth.js";

// Met à jour l'en-tête de la page selon que l'utilisateur est connecté ou non
mettreAJourHeader();

const content = document.querySelector(".content");

/* ============================================================= fetchProduits */
// Fonction pour récupérer et afficher les produits depuis le backend
const fetchProduits = async () => {
  try {
    // console.log("Chargement des produits depuis le backend...");
    
    // Récupérer les produits du backend
    const response = await fetch(env.BACKEND_PRODUCTS_URL);
    
    // Vérifier si la réponse est valide
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Convertir en JSON
    let produits = await response.json();
    
    // S'assurer que c'est un tableau
    if (!Array.isArray(produits)) {
      produits = [produits];
    }
    
    // console.log("Produits récupérés:", produits);
    
    // Afficher les produits dans la page
    displayProduits(produits);
    
  } catch (error) {
    console.error("Une erreur est survenue lors de la récupération.", error);
    showErrorMessage("Échec du chargement des produits.");
  }
};

/* ============================================================= displayProduits */
// Fonction pour afficher les produits dans le DOM
const displayProduits = (produits) => {
  // console.log("Affichage des produits:", produits);
  // console.log("Utilisateur connecté:", estConnecte());

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
  
  // Ajouter les événements pour modifier/supprimer SEULEMENT si connecté
  if (estConnecte()) {
    addEditDeleteEvents(productsContainer);
  }
  
  // Ajouter le conteneur à la page
  content.append(productsContainer);
};

/* ============================================================= createProductElement */
// Fonction pour créer un élément produit
const createProductElement = (produit) => {
  const div = document.createElement("div");
  div.className = "product-card";
  
  // Afficher les boutons d'actions SEULEMENT si l'utilisateur est connecté
  const actionsHTML = estConnecte() ? `
    <div class="product-actions product_btn">
      <button class="btn-edit" data-id="${produit.id}">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button class="btn-delete" data-id="${produit.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  ` : '';
  
   // Contenu HTML de la carte produit
  div.innerHTML = `
    ${actionsHTML}

    <div class="product-content">
      <div class="product-image">
        <img src="${produit.image}" alt="${produit.nom}">
      </div>
      
      <div class="product-info">
        <h3 class="brand">${produit.marque}</h3>
        <h2 class="title">${produit.nom}</h2>
        <p class="price">${produit.prix}$</p>
      </div>
      
      <div class="product-link">
        <a href="/produit/produit.html?id=${produit.id}" class="btn-view">
         <i class="fas fa-eye"></i> Voir le produit
        </a>
      </div>
    </div>
  `;
  
  return div;
};

/* ============================================================= addEditDeleteEvents */
// Fonction pour ajouter les événements de modification et suppression
const addEditDeleteEvents = (container) => {

  // Vérifier si l'utilisateur est connecté
  if (!estConnecte()) {
    console.log("Utilisateur non connecté - pas d'événements ajoutés");
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
      
      // Demander confirmation
      const confirmDelete = confirm("Cette action est définitive. Voulez-vous vraiment continuer ?");
      
      if (confirmDelete) {
        try {
          console.log("Suppression du produit:", productId);
          
          // Envoyer la requête de suppression au backend
          const response = await fetch(`${env.BACKEND_PRODUCTS_URL}/${productId}`, {
            method: "DELETE"
          });
          
          if (!response.ok) {
            throw new Error(`Erreur de suppression: ${response.status}`);
          }
          
          // Optionnel: récupérer la réponse
          const result = await response.json();
          console.log("Réponse du serveur:", result);
          
          // Recharger les produits depuis le backend
          await fetchProduits();
          
          showSuccessMessage("Produit supprimé avec succès");
          
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          showErrorMessage("Erreur lors de la suppression du produit");
        }
      }
    });
  });
};

/* ============================================================= showErrorMessage */
// Fonction pour afficher un message d'erreur
const showErrorMessage = (message) => {
  const errorDiv = document.createElement("div");
  errorDiv.className = "message error";
  errorDiv.textContent = message;
  
  // Ajouter au début du conteneur
  content.insertBefore(errorDiv, content.firstChild);
  
  // Supprimer après 5 secondes
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
};

/* ============================================================= showSuccessMessage */
// Fonction pour afficher un message de succès
const showSuccessMessage = (message) => {
  const successDiv = document.createElement("div");
  successDiv.className = "message success";
  successDiv.textContent = message;
  
  // Ajouter au début du conteneur
  content.insertBefore(successDiv, content.firstChild);
  
  // Supprimer après 5 secondes
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.remove();
    }
  }, 5000);
};

// Initialiser l'application - charger les produits au démarrage
fetchProduits();