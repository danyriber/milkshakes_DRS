-- Base de datos para Milkshakes DRS - Arquitectura de Microservicios
-- Versión: PostgreSQL

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS milkshakes_drs;
\c milkshakes_drs;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(50),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de carritos
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items del carrito
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    shipping_address TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items de pedidos
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo para productos
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('Milkshake de Fresa', 'Delicioso milkshake de fresa fresca con nata montada', 4.50, '/fresa.png', 'Frutal', 20),
('Milkshake de Chocolate', 'Intenso milkshake de chocolate belga con chispas', 4.75, '/chocolate.png', 'Chocolate', 15),
('Milkshake de Vainilla', 'Clásico milkshake de vainilla con caramelo', 4.25, '/vainilla.png', 'Clásico', 18),
('Milkshake de Mango', 'Exótico milkshake de mango tropical', 4.90, '/mango.png', 'Frutal', 12),
('Milkshake de Oreo', 'Irresistible milkshake con galletas Oreo trituradas', 5.25, '/oreo.png', 'Galleta', 10),
('Milkshake de Pistacho', 'Premium milkshake de pistacho italiano', 5.50, '/pistacho.png', 'Premium', 8),
('Milkshake de Plátano', 'Energizante milkshake de plátano con miel', 4.60, '/platano.png', 'Frutal', 14),
('Milkshake de Avellana', 'Cremoso milkshake de avellana con nueces', 5.00, '/avellana.png', 'Frutos Secos', 11)
ON CONFLICT (name) DO NOTHING;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);