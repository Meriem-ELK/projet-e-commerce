// Import 
import JSONArrayDatabase from "../JSONArrayDatabase.js";

const productsDB = new JSONArrayDatabase("produits.json");

export default class Product {
  
/**
* Crée un nouveau produit
*/
  static async create(productData) {
    // Vérifie que les champs essentiels sont présents
    if (!productData.nom ) {
      throw new Error("Le nom est obligatoires");
    }

    if (!productData.prix ) {
      throw new Error("Le prix est obligatoires");
    }

    if (!productData.marque ) {
      throw new Error("La marque est obligatoires");
    }
     
    return productsDB.insert(productData);
  }

/**
* Recherche un produit par son id
*/
  static async findById(id) {
    return productsDB.findById(id);
  }


/**
* Récupère la liste de tous les produits
*/
  static async findAll() {
    return productsDB.findAll();
  }


/**
* Met à jour un produit existant par son ID
*/
  static async update(id, updates) {
    const existing = await productsDB.findById(id);
    if (!existing) {
      throw new Error("Produit non trouvé");
    }

    // Fusionne les anciennes données avec les nouvelles
    const updatedData = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return productsDB.update(id, updatedData);
  }

/**
* Supprime un produit par son ID
*/
  static async delete(id) {
    return productsDB.delete(id);
  }

}
