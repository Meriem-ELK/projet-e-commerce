// ===================== utils/produits.js
import { env } from "../config/env.js";
import { estAdmin } from "./auth.js";

/**
 * Supprime un produit du backend
*/
export const supprimerProduit = async (productId, redirectAfterDelete = false) => {
    // Vérifier les permissions
    if (!estAdmin()) {
        alert("Vous n'avez pas les permissions pour supprimer ce produit.");
        return false;
    }

    // Demander confirmation
    const confirmDelete = confirm("Cette action est définitive. Voulez-vous vraiment supprimer ce produit ?");
    
    if (!confirmDelete) {
        return false;
    }

    try {
        // Convertir l'ID en string pour éviter les problèmes avec les gros nombres
        const id = String(productId);
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('authToken');
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Ajouter le token seulement s'il existe
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${env.BACKEND_PRODUCTS_URL}/${id}`, {
            method: "DELETE",
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`Erreur de suppression: ${response.status}`);
        }
        
        // Succès
        if (redirectAfterDelete) {
            alert("Produit supprimé avec succès");
            window.location.href = "../index.html";
        }
        
        return true;
        
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du produit");
        return false;
    }
};

/**
 * Récupère un produit par son ID
*/
export const recupererProduit = async (productId) => {
    try {
        const response = await fetch(`${env.BACKEND_PRODUCTS_URL}/${productId}`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
        return null;
    }
};

/**
 * Récupère tous les produits
*/
export const recupererTousLesProduits = async () => {
    try {
        const response = await fetch(env.BACKEND_PRODUCTS_URL);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        let produits = await response.json();
        
        // S'assurer que c'est un tableau
        if (!Array.isArray(produits)) {
            produits = [produits];
        }
        
        return produits;
        
    } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        return [];
    }
};