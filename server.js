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

app.post('/create-checkout-session', async (req, res) => {
    const { cartItems } = req.body;

    // Log the incoming cart items to verify the data structure
    console.log("Received cart items:", cartItems);

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).send({ error: 'No items in the cart' });
    }

    try {
        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'sgd',
                product_data: {
                    name: item.eventName,
                    description: `Seat: ${item.seatNumber}\nDate: ${item.eventDate}\nTime: ${item.eventTime}`,
                    images: [item.imageUrl],
                    metadata: {
                        eventDate: item.eventDate, // Include date in metadata
                        eventTime: item.eventTime, // Include time in metadata
                    },
                },
                unit_amount: Math.round(item.pricePerItem * 100),
            },
            quantity: item.quantity,
        }));
        
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:5173/error',
            allow_promotion_codes: true,
            metadata: {
                eventDate: cartItems[0].eventDate, // Assuming one event at a time
                eventTime: cartItems[0].eventTime, // Assuming one event at a time
            }
        });
        
        console.log(session);
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

app.get('/checkout-session', async (req, res) => {
    const { session_id } = req.query;
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items.data.price.product', 'customer'],
        });

        const item = session.line_items.data[0].price.product;
        res.json({
            customer_email: session.customer_details?.email || session.customer?.email,
            line_items: session.line_items,
            amount_total: session.amount_total,
            eventDate: item.metadata.eventDate, // Send date back to the client
            eventTime: item.metadata.eventTime, // Send time back to the client
        });
    } catch (error) {
        console.error("Error fetching session details:", error);
        res.status(500).send("Failed to retrieve session details.");
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
            <p>Your payment has been successfully processed.</p>
            <h2>Order Summary:</h2>
            <p><strong>Event:</strong> ${orderSummary.eventName}</p>
            <p><strong>Date:</strong> ${new Date(orderSummary.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${orderSummary.time}</p>
            <p><strong>Quantity:</strong> ${orderSummary.quantity}</p>
            <p><strong>Total Price:</strong> SGD ${(orderSummary.totalPrice / 100).toFixed(2)}</p>
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
