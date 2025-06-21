import "./assets/styles/styles.scss";
import { montres } from "../data/products.js";

const content = document.querySelector(".content");

const displayMontres = () => {
  const productsContainer = document.createElement("div");
  productsContainer.className = "products-container";

  const products = montres.map((montre) => createProductElement(montre));

  productsContainer.append(...products);
  content.append(productsContainer);
};

const createProductElement = (montre) => {
  const a = document.createElement("a");
  a.className = "product-card";
  a.href = `/produit/produit.html?id=${montre.id}`;
  a.innerHTML = `
    <div class="product-image">
      <img src="${montre.image}" alt="${montre.nom}">
    </div>
    <div class="product-info">
      <h3 class="product-brand">${montre.marque}</h3>
      <h2 class="product-name">${montre.nom}</h2>
      <p class="product-price">${parseFloat(montre.prix).toLocaleString()} $</p>
    </div>
  `;
  return a;
};

displayMontres();
