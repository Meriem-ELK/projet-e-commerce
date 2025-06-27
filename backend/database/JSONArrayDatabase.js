import fs from "fs/promises";  // Pour lire et écrire des fichiers avec des promesses
import path from "path";  // Pour gérer les chemins de fichiers
import { v7 as uuidv7 } from "uuid";  //// Pour générer des identifiants uniqu
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class JSONArrayDatabase {
  constructor(filename) {
    this.filepath = path.join(__dirname, "../data", filename);  // Chemin du fichier JSON
    this.data = [];  // Données chargées depuis le fichier
    this.initialize();
  }

  async initialize() {
    try {
      const fileContent = await fs.readFile(this.filepath, "utf-8");  // Lire le fichier
      this.data = JSON.parse(fileContent);  // Convertir le contenu en tableau JS
    } catch (error) {
      if (error.code === "ENOENT") {
        // Si le fichier n'existe pas, on le crée vide
        await this.save();
      } else {
        console.error(`Error initializing database ${this.filepath}:`, error);
      }
    }
  }

// Enregistrer les données
  async save() {
    try {
      await fs.writeFile(
        this.filepath,
        JSON.stringify(this.data, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error(`Erreur de sauvegarde dans  ${this.filepath}:`, error);
    }
  }

// Ajouter un nouvel élément
  async insert(item) {
    const newItem = {
      ...item,
      id: uuidv7(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.push(newItem);  // Ajoute à la base
    await this.save();  // Sauvegarde dans le fichier
    return newItem;
  }

// Modifier un élément existant
  async update(id, updates) {
    const index = this.data.findIndex((item) => item.id == id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updates };
      await this.save();
      return this.data[index];
    }
    return null;
  }

// Supprimer un élément
  async delete(id) {
    const index = this.data.findIndex((item) => item.id == id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      await this.save();
      return deleted;
    }
    return null;
  }

// Rechercher un élément par ID
  async findById(id) {
    return this.data.find((item) => item.id == id) || null;
  }

// Rechercher un élément par email
  async findByEmail(email) {
    return this.data.find((item) => item.email === email) || null;
  }

// Obtenir tous les éléments
  async findAll() {
    return [...this.data];
  }
}
