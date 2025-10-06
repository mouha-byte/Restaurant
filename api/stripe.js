import Stripe from 'stripe';

// Check for required environment variable
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripePaymentSession(totalPrice, orderData) {
    try {
        console.log('Creating Stripe payment session...');
        console.log('Total price:', totalPrice);
        console.log('Order data:', orderData);

        // Validate input parameters
        if (!totalPrice || totalPrice <= 0) {
            throw new Error('Invalid total price');
        }

        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        
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
            success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cancel`,
            metadata: {
                orderId: orderData?.id || 'unknown'
            }
        });

        console.log('Session created successfully:', session.id);
        console.log('Payment session URL:', session.url);
        return {
            success: true,
            url: session.url,
            sessionId: session.id
        };
        
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        console.error('Error details:', {
            message: error.message,
            type: error.type,
            code: error.code
        });
        throw new Error(`Failed to create payment session: ${error.message}`);
    }
}

export { createStripePaymentSession };
