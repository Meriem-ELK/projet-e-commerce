import "../assets/styles/styles.scss";

// Importation des variables d'environnement
import { env } from "../config/env.js";

// Importation des fonctions de validation et d'affichage d'erreurs
import { formIsValid, displayErrors } from "../utils/validation.js";

import { estConnecte, mettreAJourHeader } from "../utils/auth.js";

// Vérifier si l'utilisateur est connecté
if (!estConnecte()) {
    alert('Vous devez être connecté pour ajouter un produit');
    window.location.href = '../connexion/connexion.html';
}

// Mettre à jour le header
mettreAJourHeader();

// Sélection du formulaire et des éléments d'affichage des messages
const form = document.querySelector("#productForm");
const errorElement = document.querySelector("#errorMessage");
const successElement = document.querySelector("#successMessage");

/* ============================================================== */
// Écoute de l'événement de soumission du formulaire
form.addEventListener("submit", async (event) => {

  // Empêche le rechargement de la page lors de la soumission
  event.preventDefault();

  // Récupération des données du formulaire
  const formData = new FormData(form);
  const montre = Object.fromEntries(formData.entries());

  // Utiliser la fonction de validation importée
  const validation = formIsValid(montre);
  
  if (validation.isValid) {
    try {
      // Convertir les types appropriés
      const productData = {
        nom: montre.nom,
        marque: montre.marque,
        description: montre.description,
        categorie: montre.categorie,
        materiau: montre.materiau,
        mouvement: montre.mouvement,
        etancheite: montre.etancheite,
        image: montre.image,
        prix: parseFloat(montre.prix),  // Conversion du prix en nombre flottant
        stock: parseInt(montre.stock),  // Conversion du stock en entier
        image: montre.image?.trim() || null,   // Nettoyage du champ image
        id: Date.now(), // Générer un ID unique
        dateAjout: new Date().toISOString()  //Ajout de la date d’ajout au format ISO
      };


      // Envoi des données au backend via une requête POST
      const response = await fetch(env.BACKEND_PRODUCTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      // Récupération de la réponse JSON
      const result = await response.json();


      // Afficher le message de succès
      successElement.textContent = "Produit ajouté avec succès !";
      successElement.style.display = "block";
      errorElement.style.display = "none";

      // Réinitialiser le formulaire
      form.reset();

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
      errorElement.textContent = "Erreur lors de l'ajout du produit.";
      errorElement.style.display = "block";
      successElement.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else {
    // Afficher les erreurs avec la fonction importée
    displayErrors(validation.errors, errorElement, successElement);
  }
});