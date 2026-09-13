const cron = require('node-cron');
const nodemailer = require('nodemailer');
const axios = require('axios');
const AbandonedCart = require('./models/AbandonedCart');

// Cron: 0 8,15,20 * * * daily -> loop AbandonedCart recovered false, diffDays = now-createdAt, if reminderDays includes diffDays -> WhatsApp + SMS + log
function initCron() {
  console.log('[CRON] Initializing Abandoned Cart Recovery cron schedule: 0 8,15,20 * * *');

  cron.schedule('0 8,15,20 * * *', async () => {
    console.log('[CRON] Running Abandoned Cart Recovery Job at scheduled time');
    await runAbandonedCartRecovery();
  });
}

// Extracted function so it can also be manually triggered for testing
async function runAbandonedCartRecovery() {
  try {
    const carts = await AbandonedCart.find({ recovered: false }).populate('productId');
    const now = new Date();

    for (const cart of carts) {
      const createdAt = new Date(cart.createdAt);
      const diffTime = Math.abs(now - createdAt);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (cart.reminderDays && cart.reminderDays.includes(diffDays)) {
        const productTitle = cart.productId ? cart.productId.title : 'Cart Item';
        const upiLink = `upi://pay?pa=merchant@upi&pn=D2CStore&am=${cart.cartValue}&cu=INR&tn=CompleteCart_${cart._id}`;
        const message = `Reminder: Don't forget your ${productTitle}! Complete your order for ₹${cart.cartValue}: ${upiLink}`;

        // 1. WhatsApp Recovery
        console.log(`[CRON WhatsApp] Sending WhatsApp to ${cart.phone}: ${message}`);
        const token = process.env.WHATSAPP_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_ID;
        if (token && token !== 'EAAxxx' && phoneId && phoneId !== '123xxx') {
          try {
            await axios.post(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
              messaging_product: 'whatsapp',
              to: cart.phone,
              type: 'text',
              text: { body: message }
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (e) {
            console.warn('[CRON WhatsApp API Error]:', e.message);
          }
        }

        // 2. SMS Recovery (Fast2SMS)
        console.log(`[CRON SMS] Sending SMS via Fast2SMS to ${cart.phone}: ${message}`);
        const fast2smsKey = process.env.FAST2SMS_KEY;
        if (fast2smsKey && fast2smsKey !== 'xxx') {
          try {
            await axios.post('https://www.fast2sms.com/dev/bulkV2', {
              route: 'v3',
              sender_id: 'TXTIND',
              message: message,
              language: 'english',
              flash: 0,
              numbers: cart.phone
            }, {
              headers: { authorization: fast2smsKey }
            });
          } catch (e) {
            console.warn('[CRON Fast2SMS API Error]:', e.message);
          }
        }

        // 3. Log
        console.log(`[CRON Log] Abandoned cart ID ${cart._id} processed for day ${diffDays}. Phone: ${cart.phone}`);
      }
    }
  } catch (err) {
    console.error('[CRON Error] Failed during abandoned cart recovery execution:', err);
  }
}

module.exports = { initCron, runAbandonedCartRecovery };
