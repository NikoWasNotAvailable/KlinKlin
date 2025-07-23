const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');

router.get('/', async (req, res) => {
  try {
    const [laundries] = await pool.query(`
      SELECT l.*, u.username AS owner_username 
      FROM laundry_places l JOIN users u ON l.owner_id = u.id
    `);
    res.json(laundries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const {
    name, description, rating, owner_id, location,
    latitude, longitude,
    price_cuci_reguler, price_dry_cleaning, price_setrika,
    price_jas, price_selimut
  } = req.body;

  try {
    await pool.query(`
      INSERT INTO laundry_places (
        name, description, rating, owner_id, location, latitude, longitude,
        price_cuci_reguler, price_dry_cleaning, price_setrika,
        price_jas, price_selimut
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, description, rating, owner_id, location, latitude, longitude, price_cuci_reguler, price_dry_cleaning, price_setrika, price_jas, price_selimut]);

    res.status(201).json({ message: 'Laundry place added' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;