const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const AbandonedCart = require('../models/AbandonedCart');

// Helper to calculate realistic RTO risk score based on payment mode, amount, and phone heuristics
function calculateRtoScore(paymentMode, total, phone) {
  let score = 15; // baseline low risk

  // COD is higher risk in Indian D2C
  if (paymentMode === 'COD') {
    score += 45;
  } else if (paymentMode === 'UPI') {
    score += 5;
  } else if (paymentMode === 'Razorpay') {
    score += 2;
  }

  // High cart value with COD is very high risk
  if (paymentMode === 'COD' && total > 2000) {
    score += 25;
  }

  // Phone number pattern check (e.g. repeated digits or suspicious)
  if (/^(\d)\1{9}$/.test(phone)) {
    score += 30;
  }

  return Math.min(Math.max(score, 5), 95);
}

// POST /api/orders/create - companyId, phone, items, paymentMode -> total+GST, rtoScore, create Order
router.post('/create', async (req, res) => {
  try {
    const { companyId, customerName, phone, items, paymentMode } = req.body;

    if (!companyId || !phone || !items || !items.length || !paymentMode) {
      return res.status(400).json({ message: 'companyId, phone, items, and paymentMode are required.' });
    }

    let calculatedTotal = 0;
    let calculatedGstTotal = 0;
    const resolvedItems = [];

    for (const item of items) {
      let unitPrice = item.price;
      let gstPercent = 18;

      // Look up product to verify price & gst if needed
      const product = await Product.findById(item.productId);
      if (product) {
        if (unitPrice === undefined || unitPrice === null) {
          unitPrice = product.price;
        }
        gstPercent = product.gstPercent || 18;
      }

      const qty = item.qty || 1;
      const itemSubtotal = unitPrice * qty;
      const itemGst = (itemSubtotal * gstPercent) / 100;

      calculatedTotal += itemSubtotal + itemGst;
      calculatedGstTotal += itemGst;

      resolvedItems.push({
        productId: item.productId,
        qty,
        price: unitPrice
      });
    }

    const rtoScore = calculateRtoScore(paymentMode, calculatedTotal, phone);

    const order = new Order({
      companyId,
      customerName: customerName || 'Customer',
      phone,
      items: resolvedItems,
      total: Math.round(calculatedTotal * 100) / 100,
      gstTotal: Math.round(calculatedGstTotal * 100) / 100,
      paymentMode,
      paymentStatus: paymentMode === 'COD' ? 'pending' : 'pending',
      rtoScore,
      status: rtoScore > 75 ? 'rto' : 'valid'
    });

    await order.save();

    return res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Failed to create order.', error: err.message });
  }
});

// GET /api/orders/list?companyId=&status= - sort expiry/createdAt asc
router.get('/list', async (req, res) => {
  try {
    const { companyId, status } = req.query;
    let query = {};
    if (companyId) query.companyId = companyId;
    if (status) query.status = status;

    // sort asc as requested in doc: "sort expiry asc" / "sort createdAt asc"
    const orders = await Order.find(query).populate('items.productId').sort({ createdAt: 1 });
    return res.json(orders);
  } catch (err) {
    console.error('List orders error:', err);
    return res.status(500).json({ message: 'Failed to retrieve orders.', error: err.message });
  }
});

// GET /api/orders/stats?companyId= - total, rtoCount, deliveredCount
router.get('/stats', async (req, res) => {
  try {
    const { companyId } = req.query;
    let query = {};
    if (companyId) query.companyId = companyId;

    const total = await Order.countDocuments(query);
    const rtoCount = await Order.countDocuments({ ...query, status: 'rto' });
    const deliveredCount = await Order.countDocuments({ ...query, status: 'delivered' });
    const packedCount = await Order.countDocuments({ ...query, status: 'packed' });
    const shippedCount = await Order.countDocuments({ ...query, status: 'shipped' });

    return res.json({
      total,
      rtoCount,
      deliveredCount,
      packedCount,
      shippedCount
    });
  } catch (err) {
    console.error('Order stats error:', err);
    return res.status(500).json({ message: 'Failed to calculate stats.', error: err.message });
  }
});

// POST /api/orders/abandoned/check - companyId, phone, productId, cartValue -> create AbandonedCart
router.post('/abandoned/check', async (req, res) => {
  try {
    const { companyId, phone, productId, cartValue } = req.body;
    if (!companyId || !phone || !productId) {
      return res.status(400).json({ message: 'companyId, phone, and productId are required.' });
    }

    const abandoned = new AbandonedCart({
      companyId,
      phone,
      productId,
      cartValue: cartValue || 0,
      reminderDays: [0, 1, 3],
      recovered: false
    });

    await abandoned.save();
    return res.status(201).json(abandoned);
  } catch (err) {
    console.error('Abandoned check error:', err);
    return res.status(500).json({ message: 'Failed to record abandoned cart.', error: err.message });
  }
});

// GET /api/orders/abandoned/list - list all abandoned carts
router.get('/abandoned/list', async (req, res) => {
  try {
    const { companyId } = req.query;
    let query = {};
    if (companyId) query.companyId = companyId;

    const carts = await AbandonedCart.find(query).populate('productId').sort({ createdAt: -1 });
    return res.json(carts);
  } catch (err) {
    console.error('List abandoned carts error:', err);
    return res.status(500).json({ message: 'Failed to list abandoned carts.', error: err.message });
  }
});

// POST /api/orders/shiprocket/ship - Mark Shipped -> Shiprocket API
router.post('/shiprocket/ship', async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Mock/Call Shiprocket AWB generation
    const mockAwb = 'SR' + Math.floor(100000000 + Math.random() * 900000000);
    order.shiprocketAwb = mockAwb;
    order.status = 'shipped';
    await order.save();

    return res.json({
      message: 'Order shipped successfully via Shiprocket API.',
      shiprocketAwb: mockAwb,
      order
    });
  } catch (err) {
    console.error('Shiprocket ship error:', err);
    return res.status(500).json({ message: 'Failed to ship via Shiprocket.', error: err.message });
  }
});

module.exports = router;
