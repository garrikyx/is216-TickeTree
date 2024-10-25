import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import stripePackage from 'stripe';
import bodyParser from 'body-parser';
import path from 'path';
import nodemailer from 'nodemailer';

// Initialize the app
const app = express();
const port = process.env.PORT || 5001;
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());
app.use(express.static(path.resolve('dist')));

// API endpoint for fetching events
app.get('/api/events', async (req, res) => {
    try {
        const username = process.env.EVENTFINDA_USERNAME;
        const password = process.env.EVENTFINDA_PASSWORD;
        const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

        const queryParams = req.query;
        // console.log(queryParams);

        const response = await axios.get('https://api.eventfinda.sg/v2/events.json', {
            headers: { Authorization: authHeader },
            params: { ...queryParams }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { quantity, price, customerEmail } = req.body;
    const imageUrl = 'https://via.placeholder.com/150';

    try {
        const customer = await stripe.customers.create({
            email: customerEmail,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'sgd',
                    product_data: {
                        name: 'Tate McRae: THINK LATER TOUR',
                        description: 'Seat: 38',
                        images: [imageUrl],
                    },
                    unit_amount: price * 100,
                },
                quantity: quantity,
            }],
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:5173/error',
            customer: customer.id,
            allow_promotion_codes: true,
        });

        console.log(session);
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

// Retrieve checkout session details
app.get('/checkout-session', async (req, res) => {
    const { session_id } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items.data.price.product', 'customer'],
        });

        console.log("Session Details:", session);

        res.json({
            customer_email: session.customer.email,
            line_items: session.line_items,
            amount_total: session.amount_total,
        });
    } catch (error) {
        console.error("Error retrieving checkout session:", error);
        res.status(500).json({ error: "Failed to retrieve checkout session" });
    }
});

// Send confirmation email
app.post('/send-confirmation-email', async (req, res) => {
    const { email, orderSummary } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Purchase Confirmation',
        html: `
            <h1>Thank You for Your Purchase!</h1>
            <p>Your payment has been successfully processed.</p>
            <h2>Order Summary:</h2>
            <p><strong>Event:</strong> ${orderSummary.eventName}</p>
            <p><strong>Quantity:</strong> ${orderSummary.quantity}</p>
            <p><strong>Total Price:</strong> SGD ${(orderSummary.totalPrice / 100).toFixed(2)}</p>\
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
