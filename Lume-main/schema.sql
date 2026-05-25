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

-- Seed default Lume Administrative User for system-level actions and product seeding
-- Email: admin@lume.com | Password: lumeadmin123
INSERT INTO users (id, username, email, password, role, is_verified) VALUES
('00000000-0000-0000-0000-000000000000', 'Lume Artisan', 'admin@lume.com', '$2a$10$r.7XzF6j/qZ0O5l2Y4V5uO3iR9uYn7xK7w5l8M3r5L7X4U5oQ4kY2', 'admin', true)
ON CONFLICT (email) DO NOTHING;

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

-- Seed Premium, High-End Handcrafted Artisan Candles
INSERT INTO products (id, name, description, price, category, scent, size, burn_time, in_stock, stock_quantity, images, created_by) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Santal & Wild Cardamom No. 04',
  'An evocative blend of smooth Australian sandalwood, warm crushed cardamom, and rich dark amber, hand-poured in a custom textured ceramic vessel. Designed to fill your space with a sophisticated, woody warmth.',
  32.00,
  'scented',
  'Santal & Cardamom',
  'medium',
  '50 Hours',
  true,
  45,
  ARRAY['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'],
  '00000000-0000-0000-0000-000000000000'
),
(
  '22222222-2222-2222-2222-222222222222',
  'French Lavender & Wild Thyme No. 07',
  'Restore your inner equilibrium. Infused with pure organic French lavender essential oil, wild-harvested thyme, and a base of grounding Himalayan cedarwood to promote deep restfulness and meditative peace.',
  28.00,
  'aromatherapy',
  'English Lavender',
  'medium',
  '45 Hours',
  true,
  30,
  ARRAY['https://images.unsplash.com/photo-1596435764223-41e974e15edd?auto=format&fit=crop&w=600&q=80'],
  '00000000-0000-0000-0000-000000000000'
),
(
  '33333333-3333-3333-3333-333333333333',
  'The Sculptural Bubble Grid Candle',
  'An architectural statement piece for the modern minimalist home. Hand-cast from clean, soot-free organic soy wax in an elegant geometric bubble matrix. Adds instant editorial texture to mantels and coffee tables.',
  24.00,
  'decorative',
  'unscented',
  'small',
  '25 Hours',
  true,
  60,
  ARRAY['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'],
  '00000000-0000-0000-0000-000000000000'
),
(
  '44444444-4444-4444-4444-444444444444',
  'Tahitian Vanilla Bean & Amberwood',
  'A rich, decadent gourmand escape. Authentic Tahitian vanilla pods combined with warm amber resin, ground cinnamon bark, and fresh grated ginger. Creates a sweet, comforting, and deeply enveloping ambiance.',
  34.00,
  'scented',
  'Tahitian Vanilla',
  'large',
  '65 Hours',
  true,
  25,
  ARRAY['https://images.unsplash.com/photo-1572726729207-a78d6eed36d7?auto=format&fit=crop&w=600&q=80'],
  '00000000-0000-0000-0000-000000000000'
),
(
  '55555555-5555-5555-5555-555555555555',
  'The Geometric Prism Candle',
  'A decorative masterstroke combining fine art and slow-burning soy wax. Features sharp geometric angles that catch the light beautifully, hand-poured in a neutral Warm Sand hue. Entirely unscented for pure visual aesthetics.',
  26.00,
  'decorative',
  'unscented',
  'medium',
  '35 Hours',
  true,
  50,
  ARRAY['https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'],
  '00000000-0000-0000-0000-000000000000'
),
(
  '66666666-6666-6666-6666-666666666666',
  'Eucalyptus & Moroccan Mint Refresh',
  'Invigorate and clarify your senses. A powerful, herbal combination of organic Moroccan mint leaves and crushed blue-gum eucalyptus branches. Perfect for clean mornings, bath-side luxury, and mental rejuvenation.',
  30.00,
  'aromatherapy',
  'Moroccan Mint',
  'medium',
  '48 Hours',
  true,
  40,
  ARRAY['https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80'],
  '00000000-0000-0000-0000-000000000000'
)
ON CONFLICT (id) DO NOTHING;

