/**
 * ====================== Validation du prix
 */
export function validatePrice(priceString) {
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

/**
 * ======================  Validation du stock
 */
export function validateStock(stockString) {
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


/**
 * ============================== Validation de l'email
 */
export function validateEmail(email) {
  if (!email) {
    return "L'email est obligatoire !";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Le format de l'email n'est pas valide !";
  }

  return true;
}

/**
 * ==============================  Validation du mot de passe
 */
export function validatePassword(password) {
  if (!password) {
    return "Le mot de passe est obligatoire !";
  }

  if (password.length < 6) {
    return "Le mot de passe doit contenir au moins 6 caractères !";
  }

  return true;
}

/**
 * ==============================  Validation du formulaire de connexion
 */
export function validateLoginForm(utilisateur) {
  const errors = [];

  // Validation de l'email
  const emailValidation = validateEmail(utilisateur.email);
  if (emailValidation !== true) {
    errors.push(emailValidation);
  }

  // Validation du mot de passe
  const passwordValidation = validatePassword(utilisateur.motdepasse);
  if (passwordValidation !== true) {
    errors.push(passwordValidation);
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}


/**
 * ==============================  Validation du nom/prénom
 */
export function validateName(name, fieldName) {
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


/**
 * ==============================  Validation du formulaire d'inscription
 */
export function validateRegistrationForm(utilisateur) {
  const errors = [];

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
  if (utilisateur.prenom) {
    const prenomValidation = validateName(utilisateur.prenom, "Le prénom");
    if (prenomValidation !== true) {
      errors.push(prenomValidation);
    }
  }

  // Validation du nom
  if (utilisateur.nom) {
    const nomValidation = validateName(utilisateur.nom, "Le nom");
    if (nomValidation !== true) {
      errors.push(nomValidation);
    }
  }

  // Validation de l'email
  if (utilisateur.email) {
    const emailValidation = validateEmail(utilisateur.email);
    if (emailValidation !== true) {
      errors.push(emailValidation);
    }
  }

  // Validation du mot de passe
  if (utilisateur.motdepasse) {
    const passwordValidation = validatePassword(utilisateur.motdepasse);
    if (passwordValidation !== true) {
      errors.push(passwordValidation);
    }
  }

  // Validation de la confirmation du mot de passe
  if (utilisateur.motdepasse && utilisateur.confirmation) {
    if (utilisateur.motdepasse !== utilisateur.confirmation) {
      errors.push("Les mots de passe ne correspondent pas !");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * ======================  Validation principale du formulaire
 */
export const formIsValid = (montre) => {
  const errors = [];

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
  if (montre.prix) {
    const priceValidation = validatePrice(montre.prix);
    if (priceValidation !== true) {
      errors.push(priceValidation);
    }
  }

  // Validation du stock
  if (montre.stock) {
    const stockValidation = validateStock(montre.stock);
    if (stockValidation !== true) {
      errors.push(stockValidation);
    }
  }

  // Validation de l'URL de l'image
  if (montre.image && montre.image.trim() !== "") {
    try {
      new URL(montre.image);
    } catch {
      errors.push("L'URL de l'image n'est pas valide !");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};


/**
 * ======================  Affichage des erreurs
 */
export function displayErrors(errors, errorElement, successElement) {
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
  } else {
    errorElement.innerHTML = "";
    errorElement.style.display = "none";
  }
}