import "../assets/styles/styles.scss";

const form = document.querySelector("#productForm");
const errorElement = document.querySelector("#errorMessage");
const successElement = document.querySelector("#successMessage");
let errors = [];

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const montre = Object.fromEntries(formData.entries());

  if (formIsValid(montre)) {
    const json = JSON.stringify(montre);
    // Afficher le message de succès
    successElement.style.display = "block";
    errorElement.style.display = "none";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

function validatePrice(priceString) {
  // Test if it's a valid number
  if (!priceString) {
    return "Le prix est obligatoire !";
  }

  // Check if it's a valid number format
  if (!/^\d*\.?\d+$/.test(priceString)) {
    return "Le format du prix est invalide !";
  }

  // Convert to number
  const price = parseFloat(priceString);

  // Check if positive
  if (price <= 0) {
    return "Le prix doit être supérieur à 0";
  }

  // Check if not too large
  if (price > 1000000) {
    return "Le prix est trop haut !";
  }

  // Check decimal places
  if (priceString.split(".")[1]?.length > 2) {
    return "Mettez deux décimales après le . svp!";
  }

  return true;
}

function validateStock(stockString) {
  if (!stockString) {
    return "Le stock est obligatoire !";
  }

  const stock = parseInt(stockString);

  if (isNaN(stock) || stock < 0) {
    return "Le stock doit être un nombre positif !";
  }

  if (stock > 10000) {
    return "Le stock semble trop élevé !";
  }

  return true;
}

const formIsValid = (montre) => {
  errors = [];

  // Vérifier les champs obligatoires
  if (
    !montre.nom ||
    !montre.marque ||
    !montre.prix ||
    !montre.stock ||
    !montre.description ||
    !montre.categorie ||
    !montre.materiau ||
    !montre.mouvement ||
    !montre.etancheite
  ) {
    errors.push("Vous devez renseigner tous les champs obligatoires");
  }

  // Validation de la description
  if (montre.description && montre.description.length < 20) {
    errors.push("La description doit contenir au moins 20 caractères !");
  }

  // Validation du prix
  let mauvaisPrix = validatePrice(montre.prix);
  if (montre.prix && mauvaisPrix !== true) {
    errors.push(mauvaisPrix);
  }

  // Validation du stock
  let mauvaisStock = validateStock(montre.stock);
  if (montre.stock && mauvaisStock !== true) {
    errors.push(mauvaisStock);
  }

  // Validation de l'URL de l'image
  if (montre.image && montre.image.trim() !== "") {
    try {
      new URL(montre.image);
    } catch {
      errors.push("L'URL de l'image n'est pas valide !");
    }
  }

  // Affichage des erreurs
  if (errors.length) {
    let errorHTML = "<ul>";
    errors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    errorHTML += "</ul>";
    errorElement.innerHTML = errorHTML;
    errorElement.style.display = "block";
    successElement.style.display = "none";

    window.scrollTo({ top: 0, behavior: "smooth" });

    return false;
  } else {
    errorElement.innerHTML = "";
    errorElement.style.display = "none";
    return true;
  }
};
