import dbConnect from '@/connect/dbConnect'; // Your DB connection utility
import Event from '@/models/event';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Retrieve token from cookies
    const cookie = req.cookies.get('user')?.value || '';
    const token = cookie.split(';')[0].trim();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Decode JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 403 }
      );
    }

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 403 }
      );
    }

    // Retrieve ongoing events
    const events = await Event.find({
        end: { $gte: new Date() }, // Fetch events that haven't ended yet
      });
      
    // Filter events where the user is a participant
    const userEvents = events.filter(event =>
        
        event.participants.includes(decoded.userId)
      );

    if (userEvents.length > 0) {
      return NextResponse.json({ success: true, events: userEvents });
    }

    return NextResponse.json({ success: false, message: 'No ongoing events found for the user' });

  } catch (error) {
    console.error("Error fetching events:", error); // Log the actual error
    return NextResponse.json({
      success: false,
      message: "Failed to fetch events",
    }, { status: 500 });
  }
}
