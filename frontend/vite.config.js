import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./src", //racine du projet
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        produit: resolve(__dirname, "src/produit/produit.html"),
        produitAjout: resolve(__dirname, "src/produitAjout/produit-ajout.html"),
        connexion: resolve(__dirname, "src/inscription/inscription.html"),
        inscription: resolve(__dirname, "src/connexion/connexion.html"),
      },
    },
  },
});
