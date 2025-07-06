// ===================== connexion.js
import "../assets/styles/styles.scss";
import { env } from "../config/env.js";
import { sauvegarderUtilisateur, estConnecte, mettreAJourHeader } from "../utils/auth.js";
import { validateLoginForm, displayErrors } from "../utils/validation.js";

// Si déjà connecté, rediriger vers l'accueil
if (estConnecte()) {
    window.location.href = '../index.html';
}

// Met à jour l'en-tête de la page selon que l'utilisateur est connecté ou non
mettreAJourHeader();

// Récupérer les éléments du formulaire - IDs CORRECTS
const loginForm = document.querySelector('#connexionForm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#motdepasse');
const errorDiv = document.querySelector('#errorMessage');
const successDiv = document.querySelector('#successMessage');

// Gestionnaire de soumission du formulaire
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const utilisateur = {
        email: emailInput.value.trim(),
        motdepasse: passwordInput.value.trim()
    };
    
    // Validation côté client
    const validation = validateLoginForm(utilisateur);
    
    if (!validation.isValid) {
        displayErrors(validation.errors, errorDiv, successDiv);
        return;
    }
    
    try {
        // Afficher message de chargement
        successDiv.innerHTML = "Connexion en cours...";
        successDiv.style.display = "block";
        errorDiv.style.display = "none";
        
        // Envoyer la requête de connexion au backend
        const response = await fetch(`${env.BACKEND_USERS_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: utilisateur.email,
                password: utilisateur.motdepasse
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Connexion réussie
            // Récupérer les données complètes de l'utilisateur
            const userResponse = await fetch(`${env.BACKEND_USERS_URL}/email/${utilisateur.email}`);
            const userData = await userResponse.json();
            
            // Sauvegarder l'utilisateur connecté
            sauvegarderUtilisateur(userData);
            
            successDiv.innerHTML = "Connexion réussie ! Redirection...";
            
            // Rediriger vers l'accueil après 1 seconde
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
            
        } else {
            // Erreur de connexion
            displayErrors([result.message || 'Erreur de connexion'], errorDiv, successDiv);
        }
        
    } catch (error) {
        console.error('Erreur de connexion:', error);
        displayErrors(['Erreur de connexion au serveur'], errorDiv, successDiv);
    }
});