import dbConnect from '@/connect/dbConnect'; // Your DB connection utility
import Event from '@/models/event'; // Your Event model
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';


export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();
    const cookie = req.cookies.get('user').value;
    const token = cookie.split(';')[0].trim();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('JWT verification error:', error);
    }
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 403 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user || !(user.role === 'admin' || user.role === 'moderator' || user.role === 'user')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 404 }
      );
    }

    // Fetch all events from the database, sorted by start date
    const events = await Event.find({}).sort({ createdAt: -1 }); 


    // If no events are found
    if (events.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No events found",
      }, { status: 404 });
    }

    // Return the events in the response
    return NextResponse.json({
      success: true,
      events: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch events",
    }, { status: 500 });
  }
};
