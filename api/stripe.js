import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripePaymentSession(totalPrice, orderData) {
    try {
        console.log('Creating Stripe payment session...');
        console.log('Total price:', totalPrice);
        console.log('Order data:', orderData);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: { 
                        name: 'Commande Restaurant' 
                    },
                    unit_amount: Math.round(totalPrice * 100)
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: 'https://yourrestaurant.com/success',
            cancel_url: 'https://yourrestaurant.com/cancel'
        });

        console.log('Session created successfully:', session.id);
        return `Votre commande est confirmée! Procédez au paiement: ${session.url}`;
        
    } catch (error) {
        console.error('Error creating Stripe session:', error.message);
        return 'Votre commande est confirmée! Contactez-nous pour le paiement.';
    }
}

export { createStripePaymentSession };
