const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const Order = require('../models/Order');

// GET /api/audit/export?companyId=&year=2026 - Excel Title, SKU, Total, GST, Status
router.get('/export', async (req, res) => {
  try {
    const { companyId, year = 2026 } = req.query;
    let query = {};
    if (companyId) query.companyId = companyId;

    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
    query.createdAt = { $gte: startOfYear, $lte: endOfYear };

    const orders = await Order.find(query).populate('items.productId');

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'E-Commerce D2C Sales OS';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(`Audit ${year}`);

    // Columns: Excel Title, SKU, Total, GST, Status
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'SKU', key: 'sku', width: 20 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'GST', key: 'gst', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Order ID', key: 'orderId', width: 28 },
      { header: 'Date', key: 'date', width: 22 }
    ];

    // Style the header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F2937' }
    };

    orders.forEach(order => {
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          const product = item.productId || {};
          worksheet.addRow({
            title: product.title || 'General Item',
            sku: product.sku || 'SKU-N/A',
            total: order.total,
            gst: order.gstTotal,
            status: order.status,
            orderId: order._id.toString(),
            date: new Date(order.createdAt).toISOString().split('T')[0]
          });
        });
      } else {
        worksheet.addRow({
          title: 'Order Summary',
          sku: 'N/A',
          total: order.total,
          gst: order.gstTotal,
          status: order.status,
          orderId: order._id.toString(),
          date: new Date(order.createdAt).toISOString().split('T')[0]
        });
      }
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Audit_Export_${year}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (err) {
    console.error('Audit export error:', err);
    return res.status(500).json({ message: 'Failed to export audit sheet.', error: err.message });
  }
});

module.exports = router;
