const mongoose = require('mongoose');

const TallySyncSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  lastSyncAt: { type: Date, default: Date.now },
  itemsSynced: { type: Number, default: 0 },
  status: { type: String, enum: ['success', 'failed'], default: 'success' }
});

module.exports = mongoose.model('TallySync', TallySyncSchema);
