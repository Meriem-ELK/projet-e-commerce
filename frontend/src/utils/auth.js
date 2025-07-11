/**
 * Vérifier si l'utilisateur est connecté
// Cette fonction regarde si une donnée "utilisateur_connecte" est enregistrée dans sessionStorage
*/
export function estConnecte() {
    const utilisateur = sessionStorage.getItem('utilisateur_connecte');
    return utilisateur !== null;
}

/**
 * Vérifier si l'utilisateur connecté est un administrateur
*/
export function estAdmin() {
    const utilisateur = obtenirUtilisateurConnecte();
    return utilisateur && utilisateur.role === "admin";
}

/**
 * Enregistre les infos de l'utilisateur connecté dans sessionStorage
*/
export function sauvegarderUtilisateur(utilisateur) {
    // Retirer le mot de passe avant de sauvegarder
    const utilisateurSansMotDePasse = {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role || 'user', // Valeur par défaut si pas de rôle
        estActif: utilisateur.estActif || true
    };
    
    sessionStorage.setItem('utilisateur_connecte', JSON.stringify(utilisateurSansMotDePasse));
}

/**
 * Récupère l'utilisateur connecté depuis sessionStorage
*/
export function obtenirUtilisateurConnecte() {
    const utilisateur = sessionStorage.getItem('utilisateur_connecte');
    if (utilisateur) {
        return JSON.parse(utilisateur);
    }
    return null;
}

/**
 * Déconnecter l'utilisateur
*/
export function deconnecter() {
    sessionStorage.removeItem('utilisateur_connecte');
    window.location.href = '../index.html';
}

/**
 * Mettre à jour le header selon l'état de connexion
*/
export function mettreAJourHeader() {
    const utilisateur = obtenirUtilisateurConnecte();
    const headerNav = document.querySelector('header ul');

    if (utilisateur) {
        // Utilisateur connecté
        const nomUtilisateur = utilisateur.nom || utilisateur.email;
        
        // Navigation de base pour tous les utilisateurs connectés
        let navigationHTML = `
            <li>
                <a href="../index.html" class="header-nav">
                    <i class="fas fa-home"></i> Accueil
                </a>
            </li>
        `;

        // Ajouter le lien "Ajouter un produit" uniquement pour les administrateurs
        if (estAdmin()) {
            navigationHTML += `
                <li>
                    <a href="../produitAjout/produit-ajout.html" class="header-nav">
                        <i class="fas fa-plus-circle"></i> Ajouter un produit
                    </a>
                </li>
            `;
        }

        // Continuer avec les autres éléments de navigation
        navigationHTML += `
            <li>
                <span class="header-nav user-info">
                    <a href="../utilisateur/index.html" class="header-nav user-info">
                        <i class="fas fa-user"></i> Bienvenue ${nomUtilisateur}
                    </a>
                </span>
            </li>
            <li>
                <a href="#" class="header-nav" id="btnDeconnexion">
                    <i class="fas fa-sign-out-alt"></i> Déconnexion
                </a>
            </li>
        `;
        if (!estAdmin()) {
            navigationHTML += `
            <li>
                <a href="../panier/panier.html" class="header-nav cart-icon" title="Ajouter au panier">
                    <i class="fas fa-cart-plus"></i>
                </a>
            </li>
        `;
        }
        
        // On insère le HTML dans le header
        headerNav.innerHTML = navigationHTML;

        // Bouton de déconnexion
        const btnDeconnexion = document.getElementById('btnDeconnexion');
        if (btnDeconnexion) {
            btnDeconnexion.addEventListener('click', function(e) {
                e.preventDefault();
                const confirmer = confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
                if (confirmer) {
                    deconnecter();
                }
            });
        }
    } else {
        // Utilisateur non connecté
        headerNav.innerHTML = `
            <li>
                <a href="../index.html" class="header-nav">
                    <i class="fas fa-home"></i> Accueil
                </a>
            </li>
            <li>
                <a href="../connexion/connexion.html" class="header-nav">
                    <i class="fas fa-sign-in-alt"></i> Connexion
                </a>
            </li>
            <li>
                <a href="../inscription/inscription.html" class="header-nav">
                    <i class="fas fa-user-plus"></i> Inscription
                </a>
            </li>
        `;
    }
}