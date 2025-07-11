// ===================== panier.js
import "../assets/styles/styles.scss";;
import { mettreAJourHeader, estConnecte } from "../utils/auth.js";
import { 
  obtenirPanier, 
  sauvegarderPanier, 
  supprimerDuPanier, 
  viderPanier, 
  mettreAJourCompteurPanier,
  initialiserCompteurPanier 
} from "../utils/panier.js";

import { showSuccessMessage} from "../utils/messages.js";

mettreAJourHeader();

initialiserCompteurPanier();

const main = document.querySelector("main");

/* ============================================================= initialiserPanier */
// Fonction principale pour initialiser la page panier
const initialiserPanier = () => {

  if (!estConnecte()) {
    afficherMessageConnexionRequise();
    return;
  }
  
  // Charger et afficher le panier
  afficherPanier();
};

/* ============================================================= afficherPanier */
// Fonction pour afficher le contenu du panier
const afficherPanier = () => {
  const panier = obtenirPanier();
  
  main.innerHTML = "";
  
  // Créer le titre de la page
  const titre = document.createElement("h1");
  titre.className = "page-title";
  titre.textContent = "Mon Panier";
  main.appendChild(titre);
  
  // Vérifier si le panier est vide
  if (panier.length === 0) {
    afficherPanierVide();
    return;
  }
  
  // Créer le conteneur du panier
  const panierContainer = document.createElement("div");
  panierContainer.className = "panier-container";
  
  // Créer la section des articles
  const articlesSection = creerSectionArticles(panier);
  panierContainer.appendChild(articlesSection);
  
  // Créer le résumé de commande
  const resumeSection = creerSectionResume(panier);
  panierContainer.appendChild(resumeSection);
  
  main.appendChild(panierContainer);
  
  // Ajouter les événements
  ajouterEvenementsPanier();
};

/* ============================================================= creerSectionArticles */
// Fonction pour créer la section des articles du panier
const creerSectionArticles = (panier) => {
  const section = document.createElement("div");
  section.className = "panier-articles";
  
  // Titre de la section
  const titre = document.createElement("h2");
  titre.textContent = "Articles dans votre panier";
  section.appendChild(titre);
  
  // Créer chaque article
  panier.forEach(article => {
    const articleElement = creerArticleElement(article);
    section.appendChild(articleElement);
  });
  
  return section;
};

/* ============================================================= creerArticleElement */
// Fonction pour créer un élément article du panier
const creerArticleElement = (article) => {
  const div = document.createElement("div");
  div.className = "panier-article";
  div.dataset.id = article.id;
  
  const sousTotal = (article.prix * article.quantite).toFixed(2);
  
  div.innerHTML = `
    <div class="article-image">
      <img src="${article.image}" alt="${article.nom}" />
    </div>
    
    <div class="article-info">
      <h3 class="article-marque">${article.marque}</h3>
      <h4 class="article-nom">${article.nom}</h4>
      <p class="article-prix">${article.prix}$ / unité</p>
    </div>
    
    <div class="article-quantite">
      <label>Quantité:</label>
      <div class="quantite-controls">
        <button class="btn-diminuer" data-id="${article.id}">
          <i class="fas fa-minus"></i>
        </button>
        <span class="quantite-value">${article.quantite}</span>
        <button class="btn-augmenter" data-id="${article.id}">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    
    <div class="article-sous-total">
      <p class="sous-total-label">Sous-total:</p>
      <p class="sous-total-prix">${sousTotal}$</p>
    </div>
    
    <div class="article-actions">
      <button class="btn-supprimer" data-id="${article.id}">
        <i class="fas fa-trash"></i>
        Supprimer
      </button>
    </div>
  `;
  
  return div;
};

/* ============================================================= creerSectionResume */
// Fonction pour créer la section résumé de commande
const creerSectionResume = (panier) => {
  const section = document.createElement("div");
  section.className = "panier-resume";
  
  // Calculer les totaux
  const sousTotal = panier.reduce((total, article) => total + (article.prix * article.quantite), 0);
  const taxes = sousTotal * 0.15; // 15% de taxes 
  const total = sousTotal + taxes;
  const nombreArticles = panier.reduce((total, article) => total + article.quantite, 0);


  section.innerHTML = `
    <h2>Résumé de commande</h2>
    
    <div class="resume-ligne">
      <span>Articles (${nombreArticles}):</span>
      <span>${sousTotal.toFixed(2)}$</span>
    </div>
    
    <div class="resume-ligne">
      <span>Taxes (15%):</span>
      <span>${taxes.toFixed(2)}$</span>
    </div>
    
    <div class="resume-ligne resume-total">
      <span><strong>Total:</strong></span>
      <span><strong>${total.toFixed(2)}$</strong></span>
    </div>
    
    <div class="resume-actions">
      <button class="btn-vider-panier">
        <i class="fas fa-trash"></i>
        Vider le panier
      </button>
      
      <button class="btn-continuer-achats">
        <i class="fas fa-arrow-left"></i>
        Continuer les achats
      </button>
      
      <button class="btn-commander">
        <i class="fas fa-credit-card"></i>
        Passer la commande
      </button>
    </div>
  `;
  
  return section;
};

/* ============================================================= ajouterEvenementsPanier */
// Fonction pour ajouter les événements de la page panier
const ajouterEvenementsPanier = () => {
  // Boutons pour diminuer la quantité
  const btnsDiminuer = document.querySelectorAll(".btn-diminuer");
  btnsDiminuer.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const articleId = parseInt(e.target.closest(".btn-diminuer").dataset.id);
      modifierQuantite(articleId, -1);
    });
  });
  
  // Boutons pour augmenter la quantité
  const btnsAugmenter = document.querySelectorAll(".btn-augmenter");
  btnsAugmenter.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const articleId = parseInt(e.target.closest(".btn-augmenter").dataset.id);
      modifierQuantite(articleId, 1);
    });
  });
  
  // Boutons pour supprimer un article
  const btnsSupprimer = document.querySelectorAll(".btn-supprimer");
  btnsSupprimer.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const articleId = parseInt(e.target.closest(".btn-supprimer").dataset.id);
      supprimerArticle(articleId);
    });
  });
  
  // Bouton pour vider le panier
  const btnViderPanier = document.querySelector(".btn-vider-panier");
  if (btnViderPanier) {
    btnViderPanier.addEventListener("click", viderPanierComplet);
  }
  
  // Bouton pour continuer les achats
  const btnContinuerAchats = document.querySelector(".btn-continuer-achats");
  if (btnContinuerAchats) {
    btnContinuerAchats.addEventListener("click", () => {
      window.location.href = "/";
    });
  }
  
  // Bouton pour commander
  const btnCommander = document.querySelector(".btn-commander");
  if (btnCommander) {
    btnCommander.addEventListener("click", passerCommande); 
  }
};

/* ============================================================= modifierQuantite */
// Fonction pour modifier la quantité d'un article
const modifierQuantite = (articleId, changement) => {
  const panier = obtenirPanier();
  const article = panier.find(item => item.id === articleId);
  
  if (article) {
    article.quantite += changement;
    
    // Empêcher les quantités négatives
    if (article.quantite <= 0) {
      supprimerArticle(articleId);
      return;
    }
    
    // Sauvegarder et rafraîchir
    sauvegarderPanier(panier);
    afficherPanier();
  }
};

/* ============================================================= supprimerArticle */
// Fonction pour supprimer un article du panier
const supprimerArticle = (articleId) => {
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet article du panier ?");
  
  if (confirmation) {
    supprimerDuPanier(articleId);
    afficherPanier();
    showSuccessMessage("Article supprimé du panier", main);
  }
};

/* ============================================================= viderPanierComplet */
// Fonction pour vider complètement le panier
const viderPanierComplet = () => {
  const confirmation = confirm("Êtes-vous sûr de vouloir vider complètement votre panier ?");
  
  if (confirmation) {
    viderPanier();
    afficherPanier();
    showSuccessMessage("Panier vidé avec succès", main);
  }
};

/* ============================================================= passerCommande */
// Fonction pour passer la commande
const passerCommande = () => {
  const panier = obtenirPanier();
  
  if (panier.length === 0) {
    afficherMessageErreur("Votre panier ChronosLuxe est vide");
    return;
  }
  
  // Ici vous pourriez ajouter la logique de commande
  // Pour l'instant, on simule une commande réussie
  const confirmation = confirm("Confirmer la commande ?");
  
  if (confirmation) {
    viderPanier();
    showSuccessMessage("Commande passée avec succès ! Vous serez redirigé vers la page d'accueil.", main);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  }
};

/* ============================================================= afficherPanierVide */
// Fonction pour afficher un message quand le panier est vide
const afficherPanierVide = () => {
  const messageDiv = document.createElement("div");
  messageDiv.className = "panier-vide";
  
  messageDiv.innerHTML = `
    <div class="panier-vide-content">
      <i class="fas fa-shopping-cart panier-vide-icon"></i>
      <h2>Votre panier ChronosLuxe est vide</h2>
      <p>Découvrez notre collection de montres de luxe</p>
      <a href="/" class="btn-retour-boutique">
        <i class="fas fa-arrow-left"></i>
        Retour à la boutique
      </a>
    </div>
  `;
  
  main.appendChild(messageDiv);
};

/* ============================================================= afficherMessageConnexionRequise */
// Fonction pour afficher un message de connexion requise
const afficherMessageConnexionRequise = () => {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message-connexion";
  
  messageDiv.innerHTML = `
    <div class="message-connexion-content">
      <i class="fas fa-user-lock"></i>
      <h2>Connexion requise</h2>
      <p>Vous devez être connecté pour accéder à votre panier</p>
      <a href="/connexion/connexion.html" class="btn">
        <i class="fas fa-sign-in-alt"></i>
        Se connecter
      </a>
    </div>
  `;
  
  main.appendChild(messageDiv);
};

// Initialiser la page panier au chargement
initialiserPanier();