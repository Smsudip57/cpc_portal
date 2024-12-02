import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import Event from '@/models/event';
import Stripe from 'stripe';// Ensure you have Stripe initialized
import dbConnect from '@/connect/dbConnect';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
  });

export async function POST(req) {
  const body = await req.json();

  try {
    await dbConnect();

    // Get the userId from JWT token in the request cookies
    const cookie = req.cookies.get('user').value || null; 
    const token = cookie.split(';')[0].trim();
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user data and check if the role is guest
    const user = await User.findById(userId);
    if (user.role === 'guest') {
      return NextResponse.json({ message: 'Guests cannot register for events' }, { status: 403 });
    }

    // Find the event by eventId
    const {eventId,...members} = body;
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const { regFee } = event;

    const participantIds = [];

    // Loop through each member in the formData
    for (const key in members) {
      const member = members[key];

      // Find user in the database by roll number (or any unique field, if needed)
      const participant = await User.findOne({
        'profile.roll': member.roll, 
        'profile.batch': { $regex: new RegExp(`^${member.batch}$`, 'i') },
        'profile.department': { $regex: new RegExp(`^${member.department}$`, 'i') },
        'profile.name': { $regex: new RegExp(`^${member.name}$`, 'i') },
      });
      
      if (!participant) {
        return NextResponse.json({ success: false, message: `Member ${member.name} not found` }, { status: 404 });
      }

      participantIds.push(participant._id);
    }

    // If there's a registration fee, create a Stripe checkout session
    if (regFee > 0) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'BDT',
              product_data: {
                name: 'Member Registration', 
              },
              unit_amount: regFee * 100, 
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
        metadata: {
          userId: user._id.toString(),
          Details: JSON.stringify({ 
            type:'event',
            eventId: event._id.toString(),
            data: participantIds
          }), 
        },
      });

      return NextResponse.json({ url: session.url });
    } else {
      return NextResponse.json({ message: 'Invalid registration fee' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
