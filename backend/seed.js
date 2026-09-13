const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const Company = require('./models/Company');
const Product = require('./models/Product');
const Order = require('./models/Order');
const AbandonedCart = require('./models/AbandonedCart');
const TallySync = require('./models/TallySync');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_os';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clean existing test data
    await Company.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await AbandonedCart.deleteMany({});
    await TallySync.deleteMany({});

    // 1. Seed Company
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const company = await Company.create({
      name: 'Acme D2C Lifestyle',
      subdomain: 'acme',
      ownerEmail: 'owner@acme.com',
      passwordHash: passwordHash
    });
    console.log(`[Seed] Created Company: ${company.name} (${company.subdomain})`);

    // 2. Seed Products
    const products = await Product.create([
      {
        companyId: company._id,
        title: 'Premium Organic Arabica Coffee 500g',
        sku: 'COF-ARA-001',
        price: 799,
        gstPercent: 18,
        stock: 145,
        images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60'],
        tallyItemId: 'TALLY-COF-01',
        status: 'active'
      },
      {
        companyId: company._id,
        title: 'Wireless Active Noise Cancelling Earbuds',
        sku: 'EAR-ANC-002',
        price: 2499,
        gstPercent: 18,
        stock: 62,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60'],
        tallyItemId: 'TALLY-EAR-02',
        status: 'active'
      },
      {
        companyId: company._id,
        title: 'Matte Stainless Steel Hydration Bottle 1L',
        sku: 'BOT-STE-003',
        price: 899,
        gstPercent: 12,
        stock: 210,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60'],
        tallyItemId: 'TALLY-BOT-03',
        status: 'active'
      }
    ]);
    console.log(`[Seed] Created ${products.length} Products`);

    // 3. Seed Orders (including high RTO score orders)
    const orders = await Order.create([
      {
        companyId: company._id,
        customerName: 'Rahul Verma',
        phone: '9876543210',
        items: [{ productId: products[0]._id, qty: 2, price: 799 }],
        total: 1885.64,
        gstTotal: 287.64,
        paymentMode: 'COD',
        paymentStatus: 'pending',
        rtoScore: 85, // High RTO Risk!
        status: 'rto',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        companyId: company._id,
        customerName: 'Priya Sharma',
        phone: '9822012345',
        items: [{ productId: products[1]._id, qty: 1, price: 2499 }],
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
        phone: '9111111111', // Suspicious repeated digits
        items: [{ productId: products[2]._id, qty: 3, price: 899 }],
        total: 3020.64,
        gstTotal: 323.64,
        paymentMode: 'COD',
        paymentStatus: 'pending',
        rtoScore: 92, // High RTO
        status: 'rto',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        companyId: company._id,
        customerName: 'Sneha Kulkarni',
        phone: '9988776655',
        items: [{ productId: products[0]._id, qty: 1, price: 799 }],
        total: 942.82,
        gstTotal: 143.82,
        paymentMode: 'UPI',
        paymentStatus: 'paid',
        rtoScore: 18,
        status: 'delivered',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log(`[Seed] Created ${orders.length} Orders`);

    // 4. Seed Abandoned Carts
    const abandoned = await AbandonedCart.create([
      {
        companyId: company._id,
        phone: '9876500001',
        productId: products[1]._id,
        cartValue: 2499,
        reminderDays: [0, 1, 3],
        recovered: false,
        createdAt: new Date()
      },
      {
        companyId: company._id,
        phone: '9876500002',
        productId: products[0]._id,
        cartValue: 1598,
        reminderDays: [0, 1, 3],
        recovered: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log(`[Seed] Created ${abandoned.length} Abandoned Carts`);

    // 5. Seed Tally Log
    await TallySync.create({
      companyId: company._id,
      lastSyncAt: new Date(),
      itemsSynced: 3,
      status: 'success'
    });
    console.log('[Seed] Created Initial Tally Sync Record');

    console.log('[Seed] Finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

seed();
