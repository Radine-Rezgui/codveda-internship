const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/users');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Routes
app.use('/users', userRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'API Niveau 2 - Task 3 opérationnelle !' });
});

module.exports = app;