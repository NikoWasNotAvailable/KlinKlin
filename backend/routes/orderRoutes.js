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

// ===== GET: All or filtered orders =====
router.get('/', authenticateToken, async (req, res) => {
    const pool = getPool();
    const { status, user } = req.query;

    try {
        if (user === 'me') {
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
            const [orders] = await pool.query(
                `SELECT o.*, u.first_name AS customer_first_name, u.last_name AS customer_last_name, u.address AS customer_address
                 FROM orders o
                 JOIN users u ON o.customer_id = u.id
                 JOIN laundry_places lp ON o.laundry_place_id = lp.id
                 WHERE lp.owner_id = ? AND o.status IN ('pending', 'driver_assigned', 'received', 'awaiting_payment', 'paid')`,
                [req.user.userId]
            );
            return res.json(orders);
        }

        if (req.user.role === 'admin' && status) {
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

// ===== GET: Single order by ID =====
router.get('/:id', authenticateToken, async (req, res) => {
    const pool = getPool();
    const orderId = req.params.id;

    try {
        const [orders] = await pool.query(
            `SELECT o.*, u.first_name, u.last_name, lp.name AS laundry_name
             FROM orders o
             JOIN users u ON o.customer_id = u.id
             JOIN laundry_places lp ON o.laundry_place_id = lp.id
             WHERE o.id = ?`,
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orders[0];

        // Fetch service details
        const [items] = await pool.query(
            `SELECT oi.quantity, s.name, s.price
             FROM order_items oi
             JOIN services s ON oi.service_id = s.id
             WHERE oi.order_id = ?`,
            [orderId]
        );

        order.items = items;

        res.json(order);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// ===== PUT: Admin assigns driver =====
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
        res.json({ success: true, message: 'Driver assigned' });
    } catch (err) {
        console.error('Error assigning driver:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== PUT: Owner confirms order =====
router.put('/:id/confirm', authenticateToken, async (req, res) => {
    const pool = getPool();
    const orderId = req.params.id;

    if (req.user.role !== 'laundry_owner') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        // Get order first to check its type and ownership
        const [rows] = await pool.query(
            `SELECT o.type, lp.owner_id
             FROM orders o
             JOIN laundry_places lp ON o.laundry_place_id = lp.id
             WHERE o.id = ?`,
            [orderId]
        );

        if (rows.length === 0 || rows[0].owner_id !== req.user.userId) {
            return res.status(404).json({ error: 'Order not found or not owned by this owner' });
        }

        const orderType = rows[0].type;

        if (orderType === 'satuan') {
            // Just update status to received
            await pool.query(
                `UPDATE orders SET status = 'received' WHERE id = ?`,
                [orderId]
            );
            return res.json({ success: true, message: 'Satuan order confirmed' });
        } else {
            // Require weight and total_price
            const { weight, total_price } = req.body;
            if (!weight || !total_price) {
                return res.status(400).json({ error: 'Missing weight or price for kiloan order' });
            }

            await pool.query(
                `UPDATE orders o
                 JOIN laundry_places lp ON o.laundry_place_id = lp.id
                 SET o.status = 'received', o.total_weight = ?, o.total_price = ?
                 WHERE o.id = ? AND lp.owner_id = ?`,
                [weight, total_price, orderId, req.user.userId]
            );
            return res.json({ success: true, message: 'Kiloan order confirmed' });
        }
    } catch (err) {
        console.error('Error confirming order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// ===== PUT: Customer pays for order =====
router.put('/:id/pay', authenticateToken, async (req, res) => {
    const pool = getPool();
    const orderId = req.params.id;

    if (req.user.role !== 'customer') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE orders
             SET status = 'paid'
             WHERE id = ? AND customer_id = ? AND status = 'received'`,
            [orderId, req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Invalid order or already paid' });
        }

        res.json({ success: true, message: 'Order paid successfully' });
    } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== DELETE: Cancel or delete order =====
router.delete('/:id', authenticateToken, async (req, res) => {
    const pool = getPool();
    const orderId = req.params.id;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const [result] = await pool.query(
            `DELETE FROM orders WHERE id = ?`,
            [orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ success: true, message: 'Order deleted' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== POST: Create new order =====
router.post('/', authenticateToken, async (req, res) => {
    const pool = getPool();
    const { laundry_place_id, type, pickup_datetime, service_id, items } = req.body;
    const customer_id = req.user.userId;

    if (!pickup_datetime || !laundry_place_id || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const formattedPickup = formatToMySQLDatetime(pickup_datetime);

        // Insert order first with total_price = 0 temporarily
        const [orderResult] = await pool.query(
            `INSERT INTO orders (customer_id, laundry_place_id, type, pickup_datetime, total_price)
             VALUES (?, ?, ?, ?, ?)`,
            [customer_id, laundry_place_id, type, formattedPickup, 0]
        );

        const orderId = orderResult.insertId;
        let totalPrice = 0;

        if (type === 'kiloan') {
            // Service_id is already provided from frontend
            const [rows] = await pool.query(`SELECT price FROM services WHERE id = ?`, [service_id]);
            if (!rows.length) {
                return res.status(400).json({ error: 'Service not found' });
            }
            const price = rows[0].price;

            await pool.query(
                `INSERT INTO order_items (order_id, service_id, quantity) VALUES (?, ?, ?)`,
                [orderId, service_id, 1]
            );
        } else if (type === 'satuan' && Array.isArray(items)) {
            for (const item of items) {
                const [rows] = await pool.query(
                    `SELECT price FROM services WHERE id = ? AND laundry_place_id = ? AND type = 'satuan'`,
                    [item.service_id, laundry_place_id]
                );
                if (rows.length > 0) {
                    const price = rows[0].price;
                    const subTotal = price * item.quantity;
                    totalPrice += subTotal;

                    await pool.query(
                        `INSERT INTO order_items (order_id, service_id, quantity) VALUES (?, ?, ?)`,
                        [orderId, item.service_id, item.quantity]
                    );
                }
            }
        }

        // Update total_price after inserting items
        await pool.query(`UPDATE orders SET total_price = ? WHERE id = ?`, [totalPrice, orderId]);

        return res.status(201).json({ success: true, order_id: orderId });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


function formatToMySQLDatetime(isoString) {
    const date = new Date(isoString);
    const pad = (n) => (n < 10 ? '0' + n : n);

    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}


module.exports = router;
