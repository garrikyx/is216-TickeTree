import express from 'express';
import stripePackage from 'stripe';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.resolve('dist')));

app.post('/create-checkout-session', async (req, res) => {
  const { quantity, price, customerEmail } = req.body; 
  const imageUrl = 'https://via.placeholder.com/150'; 

  try {
    // Create a customer in Stripe
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
      customer: customer.id, // Use the created customer ID
      allow_promotion_codes: true,
    });

    console.log(session);  // Log for debugging
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
      expand: ['line_items.data.price.product', 'customer'], // Expand the customer object
    });

    // Log to check if customer_email is present
    console.log("Session Details:", session);

    res.json({
      customer_email: session.customer.email, // Access email from the customer object
      line_items: session.line_items,
      amount_total: session.amount_total,
    });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    res.status(500).json({ error: "Failed to retrieve checkout session" });
  }
});



/*
app.get('/success', (req, res) => {
  const sessionId = req.query.session_id;
  if (sessionId) {
    res.redirect(`http://localhost:5173/success?session_id=${sessionId}`);
  } else {
    res.status(400).send("Session ID is missing.");
  }
});

app.get('/error', (req, res) => {
  const errorMessage = req.query.error || "Payment was cancelled or failed.";
  res.redirect(`http://localhost:5173/error?message=${encodeURIComponent(errorMessage)}`);
});
*/

app.listen(3000, () => console.log('Backend server running on port 3000'));
