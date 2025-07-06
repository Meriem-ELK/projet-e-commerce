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
 * Obtenir un utilisateur par ID
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

/**
 * Trouver un utilisateur par email
*/

export const trouverParEmail = async (req, res) => {
  try {
    const user = await User.findByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Connexion d'un utilisateur - VERSION CORRIGÉE
*/
export const connecterUtilisateur = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier que l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email et mot de passe sont requis" 
      });
    }

    // Trouver l'utilisateur par email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ 
        message: "Email ou mot de passe incorrect" 
      });
    }

    // Vérifier le mot de passe
    if (user.password !== password) {
      return res.status(401).json({ 
        message: "Email ou mot de passe incorrect" 
      });
    }

    // Connexion réussie
    res.json({
      message: "Connexion réussie",
      success: true
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: error.message 
    });
  }
};