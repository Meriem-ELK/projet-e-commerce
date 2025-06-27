import express from "express";
const router = express.Router();

import {
  creerNouvelUtilisateur,
  listerTousLesUtilisateurs,
  mettreAJourUnUtilisateur,
  supprimerUnUtilisateur,
  trouverParEmail,
  obtenirUnUtilisateur,
} from "../controllers/user.controllers.js";

// POST / - Créer un utilisateur
router.post("/", creerNouvelUtilisateur);

// GET / - Lister tous les utilisateurs
router.get("/", listerTousLesUtilisateurs);

// GET //:id - Obtenir un utilisateur
router.get("/:id", obtenirUnUtilisateur);

// PUT //:id - Mettre à jour un utilisateur
router.put("/:id", mettreAJourUnUtilisateur);

// DELETE //:id - Supprimer un utilisateur
router.delete("/:id", supprimerUnUtilisateur);

// GET //email/:email - Trouver par email
router.get("/email/:email", trouverParEmail);

export default router;
