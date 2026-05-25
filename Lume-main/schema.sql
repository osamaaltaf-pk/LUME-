-- LUME Database Schema for Supabase (PostgreSQL)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sequence for auto-generating order numbers
DROP SEQUENCE IF EXISTS order_number_seq CASCADE;
CREATE SEQUENCE order_number_seq START 1;

-- Clean slate: Drop legacy tables if they exist to prevent type conflicts
DROP TABLE IF EXISTS order_items, orders, customized_products, customizations, products, users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    otp TEXT,
    otp_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    category TEXT NOT NULL CHECK (category IN ('scented', 'unscented', 'decorative', 'aromatherapy')),
    scent TEXT DEFAULT 'unscented',
    size TEXT DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large', 'x-large')),
    burn_time TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0,
    images TEXT[] DEFAULT '{}'::TEXT[],
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for product category lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- 3. CUSTOMIZATIONS TABLE
CREATE TABLE IF NOT EXISTS customizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('color', 'scent', 'size', 'shape', 'base')),
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for customization type
CREATE INDEX IF NOT EXISTS idx_customizations_type ON customizations(type);
CREATE INDEX IF NOT EXISTS idx_customizations_value ON customizations(value);

-- Seed default customizations if table is empty
INSERT INTO customizations (type, name, value, price) VALUES
('base', 'Bespoke Custom Candle', 'base', 15.00),
('color', 'Warm Sand', '#E5D3B3', 0.00),
('color', 'Sage Green', '#9caf88', 0.00),
('color', 'Terracotta', '#C87A53', 0.00),
('color', 'Lavender Mist', '#c3b1e1', 0.00),
('scent', 'Tahitian Vanilla', 'vanilla', 3.00),
('scent', 'English Lavender', 'lavender', 3.00),
('scent', 'Santal & Cardamom', 'santal', 5.00),
('scent', 'Spiced Chai', 'chai', 4.00),
('size', 'Petite (4 oz)', 'small', 0.00),
('size', 'Atelier (8 oz)', 'medium', 5.00),
('size', 'Grand (12 oz)', 'large', 10.00),
('shape', 'Classic Cylinder', 'classic', 0.00),
('shape', 'Geometric Prism', 'geometric', 3.00),
('shape', 'Rose Ball', 'rose', 4.00),
('shape', 'Bubble Cube', 'bubble', 4.00)
ON CONFLICT DO NOTHING;

-- 4. CUSTOMIZED PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS customized_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    color TEXT NOT NULL,
    scent TEXT NOT NULL,
    size TEXT NOT NULL,
    shape TEXT NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL DEFAULT ('ORD-' || lpad(nextval('order_number_seq')::text, 4, '0')),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address JSONB NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'paypal', 'cod')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for order number lookups
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 1,
    is_custom BOOLEAN DEFAULT FALSE,
    color TEXT,
    scent TEXT,
    size TEXT,
    color_name TEXT,
    scent_name TEXT,
    size_name TEXT,
    shape TEXT,
    shape_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for order item referencing order
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
