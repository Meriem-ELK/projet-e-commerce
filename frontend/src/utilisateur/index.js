import "../assets/styles/styles.scss";

import { mettreAJourHeader, estConnecte, estAdmin, obtenirUtilisateurConnecte } from "../utils/auth.js";

// Vérifier si l'utilisateur est connecté
if (!estConnecte()) {
    window.location.href = "../connexion/connexion.html";
}

mettreAJourHeader();

/**
 * Charger et afficher les informations du profil utilisateur
*/
let utilisateurActuel = null;

function chargerProfilUtilisateur() {

    utilisateurActuel = obtenirUtilisateurConnecte();
    
    if (!utilisateurActuel) {
        window.location.href = "../connexion/connexion.html";
        return;
    }
    
    // Mettre à jour les informations affichées
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userRoleElement = document.getElementById('userRole');
    const userStatusElement = document.getElementById('userStatus');
    
   
    if (userNameElement) {
        userNameElement.textContent = utilisateurActuel.nom || 'Non défini';
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = utilisateurActuel.email || 'Non défini';
    }
    
    // Afficher le rôle
    if (userRoleElement) {
        const role = utilisateurActuel.role || 'user';
        userRoleElement.textContent = role === 'admin' ? 'Administrateur' : 'Utilisateur';
        userRoleElement.className = `role-badge ${role}`;
    }
    
    // Afficher le statut du compte
    if (userStatusElement) {
        const estActif = utilisateurActuel.estActif !== false;
        userStatusElement.textContent = estActif ? 'Actif' : 'Inactif';
        userStatusElement.className = `status-badge ${estActif ? 'active' : 'inactive'}`;
    }
    
}
chargerProfilUtilisateur() ;