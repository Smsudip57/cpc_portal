import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import User from '@/models/user';
import dbConnect from '@/connect/dbConnect';
import Event from '@/models/event';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

export async function POST(request) {
    const sig = request.headers.get('stripe-signature');
    const body = await request.text();

    let event;

    try {
        event = stripe.webhooks.constructEvent
            (body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
    const { type, data } = event;

    // Handle the event
    switch (type) {
        case 'checkout.session.completed':
          const paymentIntent = data.object; 
          const transactionId = paymentIntent.payment_intent; 
          const metadata = paymentIntent.metadata; 
  
          if(metadata && metadata.userId) {
            const details = JSON.parse(metadata.Details);
  
          console.log('Payment succeeded:', transactionId);
  
          if (details.type === 'member') {
            await dbConnect();
            const user = await User.findOne({ _id: metadata.userId });
            console.log(user);
            await User.findOneAndUpdate(
              { _id: metadata.userId },
              { payment: {
                status: 'paid',
                transactionId: transactionId
              },
              role: 'user',
              profile: {
                cpc_id: Math.floor(100000 + Math.random() * 900000).toString()
              }
              },
            );
          }else if (details.type === 'event') {
            await dbConnect();
            const event = await Event.findOne({ _id: details.eventId });
            if (Array.isArray(event?.participants)) {
              event.participants = [...new Set([...event.participants, ...details.data])];
            } else {
              event.participants = [...new Set([...details.data])];
            }
            await event.save();
          }
          }
            break;
    }

    return NextResponse.json({ received: true });
}