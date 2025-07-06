import "../assets/styles/styles.scss";
import { env } from "../config/env.js";
import { estConnecte, mettreAJourHeader } from "../utils/auth.js";
import { validateRegistrationForm, displayErrors } from "../utils/validation.js";

// Si déjà connecté, rediriger vers l'accueil
if (estConnecte()) {
    window.location.href = '../index.html';
}

// Met à jour l'en-tête de la page selon que l'utilisateur est connecté ou non
mettreAJourHeader();

const form = document.querySelector("#inscriptionForm");
const errorElement = document.querySelector("#errorMessage");
const successElement = document.querySelector("#successMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const utilisateur = Object.fromEntries(formData.entries());

  // Utiliser la fonction centralisée de validation
  const validation = validateRegistrationForm(utilisateur);
  
  if (validation.isValid) {
    // Afficher le message de succès
    successElement.style.display = "block";
    errorElement.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // Afficher les erreurs
    displayErrors(validation.errors, errorElement, successElement);
  }
});