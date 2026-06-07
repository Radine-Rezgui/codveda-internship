const express = require('express');
const app = express();
const PORT = 3000;

// Middleware pour lire le JSON
app.use(express.json());

// Base de données temporaire (tableau)
let users = [
  { id: 1, nom: "Radine", email: "radine@gmail.com" },
  { id: 2, nom: "Ahmed", email: "ahmed@gmail.com" }
];

// GET - Récupérer tous les utilisateurs
app.get('/users', (req, res) => {
  res.json(users);
});

// GET - Récupérer un utilisateur par ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json(user);
});

// POST - Ajouter un utilisateur
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    nom: req.body.nom,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT - Modifier un utilisateur
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  user.nom = req.body.nom || user.nom;
  user.email = req.body.email || user.email;
  res.json(user);
});

// DELETE - Supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.json({ message: "Utilisateur supprimé" });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});