import express from "express";
const router = express.Router();

import {
  creerProduit,
  listerTousLesProduits,
  obtenirUnProduit,
  mettreAJourUnProduit,
  supprimerUnProduit,  
} from "../controllers/produit.controllers.js";

// POST /products - Créer un nouveau produit
router.post("/", creerProduit);

// GET /products - Lister tous les produits
router.get("/", listerTousLesProduits);

// GET /products/:id - Obtenir un produit
router.get("/:id", obtenirUnProduit);

// PUT /products/:id - Mettre à jour un produit complet
router.put("/:id", mettreAJourUnProduit);

// DELETE /products/:id - Supprimer un produit
router.delete("/:id", supprimerUnProduit);

export default router;