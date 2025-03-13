const express = require('express');
const router = express.Router();
const { createPersona } = require('../models/persona');

router.post('/', async (req, res) => {
  try {
    const personaData = req.body;
    const result = await createPersona(personaData);
    res.status(200).json({ message: 'Persona added successfully', data: result });
  } catch (error) {
    console.error('Error adding persona:', error);
    res.status(500).json({ message: 'Error adding persona', error: error.message });
  }
});

module.exports = router;