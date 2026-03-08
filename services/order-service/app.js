const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Configuración de base de datos
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'milkshakes_drs',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password123',
});

// Rutas
app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { userId, sessionId, shippingAddress, paymentMethod } = req.body;

    // Obtener items del carrito
    const cartResult = await client.query('SELECT * FROM carts WHERE session_id = $1', [sessionId]);
    if (cartResult.rows.length === 0) {
      return res.status(400).json({ error: 'Cart not found' });
    }
    const cartId = cartResult.rows[0].id;
    const itemsResult = await client.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
    if (itemsResult.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calcular total
    const total = itemsResult.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Crear pedido
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, total, shippingAddress, paymentMethod]
    );
    const orderId = orderResult.rows[0].id;

    // Crear items del pedido
    for (const item of itemsResult.rows) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Limpiar carrito
    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    await client.query('DELETE FROM carts WHERE id = $1', [cartId]);

    await client.query('COMMIT');
    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT o.*, json_agg(oi.*) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/:userId/:orderId', async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const result = await pool.query(`
      SELECT o.*, json_agg(oi.*) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1 AND o.user_id = $2
      GROUP BY o.id
    `, [orderId, userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'order-service' });
});

app.listen(port, () => {
  console.log(`Order service listening on port ${port}`);
});