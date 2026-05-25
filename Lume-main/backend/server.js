import express from 'express';
import { supabase } from './config/supabase.js';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productsRoutes.js'
import verifyAccessToken from './middlewares/authMiddleware.js'
import path from 'path'
import customizationRoutes from './routes/customizationRoutes.js';
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'; // ADD THIS

const app = express()
app.use('/uploads', express.static('uploads'));

// 1. Permissive CORS (Public API) - MUST BE FIRST so all requests (and error responses) carry CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Debug log
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'unknown'}`);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 2. Verify Supabase config on request (Lightweight Vercel check)
app.use((req, res, next) => {
  const hasUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!hasUrl || !hasKey) {
    console.error('Database configuration is incomplete: missing Supabase credentials.');
    return res.status(500).json({ message: 'Database configuration failed' });
  }
  next();
});



app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));



app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/debug/orders-test', verifyAccessToken, (req, res) => {
  res.json({
    message: 'Orders API is working',
    user: req.user
  });
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customizations', customizationRoutes);
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
import fs from 'fs';
const uploadsDir = path.join(process.cwd(), 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  console.log('Skipping uploads dir creation (read-only fs)');
}

app.get('/api/debug/test-auth', verifyAccessToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

const PORT = process.env.PORT || 5000;

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  console.log('Deployment Check: Wildcard CORS Mode Active'); // Verify deployment

  // Ensure CORS headers are sent even on error
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log("Server is running successfully at PORT: ", PORT);
  });
}

export default app;