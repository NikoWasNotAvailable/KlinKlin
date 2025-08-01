const express = require('express');
const router = express.Router();
const { getPool } = require('../utils/db');

// ===== GET: All laundry places with owner info =====
router.get('/', async (req, res) => {
  const pool = getPool();

  try {
    const [laundries] = await pool.query(`
            SELECT 
                l.id,
                l.name,
                l.description,
                l.rating,
                l.address,
                l.latitude,
                l.longitude,
                u.id AS owner_id,
                u.username AS owner_username,
                u.first_name,
                u.last_name
            FROM laundry_places l
            JOIN users u ON l.owner_id = u.id
        `);

    res.json(laundries);
  } catch (err) {
    console.error('Error fetching laundries:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET: Get one laundry by ID
router.get('/:id', async (req, res) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
         l.*, 
         u.username AS owner_username 
       FROM laundry_places l
       JOIN users u ON l.owner_id = u.id
       WHERE l.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Laundry not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching laundry by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
