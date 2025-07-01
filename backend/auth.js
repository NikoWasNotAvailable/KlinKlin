const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const router = express.Router();

const JWT_SECRET = 'your_secret_key'; // use env var in production

// STEP 1: Create DB if not exist
async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'klinklin123',
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS klinklin`);
  await connection.end();
}

let pool;
async function initPoolAndTables() {
  await createDatabaseIfNotExists();

  pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'klinklin123',
    database: 'klinklin',
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      phone VARCHAR(20),
      address TEXT,
      dob DATE,
      email VARCHAR(255),
      instagram VARCHAR(255),
      twitter VARCHAR(255),
      facebook VARCHAR(255)
    )
  `);

  const [users] = await pool.query(`SELECT * FROM users WHERE username = ?`, ['admin']);
  if (users.length === 0) {
    await pool.query(`
      INSERT INTO users (
        username, password, first_name, last_name, phone, address, dob, email, instagram, twitter, facebook
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'admin',
      'password123',
      'Jim',
      'Jauharyy',
      '(+62) 81387263269',
      'Kebon Jeruk, West Jakarta',
      '1999-10-06',
      'jimmyjau@gmail.com',
      '@jimmyjau',
      '@jimmyjau',
      '@jimyyjauu'
    ]);
    console.log('✅ Sample user "admin" created (password: password123)');
  }
}

initPoolAndTables().catch(console.error);

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(400).json({ message: 'Username already exists' });

    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid username or password' });

    if (password !== rows[0].password)
      return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ userId: rows[0].id, username: rows[0].username }, JWT_SECRET, { expiresIn: '1h' });
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
    const [rows] = await pool.query(
      `SELECT username, first_name, last_name, phone, address, dob, email, instagram, twitter, facebook
       FROM users WHERE id = ?`, [decoded.userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

// LOGOUT (handled by frontend)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout success (handled on client)' });
});

module.exports = router;
