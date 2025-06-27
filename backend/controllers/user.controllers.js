// Import du modèle User
import User from "../database/models/User.js";

/**
 * Créer un nouvel utilisateur
*/
export const creerNouvelUtilisateur = async (req, res) => {
  try {
    // Création d'un nouvel utilisateur avec les données reçues dans la requête
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Lister tous les utilisateurs
*/
export const listerTousLesUtilisateurs = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 
*/
export const obtenirUnUtilisateur = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Mettre à jour un utilisateur
*/
export const mettreAJourUnUtilisateur = async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Supprimer un utilisateur
*/
export const supprimerUnUtilisateur = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const trouverParEmail = async (req, res) => {
  try {
    const user = await User.findByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

