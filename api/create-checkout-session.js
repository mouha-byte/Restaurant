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
      deliveryAddress
    } = req.body || {};

    if (!items.length) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Calculer le total des articles
    const itemsTotal = items.reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0);
    
    // Déterminer les frais de livraison
    const deliveryFee = itemsTotal >= 15 ? 0 : 7;

    // Build line_items from cart
    const line_items = items.map(it => ({
      price_data: {
        currency: 'eur',
        product_data: { name: it.name || 'Item' },
        unit_amount: Math.round(Number(it.price || 0) * 100)
      },
      quantity: it.quantity || 1
    }));

    // Ajouter les frais de livraison si nécessaire
    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: { 
            name: 'Frais de livraison',
            description: 'Livraison gratuite à partir de 15€'
          },
          unit_amount: deliveryFee * 100
        },
        quantity: 1
      });
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
        deliveryAddress: deliveryAddress || '',
        itemsTotal: itemsTotal.toString(),
        deliveryFee: deliveryFee.toString()
      },
      success_url,
      cancel_url,
      // Informations de la boutique
      payment_intent_data: {
        statement_descriptor: 'RESTAURANT ZZH5',
        description: `Commande #${orderId || 'N/A'} - ${customerName || 'Client'}`
      },
      // Configuration de livraison
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH']
      },
      // Message personnalisé
      custom_text: {
        submit: {
          message: deliveryFee === 0 
            ? 'Félicitations ! Livraison gratuite pour cette commande (15€+)'
            : 'Frais de livraison: 7€ (Gratuit à partir de 15€)'
        }
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session creation failed:', err);
    return res.status(500).json({ error: err.message || 'Stripe session failed' });
  }
};
