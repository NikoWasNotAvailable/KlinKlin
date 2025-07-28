const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getPool, JWT_SECRET } = require('../utils/db');

// ===== Middleware to authenticate token =====
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// GET: Services by laundry_place_id
router.get('/', authenticateToken, async (req, res) => {
    const { laundry_place_id } = req.query;
    if (!laundry_place_id) return res.status(400).json({ error: 'Missing laundry_place_id' });

    try {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM services WHERE laundry_place_id = ?',
            [laundry_place_id]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching services:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
