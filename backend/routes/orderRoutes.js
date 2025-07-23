const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getPool, JWT_SECRET } = require('../utils/db');

// GET /api/orders?status=pending
router.get('/', async (req, res) => {
    const pool = getPool();
    const status = req.query.status || 'pending';

    try {
        const [orders] = await pool.query(
            `SELECT o.*, u.first_name AS customer_first_name, u.last_name AS customer_last_name, u.address AS customer_address
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       WHERE o.status = ?`,
            [status]
        );
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/orders/:id/assign-driver
router.put('/:id/assign-driver', async (req, res) => {
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

module.exports = router;
