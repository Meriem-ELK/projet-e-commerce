// Importation du framework Express
import express from "express";

// Importation des routes spécifiques aux produits et aux utilisateurs
import produitRoutes from "./products.routes.js";
import usersRoutes from "./users.routes.js";

// Création d'un routeur Express
const router = express.Router();


// // Middleware de validation
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};


//test pour verifier que le serveur fonctionne
router.get("/", (req, res) => {
  res.end("Test le serveur fonctionne !");
});

//Utilisation des routes définies
router.use("/products", produitRoutes);
router.use("/users", usersRoutes);

export default router;
