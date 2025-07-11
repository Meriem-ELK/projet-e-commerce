// Import
import JSONArrayDatabase from "../JSONArrayDatabase.js";

const usersDB = new JSONArrayDatabase("utilisateurs.json");

export default class User {

/**
* Crée un nouvel utilisateur après vérification de l'unicité de l'email
*/
  static async create(userData) {

  // Vérifie si un utilisateur avec le même email existe déjà
    const existingUser = await usersDB.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Adresse mail déjà utilisé");
    }

    return usersDB.insert(userData);
  }

/**
* Recherche un utilisateur par son email
*/
  static async findByEmail(email) {
    return usersDB.findByEmail(email);
  }

/**
* Met à jour un utilisateur
*/
  static async update(id, updates) {
    // vérifier qu'il n'existe pas déjà
    if (updates.email) {
      const existingUser = await usersDB.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Adresse mail déjà utilisé");
      }
    }
    return usersDB.update(id, updates);
  }

/**
* Supprime un utilisateur par son id
*/
  static async delete(id) {
    return usersDB.delete(id);
  }

/**
* Recherche un utilisateur par son id
*/
  static async findById(id) {
    return usersDB.findById(id);
  }

/**
* Récupère la liste de tous les utilisateurs
*/
  static async findAll() {
    return usersDB.findAll();
  }
}
