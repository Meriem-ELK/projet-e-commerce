import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // Chargement des variables d'environnement
  //console.log("Variables chargées :", env);

  return {
    root: env.VITE_ROOT_DIR || "./src",
  build: {
    outDir:  env.VITE_ROOT_DIR ||  "../dist",
    emptyOutDir: env.VITE_CLEAN_BUILD === "true",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        produit: resolve(__dirname, "src/produit/produit.html"),
        produitAjout: resolve(__dirname, "src/produitAjout/produit-ajout.html"),
        produitModif: resolve(__dirname, "src/produitModification/produitModif.html"),
        utilisateur: resolve(__dirname, "src/utilisateur/index.html"),
        connexion: resolve(__dirname, "src/inscription/inscription.html"),
        inscription: resolve(__dirname, "src/connexion/connexion.html"),
        panier: resolve(__dirname, "src/panier/panier.html"),
        },
      },
    },
  };
});
