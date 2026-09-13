const mongoose = require('mongoose');

const AbandonedCartSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  phone: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  cartValue: { type: Number, required: true },
  reminderDays: { type: [Number], default: [0, 1, 3] },
  recovered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AbandonedCart', AbandonedCartSchema);
