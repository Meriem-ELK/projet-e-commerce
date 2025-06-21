import "../assets/styles/styles.scss";

const form = document.querySelector("#connexionForm");
const errorElement = document.querySelector("#errorMessage");
const successElement = document.querySelector("#successMessage");
const passwordError = document.querySelector(".password-error");
let errors = [];

// Masquer l'erreur de mot de passe au démarrage
passwordError.style.display = "none";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const utilisateur = Object.fromEntries(formData.entries());

  if (formIsValid(utilisateur)) {
    const json = JSON.stringify(utilisateur);
    // Afficher le message de succès
    successElement.style.display = "block";
    errorElement.style.display = "none";
    passwordError.style.display = "none";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Validation en temps réel du mot de passe
const passwordInput = document.querySelector("#motdepasse");
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  if (password.length > 0 && password.length < 6) {
    passwordError.style.display = "block";
    passwordInput.style.borderColor = "#dc3545";
  } else {
    passwordError.style.display = "none";
    passwordInput.style.borderColor = "#e0e0e0";
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

  return true;
}

const formIsValid = (utilisateur) => {
  errors = [];

  // Vérifier les champs obligatoires
  if (!utilisateur.email || !utilisateur.motdepasse) {
    errors.push("Vous devez renseigner tous les champs obligatoires");
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
