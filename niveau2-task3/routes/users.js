const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET - Tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Un utilisateur par ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Ajouter un utilisateur
router.post('/', async (req, res) => {
  try {
    const { nom, email, role } = req.body;
    const user = new User({ nom, email, role });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }
    res.status(400).json({ message: err.message });
  }
});

// PUT - Modifier un utilisateur
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;