import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

// Skip JSON parsing for Stripe webhook so we can access the raw body
app.use((req, res, next) => {
    if (req.originalUrl === "/webhook") return next();
    return bodyParser.json()(req, res, next);
});

// Load Stripe secret
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PORT } = process.env;
if (!STRIPE_SECRET_KEY) throw new Error("❌ Missing STRIPE_SECRET_KEY in .env");
if (!STRIPE_WEBHOOK_SECRET) throw new Error("❌ Missing STRIPE_WEBHOOK_SECRET in .env");

const stripe = new Stripe(STRIPE_SECRET_KEY);

// ✅ Temporary order storage in memory
const orders = {};

// Add a basic homepage
app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`<!doctype html>
<html>
    <head><meta charset="utf-8"><title>Pizza Payment</title></head>
    <body>
        <h1>🍕 Pizza Payment Demo</h1>
        <form action="/create-checkout-session" method="POST">
            <button type="submit">Buy Pizza ($15.00)</button>
        </form>
    </body>
</html>`);
});

// 1️⃣ Create a checkout session
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { totalPrice, orderId } = req.body || {};

        let session;
        if (Number.isFinite(Number(totalPrice)) && Number(totalPrice) > 0) {
            // Use final total provided by client (EUR)
            session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency: "eur",
                            product_data: { name: "Commande Speranza Pizza (Total)" },
                            unit_amount: Math.round(Number(totalPrice) * 100),
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
                metadata: {
                    orderId: orderId || "",
                    finalTotal: String(totalPrice),
                },
            });
        } else {
            // Fallback demo: fixed 15.00 USD
            session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: { name: "Pizza Order" },
                            unit_amount: 1500,
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
            });
        }

        // Temporary storage
        orders[session.id] = {
            sessionId: session.id,
            amount: 1500,
            currency: "usd",
            status: "pending",
            createdAt: new Date().toISOString(),
        };

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Success page
app.get("/success", async (req, res) => {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).send("Missing session_id");
    
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const order = orders[session_id] || null;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(`<!doctype html>
<html>
    <head><meta charset="utf-8"><title>Payment Success</title></head>
    <body>
        <h1>✅ Payment Successful</h1>
        <p><strong>Session ID:</strong> ${session.id}</p>
        <p><strong>Payment Status:</strong> ${session.payment_status}</p>
    <p><strong>Amount:</strong> €${(session.amount_total / 100).toFixed(2)}</p>
        <h3>Order Details:</h3>
        <pre style="background:#f6f8fa;padding:12px;border:1px solid #ddd;border-radius:4px;">${order ? JSON.stringify(order, null, 2) : "No order found in memory."}</pre>
        <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#007cba;color:white;text-decoration:none;border-radius:4px;">Back to Home</a>
    </body>
</html>`);
    } catch (err) {
        console.error("Error retrieving session:", err);
        res.status(500).send(`Error retrieving session: ${err.message}`);
    }
});

// ✅ Cancel page
app.get("/cancel", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`<!doctype html>
<html>
    <head><meta charset="utf-8"><title>Payment Cancelled</title></head>
    <body>
        <h1>❌ Payment Cancelled</h1>
        <p>Your payment was cancelled. No charges were made.</p>
        <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#007cba;color:white;text-decoration:none;border-radius:4px;">Try Again</a>
    </body>
</html>`);
});

// 2️⃣ Stripe Webhook (verify payment)
app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res) => {
        console.log("📥 Webhook received");
        
        const sig = req.headers["stripe-signature"];
        if (!sig) {
            console.error("❌ Missing Stripe signature");
            return res.status(400).send("Missing Stripe signature");
        }

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
            console.log("✅ Webhook signature verified");
            console.log("Event type:", event.type);
            console.log("Event ID:", event.id);
        } catch (err) {
            console.error("❌ Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the checkout.session.completed event
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("✅ Payment completed for session:", session.id);
            
            // Update order status
            if (orders[session.id]) {
                orders[session.id].status = "paid";
                orders[session.id].paidAt = new Date().toISOString();
                orders[session.id].amount_total = session.amount_total;
                console.log("📋 Order updated:", orders[session.id]);
            } else {
                console.log("⚠️ Order not found in memory for session:", session.id);
            }
        } else {
            console.log("🔄 Unhandled event type:", event.type);
        }

        res.json({ received: true });
    }
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
});

const port = Number(PORT) || 4242;
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  / - Homepage`);
    console.log(`   POST /create-checkout-session - Create payment`);
    console.log(`   GET  /success - Payment success page`);
    console.log(`   GET  /cancel - Payment cancel page`);
    console.log(`   POST /webhook - Stripe webhook`);
});
