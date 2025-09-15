// server.js
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Utiliser la clé secrète Stripe ici
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-11-15' });

// Firebase initialization
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    projectId: process.env.FIREBASE_PROJECT_ID
});
const db = admin.firestore();

// ----------------------
// 1️⃣ Créer lien paiement et envoyer email
// ----------------------
app.post('/create-payment-link', async (req, res) => {
  try {
    const { email, amount } = req.body;

    // Créer session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        { 
          price_data: { 
            currency: 'usd', 
            product_data: { name: "Order" }, 
            unit_amount: amount * 100 
          }, 
          quantity: 1 
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: email
    });

    // Envoyer email avec lien de paiement
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Complete your payment",
      html: `<p>Click here to pay: <a href="${session.url}">Pay Now</a></p>`
    });

    res.json({ message: 'Email sent with payment link', url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ----------------------
// 2️⃣ Webhook Stripe
// ----------------------
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Enregistrer paiement dans Firebase
    db.collection('payments').doc(session.id).set({
      email: session.customer_email,
      amount: session.amount_total / 100,
      status: 'paid',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  res.json({ received: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
