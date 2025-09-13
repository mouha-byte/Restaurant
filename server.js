const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '7829056029:AAG0owYmm4vzF9tLg71YHxoZ6O4Rr76aF6k';
const TELEGRAM_CHAT_ID = '6758786390';

// Route pour envoyer les notifications Telegram
app.post('/send-order-notification', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerLocation, items, totalPrice, orderId } = req.body;

    const message = `🍽️ *New Order Received*\n\n` +
      `👤 *Customer:* ${customerName}\n` +
      `📧 *Email:* ${customerEmail}\n` +
      `📱 *Phone:* ${customerPhone}\n` +
      `📍 *Address:* ${customerLocation}\n\n` +
      `🛒 *Items:*\n` +
      items.map(item => `• ${item.name} x${item.quantity} - $${item.price * item.quantity}`).join('\n') +
      `\n\n💰 *Total: $${totalPrice}*\n` +
      `📅 *Order ID:* ${orderId}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();

    if (result.ok) {
      console.log('📱 Telegram message sent successfully');
      res.json({ success: true, message: 'Notification sent successfully' });
    } else {
      console.error('❌ Failed to send Telegram message:', result);
      res.status(400).json({ success: false, error: 'Failed to send notification' });
    }

  } catch (error) {
    console.error('⚠️ Error sending Telegram message:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Restaurant Backend Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});