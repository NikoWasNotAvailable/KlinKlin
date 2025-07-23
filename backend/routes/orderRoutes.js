const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getPool, JWT_SECRET } = require('../utils/db');

// Middleware to extract user from token
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// ========== GET Orders ==========
router.get('/', authenticateToken, async (req, res) => {
    const pool = getPool();
    const { status, user } = req.query;

    try {
        if (user === 'me') {
            // CUSTOMER VIEW
            const [orders] = await pool.query(
                `SELECT o.*, lp.name AS laundry_name
                 FROM orders o
                 JOIN laundry_places lp ON o.laundry_place_id = lp.id
                 WHERE o.customer_id = ?`,
                [req.user.userId]
            );
            return res.json(orders);
        }

        if (req.user.role === 'laundry_owner') {
            // OWNER VIEW: all ongoing orders
            const [orders] = await pool.query(
                `SELECT o.*, u.first_name AS customer_first_name, u.last_name AS customer_last_name, u.address AS customer_address
                 FROM orders o
                 JOIN users u ON o.customer_id = u.id
                 JOIN laundry_places lp ON o.laundry_place_id = lp.id
                 WHERE lp.owner_id = ? AND o.status IN ('driver_assigned', 'received', 'awaiting_payment', 'paid', 'pending')`,
                [req.user.userId]
            );
            return res.json(orders);
        }

        if (req.user.role === 'admin' && status) {
            // ADMIN VIEW
            const [orders] = await pool.query(
                `SELECT o.*, u.first_name AS customer_first_name, u.last_name AS customer_last_name, u.address AS customer_address
                 FROM orders o
                 JOIN users u ON o.customer_id = u.id
                 WHERE o.status = ?`,
                [status]
            );
            return res.json(orders);
        }

        res.status(403).json({ error: 'Unauthorized access' });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ========== PUT: Admin assigns driver ==========
router.put('/:id/assign-driver', authenticateToken, async (req, res) => {
    const pool = getPool();
    const orderId = req.params.id;

    try {
        const [result] = await pool.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['driver_assigned', orderId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Error assigning driver:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ========== PUT: Owner confirms order ==========
router.put('/:id/confirm', authenticateToken, async (req, res) => {
    const pool = getPool();
    const orderId = req.params.id;
    const { weight, total_price } = req.body;

    if (req.user.role !== 'laundry_owner') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE orders o
             JOIN laundry_places lp ON o.laundry_place_id = lp.id
             SET o.status = 'received', o.weight = ?, o.total_price = ?
             WHERE o.id = ? AND lp.owner_id = ?`,
            [weight, total_price, orderId, req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found or not owned by this owner' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error confirming order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
