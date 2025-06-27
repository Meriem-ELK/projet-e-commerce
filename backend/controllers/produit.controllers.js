// Import du modèle Product
import Product from "../database/models/Product.js";


/**
 * Créer un nouveau produit
 */
export const creerProduit = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Lister tous les produits
*/
export const listerTousLesProduits = async (req, res) => {
  try {
    // Récupération de tous les produits
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtenir un produit par son ID
*/
export const obtenirUnProduit = async (req, res) => {
  try {
    // Recherche du produit par id
    const product = await Product.findById(req.params.id); 
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Mettre à jour un produit existant
*/
export const mettreAJourUnProduit = async (req, res) => {
  try {
    const product = await Product.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Supprimer un produit
*/
export const supprimerUnProduit = async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Produit non trouvé" });
    res.json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
