import Stripe from 'stripe';
import { buffer } from 'micro';
import dbConnect from '@/connect/dbConnect';
import User from '@/models/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Parse the raw body and verify the signature
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // Your webhook secret from Stripe dashboard
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  const { type, data } = event;

  try {
    await dbConnect(); // Connect to your database

    switch (type) {
      case 'payment_intent.succeeded':
        const paymentIntent = data.object; // The payment intent object
        const transactionId = paymentIntent.id; // The Stripe transaction ID
        const metadata = paymentIntent.metadata; // Metadata attached to the payment

        const details = JSON.parse(metadata.Details);
    
        console.log('Payment succeeded:', transactionId);
        console.log('Metadata:', metadata);

        if(details.type === 'member'){
          await User.findOneAndUpdate(
            { _id: metadata.userId },
            { 
              payment: {
                status: 'paid',
                transactionId: transactionId,
              },
              role: 'user'
            }
          );
        }

        break;
    }
    res.status(200).send('Event processed');
  } catch (err) {
    console.error('Error handling webhook event:', err.message);
    res.status(500).send('Internal server error');
  }
}
