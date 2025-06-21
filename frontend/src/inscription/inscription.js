import "../assets/styles/styles.scss";

const form = document.querySelector("#inscriptionForm");
const errorElement = document.querySelector("#errorMessage");
const successElement = document.querySelector("#successMessage");
let errors = [];

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const utilisateur = Object.fromEntries(formData.entries());

  if (formIsValid(utilisateur)) {
    const json = JSON.stringify(utilisateur);
    // Afficher le message de succès
    successElement.style.display = "block";
    errorElement.style.display = "none";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

function validateEmail(email) {
  if (!email) {
    return "L'email est obligatoire !";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Le format de l'email n'est pas valide !";
  }

  return true;
}

function validatePassword(password) {
  if (!password) {
    return "Le mot de passe est obligatoire !";
  }

  if (password.length < 6) {
    return "Le mot de passe doit contenir au moins 6 caractères !";
  }

  // Vérifier qu'il contient au moins une lettre et un chiffre
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return "Le mot de passe doit contenir au moins une lettre et un chiffre !";
  }

  return true;
}

function validateName(name, fieldName) {
  if (!name) {
    return `${fieldName} est obligatoire !`;
  }

  if (name.length < 2) {
    return `${fieldName} doit contenir au moins 2 caractères !`;
  }

  if (name.length > 50) {
    return `${fieldName} ne peut pas dépasser 50 caractères !`;
  }

  // Vérifier que le nom ne contient que des lettres et espaces
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return `${fieldName} ne peut contenir que des lettres !`;
  }

  return true;
}

const formIsValid = (utilisateur) => {
  errors = [];

  // Vérifier les champs obligatoires
  if (
    !utilisateur.prenom ||
    !utilisateur.nom ||
    !utilisateur.email ||
    !utilisateur.motdepasse ||
    !utilisateur.confirmation
  ) {
    errors.push("Vous devez renseigner tous les champs obligatoires");
  }

  // Validation du prénom
  let mauvaisPrenom = validateName(utilisateur.prenom, "Le prénom");
  if (utilisateur.prenom && mauvaisPrenom !== true) {
    errors.push(mauvaisPrenom);
  }

  // Validation du nom
  let mauvaisNom = validateName(utilisateur.nom, "Le nom");
  if (utilisateur.nom && mauvaisNom !== true) {
    errors.push(mauvaisNom);
  }

  // Validation de l'email
  let mauvaisEmail = validateEmail(utilisateur.email);
  if (utilisateur.email && mauvaisEmail !== true) {
    errors.push(mauvaisEmail);
  }

  // Validation du mot de passe
  let mauvaisMotDePasse = validatePassword(utilisateur.motdepasse);
  if (utilisateur.motdepasse && mauvaisMotDePasse !== true) {
    errors.push(mauvaisMotDePasse);
  }

  // Validation de la confirmation du mot de passe
  if (utilisateur.motdepasse && utilisateur.confirmation) {
    if (utilisateur.motdepasse !== utilisateur.confirmation) {
      errors.push("Les mots de passe ne correspondent pas !");
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
