import dbConnect from '@/connect/dbConnect'; // Your DB connection utility
import Event from '@/models/event'; // Your Event model
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import * as cookie from 'cookie';

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();

    const cookie = req.cookies.get('user')?.value;
    if (!cookie) {
    }

    // // const token = cookie.split(';')[0].trim();
    // if (!token) {
     
    // }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('JWT verification error:', error);
      // return NextResponse.json(
      //   { success: false, message: 'Invalid token' },
      //   { status: 403 }
      // );
    }

    // const user = await User.findById(decoded.userId);
    // if (!user || user.role !== 'user') {
    //   return NextResponse.json(
    //     { success: false, message: 'Access denied' },
    //     { status: 403 }
    //   );
    // }

    // Fetch events where endDate has passed
    const pastEvents = await Event.find({ end: { $lt: new Date() } })
      .sort({ end: -1 }); // Sort by endDate in descending order

    if (pastEvents.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No past events found',
      }, { status: 404 });
    }

    // Return the past events in the response
    return NextResponse.json({
      success: true,
      events: pastEvents,
    });
  } catch (error) {
    console.error('Error fetching past events:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch past events',
    }, { status: 500 });
  }
};
