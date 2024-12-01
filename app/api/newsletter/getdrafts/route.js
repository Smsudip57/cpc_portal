import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbConnect'; // Database connection utility
import Newsletter from '@/models/newsletter'; // Newsletter model
import User from '@/models/user'; // User model
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract and verify the user token from cookies
    const cookie = req.cookies.get('user')?.value || '';
    const token = cookie.split(';')[0]?.trim();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided.' },
        { status: 401 }
      );
    }

    // Verify the JWT token
    let decodedUser;
    try {
      decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification error:', err);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token.' },
        { status: 403 }
      );
    }

    if (!decodedUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token.' },
        { status: 403 }
      );
    }

    // Fetch the user from the database
    const user = await User.findById(decodedUser.userId);

    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Insufficient permissions.' },
        { status: 403 }
      );
    }

    // Fetch all newsletters in draft status
    const drafts = await Newsletter.find({ status: 'Draft' }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, message: 'Draft newsletters retrieved successfully.', drafts },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching draft newsletters:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch draft newsletters.', error: err.message },
      { status: 500 }
    );
  }
}
