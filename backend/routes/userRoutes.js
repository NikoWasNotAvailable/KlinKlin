const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getPool, JWT_SECRET } = require('../utils/db');

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const pool = getPool();
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(400).json({ message: 'Username already exists' });

    await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const pool = getPool();
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0 || password !== rows[0].password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: rows[0].id, username: rows[0].username, role: rows[0].role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET PROFILE
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT username, first_name, last_name, phone, address, dob, email, instagram, twitter, facebook, role
       FROM users WHERE id = ?`, [decoded.userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

module.exports = router;
