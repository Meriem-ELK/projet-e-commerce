// ===================== produit.js
import "../assets/styles/styles.scss";
import { env } from "../config/env.js";

import { mettreAJourHeader, estConnecte, estAdmin } from "../utils/auth.js";
import { ajouterAuPanier, initialiserCompteurPanier, addCartEvents } from "../utils/panier.js";
import { showSuccessMessage} from "../utils/messages.js";
import { supprimerProduit, recupererProduit } from "../utils/produits.js";

// Met à jour l'en-tête de la page selon que l'utilisateur est connecté ou non
mettreAJourHeader();

initialiserCompteurPanier();

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
    // Si l'ID est présent, on charge le produit
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
   
        // Récupérer le produit
        const produit = await recupererProduit(id);
        
        if (!produit) {
            throw new Error("Produit non trouvé");
        }
        
        const boutonClasse = produit.stock > 0 ? 'btn-add-to-cart' : 'disabled';

        
        //Afficher le bouton ajouter au panier si on est connecté
        const boutonHTML = estConnecte() ? !estAdmin()
         ? `<button class="btn-acheter ${boutonClasse}" data-produit='${JSON.stringify(produit)}' ${produit.stock <= 0 ? "disabled" : ""}>
          ${produit.stock > 0 ? '<i class="fas fa-cart-plus"></i> Ajouter au panier' : '<i class="fas fa-shopping-cart"></i> Rupture de stock'}
         </button>`
        : ""
        : `<a href="../connexion/connexion.html" class="btn-acheter">
            <i class="fas fa-sign-in-alt"></i> Connectez-vous pour acheter
        </a>`;

        // Boutons d'administration (modifier/supprimer) pour les admins seulement
        const boutonAdminHTML = estAdmin() ? `
            <div class="admin-actions">
                <button class="btn-edit" onclick="window.location.href='../produitModification/produitModif.html?id=${produit.id}'" title='Modifier'>
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn-supprimer" data-product-id="${produit.id}" title='supprimer'>
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        ` : '';

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
                        ${boutonAdminHTML}
                    </div>
                    </div>
                </div>
            </div>
        `;

        if (estConnecte() && !estAdmin()) {
            addCartEvents(main, (message) => showSuccessMessage(message, main));
        }
        
        // Ajouter les événements pour les boutons admin
        if (estAdmin()) {
            addDeleteEvent();
        }
        
    } catch (error) {
        // En cas d'erreur
        console.error("Erreur lors du chargement du produit:", error);
        main.innerHTML = `
            <div class="error-container">
                <h2>Erreur</h2>
                <p>Erreur lors du chargement du produit</p>
                <a href="../index.html" class="btn"><i class="fas fa-arrow-left"></i> Retour à l'accueil</a>
            </div>
        `;
    }
}

// Fonction pour ajouter l'événement de suppression
function addDeleteEvent() {
    const deleteButton = main.querySelector('.btn-supprimer');
    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            const productId = deleteButton.dataset.productId;
            await supprimerProduit(productId, true);
        });
    }
}