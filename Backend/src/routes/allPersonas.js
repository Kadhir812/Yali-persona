const express = require('express');
const router = express.Router();
const db = require('../models/persona'); // Assuming you have a db.js file to handle database connections

router.get('/personas', async (req, res) => {
  try {
    const personas = await db.any('SELECT * FROM personas');
    res.status(200).json(personas);
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(500).json({ message: 'Error fetching personas', error: error.message });
  }
});

module.exports = router;