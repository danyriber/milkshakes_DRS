const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

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

// Función para validar producto
async function validateProduct(productId) {
  try {
    const response = await axios.get(`http://product-service:3001/api/products/${productId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

// Rutas
app.get('/api/cart/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const cartResult = await pool.query('SELECT * FROM carts WHERE session_id = $1', [sessionId]);
    if (cartResult.rows.length === 0) {
      return res.json({ items: [], total: 0 });
    }
    const cartId = cartResult.rows[0].id;
    const itemsResult = await pool.query(`
      SELECT ci.*, p.name, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cartId]);
    const total = itemsResult.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({ items: itemsResult.rows, total });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart/:sessionId/items', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productId, quantity } = req.body;

    // Validar producto
    const product = await validateProduct(productId);
    if (!product) {
      return res.status(400).json({ error: 'Invalid product' });
    }

    // Obtener o crear carrito
    let cartResult = await pool.query('SELECT * FROM carts WHERE session_id = $1', [sessionId]);
    let cartId;
    if (cartResult.rows.length === 0) {
      cartResult = await pool.query('INSERT INTO carts (session_id) VALUES ($1) RETURNING id', [sessionId]);
      cartId = cartResult.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Verificar si el item ya existe
    const existingItem = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId, productId]);
    if (existingItem.rows.length > 0) {
      await pool.query('UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2', [quantity, existingItem.rows[0].id]);
    } else {
      await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', [cartId, productId, quantity, product.price]);
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/cart/:sessionId/items/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    const { quantity } = req.body;

    const result = await pool.query(`
      UPDATE cart_items
      SET quantity = $1
      FROM carts
      WHERE cart_items.id = $2 AND carts.session_id = $3 AND cart_items.cart_id = carts.id
      RETURNING cart_items.*
    `, [quantity, itemId, sessionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/cart/:sessionId/items/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;

    const result = await pool.query(`
      DELETE FROM cart_items
      USING carts
      WHERE cart_items.id = $1 AND carts.session_id = $2 AND cart_items.cart_id = carts.id
      RETURNING cart_items.*
    `, [itemId, sessionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'cart-service' });
});

app.listen(port, () => {
  console.log(`Cart service listening on port ${port}`);
});