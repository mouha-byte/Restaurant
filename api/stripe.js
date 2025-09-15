import Stripe from 'stripe';

// Variables d'environnement Vercel à configurer :
// STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx (ou sk_live_ pour production)
// STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
// FRONTEND_URL=https://votre-app.vercel.app

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// API Route : /api/create-payment
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { amount, email } = req.body;

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Commande' },
                        unit_amount: amount * 100
                    },
                    quantity: 1
                }],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel`,
                customer_email: email
            });

            res.json({ url: session.url });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
