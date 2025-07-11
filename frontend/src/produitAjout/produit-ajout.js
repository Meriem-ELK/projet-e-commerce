// ===================== produit-ajout.js
import "../assets/styles/styles.scss";
// Importation des variables d'environnement
import { env } from "../config/env.js";
import { formIsValid, displayErrors } from "../utils/validation.js";
import { estConnecte, mettreAJourHeader } from "../utils/auth.js";

// Vérifier si l'utilisateur est connecté ET est un administrateur
if (!estConnecte() ) {
    alert('Vous devez être connecté en tant qu\'administrateur pour ajouter un produit');
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
        image: montre.image?.trim() || null,   // Nettoyage du champ image
        prix: parseFloat(montre.prix),  // Conversion du prix en nombre flottant
        stock: parseInt(montre.stock),  // Conversion du stock en entier
        dateAjout: new Date().toISOString() 
      };

      // Récupérer le token d'authentification
      const token = localStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Ajouter le token seulement s'il existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Envoi des données au backend via une requête POST
      const response = await fetch(env.BACKEND_PRODUCTS_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(productData)
      });

      // Vérifier si la requête a réussi
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

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
      console.error("Erreur lors de l'ajout:", error);
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