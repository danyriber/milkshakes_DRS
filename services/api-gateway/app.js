const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());

// Proxy routes
app.use('/api/products', createProxyMiddleware({
  target: 'http://product-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/products': '/api/products' }
}));

app.use('/api/cart', createProxyMiddleware({
  target: 'http://cart-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/cart': '/api/cart' }
}));

app.use('/api/auth', createProxyMiddleware({
  target: 'http://user-service:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' }
}));

app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' }
}));

app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3004',
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '/api/orders' }
}));

// CMS Proxy (apunta a Vercel deployment)
app.use('/api/cms', createProxyMiddleware({
  target: process.env.CMS_URL || 'http://cms-service:1337',
  changeOrigin: true,
  pathRewrite: { '^/api/cms': '/api' },
  onError: (err, req, res) => {
    console.error('CMS Proxy Error:', err);
    res.status(503).json({ error: 'CMS service unavailable' });
  }
}));

// CMS Content Routes
const cmsIntegration = require('./cms-integration');

// Obtener productos desde CMS
app.get('/api/content/products', async (req, res) => {
  try {
    const products = await cmsIntegration.getProducts(req.query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products from CMS' });
  }
});

// Obtener categorías desde CMS
app.get('/api/content/categories', async (req, res) => {
  try {
    const categories = await cmsIntegration.getCategories(req.query);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories from CMS' });
  }
});

// Obtener páginas desde CMS
app.get('/api/content/pages', async (req, res) => {
  try {
    const pages = await cmsIntegration.getPages(req.query);
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages from CMS' });
  }
});

// Obtener página específica por slug
app.get('/api/content/pages/:slug', async (req, res) => {
  try {
    const page = await cmsIntegration.getContentById('pages', req.params.slug);
    res.json(page);
  } catch (error) {
    res.status(404).json({ error: 'Page not found' });
  }
});

// Obtener posts del blog
app.get('/api/content/blog', async (req, res) => {
  try {
    const posts = await cmsIntegration.getBlogPosts(req.query);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts from CMS' });
  }
});

// Buscar contenido en el CMS
app.get('/api/content/search', async (req, res) => {
  try {
    const { q, types } = req.query;
    const contentTypes = types ? types.split(',') : [];
    const results = await cmsIntegration.search(q, contentTypes);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Health check del CMS
app.get('/api/cms/health', async (req, res) => {
  try {
    const health = await cmsIntegration.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(503).json({ error: 'CMS health check failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'api-gateway' });
});

// Ruta para verificar todos los servicios
app.get('/api/health', async (req, res) => {
  // Aquí se podría verificar la salud de todos los servicios
  res.json({ status: 'OK', gateway: 'api-gateway' });
});

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});