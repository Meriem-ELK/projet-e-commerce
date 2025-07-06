
// Exporte un objet `env` contenant les URLs de l'API backend
export const env = {

  // URL de base du backend (ex: http://localhost:5252)
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5252",

  // URL pour les routes liées aux utilisateurs
  BACKEND_USERS_URL:
    import.meta.env.VITE_BACKEND_USERS_URL || "http://localhost:5252/users",

  // URL pour les routes liées aux produits
  BACKEND_PRODUCTS_URL:
    import.meta.env.VITE_BACKEND_PRODUCTS_URL ||
    "http://localhost:5252/products",
};
