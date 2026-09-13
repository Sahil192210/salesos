const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const TallySync = require('../models/TallySync');

// POST /api/tally/sync - companyId, tallyData -> sync stock, TallySync log
router.post('/sync', async (req, res) => {
  try {
    const { companyId, tallyData } = req.body;
    if (!companyId) {
      return res.status(400).json({ message: 'companyId is required.' });
    }

    // tallyData can be an array of { sku or tallyItemId, stock, price }
    let itemsSynced = 0;
    if (Array.isArray(tallyData)) {
      for (const item of tallyData) {
        let query = { companyId };
        if (item.sku) query.sku = item.sku;
        else if (item.tallyItemId) query.tallyItemId = item.tallyItemId;

        const updateFields = {};
        if (item.stock !== undefined) updateFields.stock = Number(item.stock);
        if (item.price !== undefined) updateFields.price = Number(item.price);

        const updated = await Product.findOneAndUpdate(query, { $set: updateFields }, { new: true });
        if (updated) {
          itemsSynced++;
        }
      }
    } else {
      // If mock sync triggered with no specific payload, sync all products by +10 stock
      const products = await Product.find({ companyId });
      for (const p of products) {
        p.stock += 10;
        await p.save();
        itemsSynced++;
      }
    }

    const log = new TallySync({
      companyId,
      lastSyncAt: new Date(),
      itemsSynced,
      status: 'success'
    });

    await log.save();

    return res.json({
      message: `Tally sync completed successfully. Synced ${itemsSynced} items.`,
      log
    });
  } catch (err) {
    console.error('Tally sync error:', err);
    try {
      if (req.body.companyId) {
        await new TallySync({
          companyId: req.body.companyId,
          lastSyncAt: new Date(),
          itemsSynced: 0,
          status: 'failed'
        }).save();
      }
    } catch (e) {}
    return res.status(500).json({ message: 'Tally sync failed.', error: err.message });
  }
});

// GET /api/tally/logs - list tally sync logs
router.get('/logs', async (req, res) => {
  try {
    const { companyId } = req.query;
    let query = {};
    if (companyId) query.companyId = companyId;

    const logs = await TallySync.find(query).sort({ lastSyncAt: -1 }).limit(20);
    return res.json(logs);
  } catch (err) {
    console.error('Get tally logs error:', err);
    return res.status(500).json({ message: 'Failed to fetch tally logs.', error: err.message });
  }
});

module.exports = router;
