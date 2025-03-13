const express = require('express');
const Persona = require('../models/persona');

const router = express.Router();

// Create a new persona
router.post('/', async (req, res) => {
  try {
    console.log('Creating a new persona with data:', req.body);
    const persona = await Persona.create(req.body);
    res.status(201).json(persona);
  } catch (error) {
    console.error('Error creating persona:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all personas
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all personas');
    const personas = await Persona.findAll();
    res.status(200).json(personas);
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const employees = await Persona.count({ where: { type: 'Employees' } });
    const vendors = await Persona.count({ where: { type: 'Vendors' } });
    const customers = await Persona.count({ where: { type: 'Customers' } });
    const investors = await Persona.count({ where: { type: 'Investors' } });

    res.status(200).json({ employees, vendors, customers, investors });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get a persona by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching persona with ID: ${req.params.id}`);
    const persona = await Persona.findByPk(req.params.id);
    if (persona) {
      res.status(200).json(persona);
    } else {
      res.status(404).json({ error: 'Persona not found' });
    }
  } catch (error) {
    console.error('Error fetching persona:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update a persona
router.put('/:id', async (req, res) => {
  try {
    console.log(`Updating persona with ID: ${req.params.id} with data:`, req.body);
    const [updated] = await Persona.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedPersona = await Persona.findByPk(req.params.id);
      res.status(200).json(updatedPersona);
    } else {
      res.status(404).json({ error: 'Persona not found' });
    }
  } catch (error) {
    console.error('Error updating persona:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a persona
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Deleting persona with ID: ${req.params.id}`);
    const deleted = await Persona.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Persona not found' });
    }
  } catch (error) {
    console.error('Error deleting persona:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;