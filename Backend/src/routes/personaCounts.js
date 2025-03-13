const express = require('express');
const router = express.Router();
const db = require('../models/persona'); // Assuming you have a db.js file to handle database connections

router.get('/persona-counts', async (req, res) => {
  try {
    const employees = await db.one('SELECT COUNT(*) FROM personas WHERE type = $1', ['Employees']);
    const vendors = await db.one('SELECT COUNT(*) FROM personas WHERE type = $1', ['Vendors']);
    const customers = await db.one('SELECT COUNT(*) FROM personas WHERE type = $1', ['Customers']);
    const investors = await db.one('SELECT COUNT(*) FROM personas WHERE type = $1', ['Investors']);

    res.status(200).json({
      employees: employees.count,
      vendors: vendors.count,
      customers: customers.count,
      investors: investors.count,
    });
  } catch (error) {
    console.error('Error fetching persona counts:', error);
    res.status(500).json({ message: 'Error fetching persona counts', error: error.message });
  }
});

module.exports = router;