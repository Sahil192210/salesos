const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initCron, runAbandonedCartRecovery } = require('./cron');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const tallyRoutes = require('./routes/tally');
const whatsappRoutes = require('./routes/whatsapp');
const paymentRoutes = require('./routes/payment');
const auditRoutes = require('./routes/audit');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tally', tallyRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/audit', auditRoutes);

// Endpoint for manual testing of cron recovery
app.post('/api/cron/trigger-recovery', async (req, res) => {
  await runAbandonedCartRecovery();
  res.json({ message: 'Abandoned cart recovery triggered manually.' });
});

// Root / Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

async function seedInitialData() {
  try {
    const Company = require('./models/Company');
    const Product = require('./models/Product');
    const Order = require('./models/Order');
    const AbandonedCart = require('./models/AbandonedCart');
    const TallySync = require('./models/TallySync');
    const bcrypt = require('bcryptjs');

    const count = await Company.countDocuments();
    if (count === 0) {
      console.log('[Bootstrap] Seeding initial D2C tenant store & demo data...');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);

      const company = await Company.create({
        name: 'Acme D2C Lifestyle',
        subdomain: 'acme',
        ownerEmail: 'owner@acme.com',
        passwordHash: passwordHash
      });

      const p1 = await Product.create({
        companyId: company._id,
        title: 'Premium Organic Arabica Coffee 500g',
        sku: 'COF-ARA-001',
        price: 799,
        gstPercent: 18,
        stock: 145,
        images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60'],
        tallyItemId: 'TALLY-COF-01',
        status: 'active'
      });

      const p2 = await Product.create({
        companyId: company._id,
        title: 'Wireless Active Noise Cancelling Earbuds',
        sku: 'EAR-ANC-002',
        price: 2499,
        gstPercent: 18,
        stock: 62,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60'],
        tallyItemId: 'TALLY-EAR-02',
        status: 'active'
      });

      const p3 = await Product.create({
        companyId: company._id,
        title: 'Matte Stainless Steel Hydration Bottle 1L',
        sku: 'BOT-STE-003',
        price: 899,
        gstPercent: 12,
        stock: 210,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60'],
        tallyItemId: 'TALLY-BOT-03',
        status: 'active'
      });

      await Order.create([
        {
          companyId: company._id,
          customerName: 'Rahul Verma',
          phone: '9876543210',
          items: [{ productId: p1._id, qty: 2, price: 799 }],
          total: 1885.64,
          gstTotal: 287.64,
          paymentMode: 'COD',
          paymentStatus: 'pending',
          rtoScore: 85,
          status: 'rto',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          companyId: company._id,
          customerName: 'Priya Sharma',
          phone: '9822012345',
          items: [{ productId: p2._id, qty: 1, price: 2499 }],
          total: 2948.82,
          gstTotal: 449.82,
          paymentMode: 'Razorpay',
          paymentStatus: 'paid',
          rtoScore: 12,
          shiprocketAwb: 'SR839201948',
          status: 'shipped',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          companyId: company._id,
          customerName: 'Amit Patel',
          phone: '9111111111',
          items: [{ productId: p3._id, qty: 3, price: 899 }],
          total: 3020.64,
          gstTotal: 323.64,
          paymentMode: 'COD',
          paymentStatus: 'pending',
          rtoScore: 92,
          status: 'rto',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]);

      await AbandonedCart.create([
        {
          companyId: company._id,
          phone: '9876500001',
          productId: p2._id,
          cartValue: 2499,
          reminderDays: [0, 1, 3],
          recovered: false,
          createdAt: new Date()
        },
        {
          companyId: company._id,
          phone: '9876500002',
          productId: p1._id,
          cartValue: 1598,
          reminderDays: [0, 1, 3],
          recovered: false,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]);

      await TallySync.create({
        companyId: company._id,
        lastSyncAt: new Date(),
        itemsSynced: 3,
        status: 'success'
      });

      console.log('[Bootstrap] Initial demo catalog, orders, and abandoned carts seeded.');
    }
  } catch (err) {
    console.warn('[Bootstrap Warning]:', err.message);
  }
}

async function start() {
  let dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_os';

  // Fast check if local MongoDB is up, otherwise spin up memory server
  try {
    console.log('[DB] Connecting to MongoDB...');
    const conn = await Promise.race([
      mongoose.connect(dbUri, { serverSelectionTimeoutMS: 1500 }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
    ]);
    console.log('[MongoDB] Connected successfully to', dbUri);
  } catch (e) {
    console.log('[MongoDB] Local port 27017 unavailable. Initializing embedded database...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    dbUri = mongod.getUri();
    await mongoose.connect(dbUri);
    console.log('[MongoDB Embedded] Connected successfully to', dbUri);
  }

  await seedInitialData();

  // Start Cron
  initCron();

  // Start Express HTTP Server on 0.0.0.0 so Render can bind to it
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] E-Commerce D2C Sales OS backend running on port ${PORT}`);
  });
}

start().catch(err => console.error('[Fatal Startup Error]:', err));

module.exports = app;
