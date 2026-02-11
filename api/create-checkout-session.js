// Serverless function for Vercel: POST /api/create-checkout-session
// Env var required: STRIPE_SECRET_KEY
const Stripe = require('stripe');

let stripe;
try {
  stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
} catch (e) {
  console.error('Stripe init error:', e.message);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured on server' });
  }

  try {
    const {
      orderId,
      items = [],
      totalPrice,
      customerEmail,
      customerName,
      deliveryFee = 0,
      pizzaDiscount = 0
    } = req.body || {};

    if (!items.length) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Prefer charging the FINAL TOTAL provided by the client (includes delivery & discounts)
    // Fallback to subtotal from items if totalPrice is invalid or missing
    const numericTotal = Number(totalPrice);

    // Compute subtotal from items for metadata and fallback safety
    const computedSubtotal = items.reduce((sum, it) => (
      sum + (Number(it.price || 0) * Number(it.quantity || 1))
    ), 0);

    let line_items;
    if (Number.isFinite(numericTotal) && numericTotal > 0) {
      // Single line that represents the final total amount to be charged
      line_items = [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Commande Speranza Pizza (Total)' },
          unit_amount: Math.round(numericTotal * 100)
        },
        quantity: 1
      }];
    } else {
      // Fallback: build from individual items (subtotal)
      line_items = items.map(it => ({
        price_data: {
          currency: 'eur',
          product_data: { name: it.name || 'Item' },
          unit_amount: Math.round(Number(it.price || 0) * 100)
        },
        quantity: it.quantity || 1
      }));
    }

    const host = req.headers.origin || 'https://restaurant-eight-self.vercel.app';
    const success_url = `${host}/menu.html?payment=success&orderId=${encodeURIComponent(orderId || '')}`;
    const cancel_url = `${host}/html.html?payment=cancelled&orderId=${encodeURIComponent(orderId || '')}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: customerEmail || undefined,
      metadata: {
        orderId: orderId || '',
        customerName: customerName || '',
        subtotal: String(computedSubtotal),
        deliveryFee: String(deliveryFee),
        pizzaDiscount: String(pizzaDiscount),
        finalTotal: Number.isFinite(numericTotal) && numericTotal > 0 ? String(numericTotal) : String(computedSubtotal)
      },
      success_url,
      cancel_url
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session creation failed:', err);
    return res.status(500).json({ error: err.message || 'Stripe session failed' });
  }
};
