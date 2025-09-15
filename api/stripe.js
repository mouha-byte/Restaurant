import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

// ⚠️ Ta clé secrète Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-11-15' });

// Créer une session de paiement
app.post('/create-payment', async (req, res) => {
  const { amount, email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        { price_data: { currency: 'usd', product_data: { name: 'Commande' }, unit_amount: amount * 100 }, quantity: 1 }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: email
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook pour vérifier paiement
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Paiement réussi pour:', session.customer_email, 'Montant:', session.amount_total/100);
    // Ici tu peux sauvegarder dans ta DB
  }

  res.json({ received: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
