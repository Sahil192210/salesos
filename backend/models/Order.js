const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  gstTotal: { type: Number, required: true },
  paymentMode: { type: String, enum: ['COD', 'UPI', 'Razorpay'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  rtoScore: { type: Number, min: 0, max: 100, default: 10 },
  shiprocketAwb: { type: String, default: '' },
  status: { type: String, enum: ['valid', 'packed', 'shipped', 'delivered', 'rto'], default: 'valid' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
