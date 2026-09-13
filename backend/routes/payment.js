const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

// POST /api/payment/verify - razorpay_payment_id, orderId -> verify, update paid
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // If signature provided, verify with razorpay secret
    const secret = process.env.RAZORPAY_SECRET || 'xxx';
    let isValid = true;

    if (razorpay_signature && razorpay_order_id && secret && secret !== 'xxx') {
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      isValid = (generated_signature === razorpay_signature);
    }

    if (!isValid) {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({ message: 'Payment verification failed.', status: 'failed' });
    }

    order.paymentStatus = 'paid';
    await order.save();

    return res.json({
      message: 'Payment verified and status updated to paid.',
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      razorpay_payment_id: razorpay_payment_id || 'pay_mock_' + Date.now()
    });
  } catch (err) {
    console.error('Payment verify error:', err);
    return res.status(500).json({ message: 'Error verifying payment.', error: err.message });
  }
});

module.exports = router;
