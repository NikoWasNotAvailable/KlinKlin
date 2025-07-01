const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const router = express.Router();

const JWT_SECRET = 'your_secret_key'; // use env var in production

// STEP 1: Connect to MySQL server (no database yet)
async function createDatabaseIfNotExists() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'klinklin123', // change if needed
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS klinklin`);
    await connection.end();
}

// STEP 2: Connect to the klinklin database
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
      password VARCHAR(255) NOT NULL
    )
  `);

    const [users] = await pool.query(`SELECT * FROM users WHERE username = ?`, ['admin']);
    if (users.length === 0) {
        // Store raw password (UNSAFE - for development only)
        await pool.query(`INSERT INTO users (username, password) VALUES (?, ?)`, ['admin', 'password123']);
        console.log('✅ Sample user "admin" created (password: password123)');
    }
}

// Init everything once at module load
initPoolAndTables().catch(console.error);

// REGISTER
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) return res.status(400).json({ message: 'Username already exists' });

        // Store raw password directly (UNSAFE)
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

// LOGOUT
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout success (handled on client)' });
});

module.exports = router;
