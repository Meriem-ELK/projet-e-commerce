// produit.js
import "../assets/styles/styles.scss";
import { montres } from "../../data/products.js";

const main = document.querySelector(".produit-detail");
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

const montre = montres.find((item) => item.id === id);

if (!montre) {
  main.innerHTML = `
    <div class="error-container">
      <h2>Produit introuvable</h2>
      <p>Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
      <a href="../index.html" class="btn btn-retour">Retour à l'accueil</a>
    </div>
  `;
} else {
  main.innerHTML = `
    <div class="produit-container">
      <div class="produit-desc">
        <div class="produit-image">
          <img src="${montre.image}" alt="${montre.nom}" />
        </div>
        <h2 class="marque">${montre.marque}</h2>
        <p class="description">${montre.description}</p>
      </div>
     
      <div class="produit-info">
        <h1>${montre.nom}</h1>
        
        <ul class="details">
          <li><strong>Catégorie</strong> <span>${montre.categorie}</span></li>
          <li><strong>Matière</strong> <span>${montre.materiau}</span></li>
          <li><strong>Mouvement</strong> <span>${montre.mouvement}</span></li>
          <li><strong>Étanchéité</strong> <span>${montre.etancheite}</span></li>
          <li><strong>Stock</strong> <span>${
            montre.stock > 0
              ? `${montre.stock} disponible(s)`
              : "Rupture de stock"
          }</span></li>
        </ul>
        <p class="prix">${parseFloat(montre.prix).toLocaleString()} $</p>
        <button class="btn-acheter" ${montre.stock <= 0 ? "disabled" : ""}>
          ${montre.stock > 0 ? "Acheter maintenant" : "Rupture de stock"}
        </button>
      </div>

      
    </div>
  `;
}
