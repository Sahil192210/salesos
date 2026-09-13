const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Configure Multer storage
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { files: 5 } // 5 max
});

// POST /api/products/create - Bearer, multer multiple images 5 max, title, sku, price, gstPercent, stock -> save /uploads/, fileUrl, create Product
router.post('/create', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { title, sku, price, gstPercent, stock, tallyItemId, status } = req.body;
    const companyId = req.companyId;

    if (!title || !sku || price === undefined) {
      return res.status(400).json({ message: 'Title, sku, and price are required.' });
    }

    const existing = await Product.findOne({ sku });
    if (existing) {
      return res.status(400).json({ message: `Product with SKU ${sku} already exists.` });
    }

    // Process uploaded images
    const imageFiles = req.files || [];
    const fileUrls = imageFiles.map(file => `/uploads/${file.filename}`);

    const product = new Product({
      companyId,
      title,
      sku,
      price: Number(price),
      gstPercent: gstPercent !== undefined ? Number(gstPercent) : 18,
      stock: stock !== undefined ? Number(stock) : 0,
      images: fileUrls,
      tallyItemId: tallyItemId || '',
      status: status || 'active'
    });

    await product.save();

    return res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ message: 'Failed to create product.', error: err.message });
  }
});

// GET /api/products/list?companyId=&status= - sort createdAt desc
router.get('/list', async (req, res) => {
  try {
    const { companyId, status } = req.query;
    let query = {};
    if (companyId) {
      query.companyId = companyId;
    }
    if (status) {
      query.status = status;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error('List products error:', err);
    return res.status(500).json({ message: 'Failed to retrieve products.', error: err.message });
  }
});

module.exports = router;
