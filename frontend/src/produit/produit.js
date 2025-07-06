// ===================== produit.js
import "../assets/styles/styles.scss";
import { env } from "../config/env.js";

import { mettreAJourHeader, estConnecte } from "../utils/auth.js";


// Met à jour l'en-tête de la page selon que l'utilisateur est connecté ou non
mettreAJourHeader();


// Récupérer l'élément principal où afficher le produit
const main = document.querySelector(".produit-detail");

// Récupérer l'ID du produit depuis l'URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Vérifier si un ID est présent dans l'URL
if (!id) {
    // Si pas d'ID, afficher une erreur
    main.innerHTML = `
        <div class="error-container">
            <h2>Erreur</h2>
            <p>Aucun produit spécifié</p>
            <a href="../index.html" class="btn"><i class="fas fa-arrow-left"></i> Retour à l'accueil</a>
        </div>
    `;
} else {
    // Si l’ID est présent, on charge le produit
    chargerProduit();
}

/* ====================================================== chargerProduit */
// Fonction pour charger le produit
async function chargerProduit() {
    try {
        // Afficher un message de chargement
        main.innerHTML = `
            <div class="loading-container">
                <p>Chargement du produit...</p>
            </div>
        `;
   
        // Faire une requête GET vers le backend
        const response = await fetch(`${env.BACKEND_PRODUCTS_URL}/${id}`);
        
        // Vérifier si la requête a réussi
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        // Convertir la réponse en JSON
        const produit = await response.json();
        
        //Afficher le bouton acheter si on est connecte
        const boutonHTML = estConnecte()
        ? `<button class="btn-acheter" ${produit.stock <= 0 ? "disabled" : ""}>
                ${produit.stock > 0 ? "Acheter maintenant" : "Rupture de stock"}
        </button>`
        : `<a href="../connexion/connexion.html" class="btn-acheter"><i class="fas fa-sign-in-alt"></i> Connectez-vous pour acheter</a>`;


        // Afficher le produit dans la page
        main.innerHTML = `
        <div class="box_details">
            <span class="lien_div">
                <a href="../index.html"><i class="fas fa-arrow-left"></i> Retour à la page des produits</a>
            </span>
            <div class="produit-container">
                <div class="produit-desc">
                    <div class="produit-image">
                        <img src="${produit.image || 'default-image.jpg'}" alt="${produit.nom}" />
                    </div>
                    <h2 class="marque">${produit.marque}</h2>
                    <p class="description">${produit.description}</p>
                </div>
               
                <div class="produit-info">
                
                    <h1>${produit.nom}</h1>
                    
                    <ul class="details">
                        <li><strong>Catégorie</strong> <span>${produit.categorie}</span></li>
                        <li><strong>Matière</strong> <span>${produit.materiau}</span></li>
                        <li><strong>Mouvement</strong> <span>${produit.mouvement}</span></li>
                        <li><strong>Étanchéité</strong> <span>${produit.etancheite}</span></li>
                        <li><strong>Stock</strong> <span>${
                            produit.stock > 0
                                ? `${produit.stock} disponible(s)`
                                : "Rupture de stock"
                        }</span></li>
                    </ul>
                    
                    <p class="prix">${parseFloat(produit.prix).toLocaleString()} $</p>
                    
                    <div class="product-actions">
                        ${boutonHTML} 
                    </div>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        // En cas d'erreur
        main.innerHTML = `
            <div class="error-container">
                <h2>Erreur</h2>
                <p>Erreur lors du chargement du produit</p>
                <a href="../index.html" class="btn"><i class="fas fa-arrow-left"></i> Retour à l'accueil</a>
            </div>
        `;
    }
}