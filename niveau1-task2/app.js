const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const DB_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

// ── Helpers lecture / écriture ────────────────────────────────
function readUsers() {
  if (!fs.existsSync(DB_FILE)) {
    // Créer le fichier avec des données initiales s'il n'existe pas
    const initial = [
      { id: 1, nom: "Radine", email: "radine@gmail.com" },
      { id: 2, nom: "Ahmed",  email: "ahmed@gmail.com"  }
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

function nextId(users) {
  return users.length === 0 ? 1 : Math.max(...users.map(u => u.id)) + 1;
}

// ── Routes CRUD ───────────────────────────────────────────────

// GET - Tous les utilisateurs
app.get('/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});

// GET - Un utilisateur par ID
app.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json(user);
});

// POST - Ajouter un utilisateur
app.post('/users', (req, res) => {
  const { nom, email } = req.body;
  if (!nom || !email) {
    return res.status(400).json({ message: "Nom et email sont requis" });
  }
  const users = readUsers();
  const newUser = { id: nextId(users), nom, email };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

// PUT - Modifier un utilisateur
app.put('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  user.nom   = req.body.nom   || user.nom;
  user.email = req.body.email || user.email;
  writeUsers(users);
  res.json(user);
});

// DELETE - Supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
  let users = readUsers();
  const exists = users.find(u => u.id === parseInt(req.params.id));
  if (!exists) return res.status(404).json({ message: "Utilisateur non trouvé" });
  users = users.filter(u => u.id !== parseInt(req.params.id));
  writeUsers(users);
  res.json({ message: "Utilisateur supprimé" });
});

// Servir le frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;