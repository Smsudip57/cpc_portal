import { NextResponse } from 'next/server';
import * as cookie from 'cookie'; 
import dbConnect from '@/connect/dbConnect';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { Details } from '@mui/icons-material';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export async function POST(req) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const userToken = cookies.user ? cookies.user.split(';')[0] : null;
    if (!userToken) {
      return NextResponse.json(
        { success: false, message: 'Please log in.' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(userToken, process.env.JWT_SECRET); 
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid or expired token.' }),
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found!' },
        { status: 404 }
      );
    }
    console.log(user);
    if (user.role !== 'guest') {
      return NextResponse.json(
        { success: false, message: 'Only guests can convert to users.' },
        { status: 403 }
      );
    }

    // Parse the body of the request
    const { name, batch, roll, department } = await req.json();

    // Check if all fields are provided
    if (!name || !batch || !roll || !department) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Update user details
    user.profile.name = name;
    user.profile.batch = batch;
    user.profile.roll = roll;
    user.profile.department = department;
    await user.save();
    

    // Create a Stripe Payment Session (example)
    const paymentSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'BDT',
            product_data: {
              name: 'Member Registration', 
            },
            unit_amount: 10000, 
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
          type:'member',
        }), 
      },
    });


    return NextResponse.json({
      success: true,
      message: 'User updated successfully.',
      paymentUrl: paymentSession.url,
    });
  } catch (error) {
    console.error('Error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
