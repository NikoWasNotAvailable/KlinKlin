const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getPool, JWT_SECRET } = require('../utils/db');

// ===== Middleware to authenticate token =====
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

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
        l.image,
        u.id AS owner_id,
        u.username AS owner_username,
        u.first_name,
        u.last_name
      FROM laundry_places l
      JOIN users u ON l.owner_id = u.id
    `);

    // Convert image buffer to base64
    const formatted = laundries.map(l => ({
      ...l,
      image: l.image ? l.image.toString('base64') : null
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching laundries:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== GET: Logged-in owner's laundry =====
router.get('/my-laundry', authenticateToken, async (req, res) => {
  const pool = getPool();

  if (req.user.role !== 'laundry_owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const [laundryRows] = await pool.query(
      `SELECT * FROM laundry_places WHERE owner_id = ? LIMIT 1`,
      [req.user.userId]
    );

    if (!laundryRows.length) {
      return res.json(null);
    }

    const laundry = laundryRows[0];

    // Convert image to base64
    laundry.image = laundry.image ? laundry.image.toString('base64') : null;

    // Fetch services
    const [services] = await pool.query(
      `SELECT * FROM services WHERE laundry_place_id = ?`,
      [laundry.id]
    );
    laundry.services = services;

    res.json(laundry);
  } catch (err) {
    console.error('Error fetching owner laundry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== POST: Create or update owner's laundry + services =====
router.post('/my-laundry', authenticateToken, async (req, res) => {
  const pool = getPool();

  if (req.user.role !== 'laundry_owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  let { name, description, address, latitude, longitude, services, image } = req.body;

  if (!Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ error: 'Services are required' });
  }

  // Convert base64 to buffer if present
  let imageBuffer = null;
  if (image) {
    try {
      imageBuffer = Buffer.from(image, 'base64');
    } catch {
      return res.status(400).json({ error: 'Invalid image format' });
    }
  }

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    let laundryId;

    // Check if laundry already exists
    const [existing] = await conn.query(
      `SELECT id FROM laundry_places WHERE owner_id = ?`,
      [req.user.userId]
    );

    if (existing.length > 0) {
      // Update laundry
      laundryId = existing[0].id;
      await conn.query(
        `UPDATE laundry_places 
         SET name = ?, description = ?, address = ?, latitude = ?, longitude = ?, image = ?
         WHERE owner_id = ?`,
        [name, description, address, latitude, longitude, imageBuffer, req.user.userId]
      );

      // Remove related order_items first
      await conn.query(`
        DELETE oi
        FROM order_items oi
        JOIN services s ON oi.service_id = s.id
        WHERE s.laundry_place_id = ?
      `, [laundryId]);

      // Then remove old services
      await conn.query(`DELETE FROM services WHERE laundry_place_id = ?`, [laundryId]);
    } else {
      // Insert new laundry
      const [result] = await conn.query(
        `INSERT INTO laundry_places (name, description, owner_id, address, latitude, longitude, rating, image)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
        [name, description, req.user.userId, address, latitude, longitude, imageBuffer]
      );
      laundryId = result.insertId;
    }

    // Insert services (force price to number)
    for (const svc of services) {
      const priceNum = Number(svc.price);
      if (!svc.type || !svc.name || isNaN(priceNum)) {
        throw new Error('Invalid service data');
      }
      await conn.query(
        `INSERT INTO services (laundry_place_id, type, name, price)
         VALUES (?, ?, ?, ?)`,
        [laundryId, svc.type, svc.name, priceNum]
      );
    }

    await conn.commit();
    res.json({ message: 'Laundry and services saved successfully' });

  } catch (err) {
    await conn.rollback();
    console.error('Error saving laundry:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
});

// ===== GET: One laundry by ID =====
router.get('/:id', async (req, res) => {
  const pool = getPool();
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT l.*, u.username AS owner_username 
       FROM laundry_places l
       JOIN users u ON l.owner_id = u.id
       WHERE l.id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Laundry not found' });
    }

    const laundry = rows[0];
    laundry.image = laundry.image ? laundry.image.toString('base64') : null;

    res.json(laundry);
  } catch (err) {
    console.error('Error fetching laundry by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
