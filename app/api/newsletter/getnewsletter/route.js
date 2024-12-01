import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbConnect';  // Your database connection utility
import Newsletter from '@/models/newsletter'; // The Newsletter model
import User from '@/models/user'; // The User model
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();
    let userId;
    const cookie = req.cookies.get('user').value;
      const token = cookie.split(';')[0].trim();
      if (token) {
        let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.error('JWT verification error:', error);
      }
      if (decoded) {
      const user = await User.findById(decoded.userId);
      if (user) {
        userId = String(user._id)
      }
      }
      }
  
      

    // Fetch newsletters and populate the 'createdBy' field with user details (name and profile picture)
    const newsletters = await Newsletter.find({ publishedAt: { $ne: null } })
  .populate('createdBy', 'profile.name profile.avatarUrl')  // Populate profile.name and profile.avatarUrl
  // .sort({ publishedAt: -1 });// Optionally, you can sort newsletters by creation date

    return NextResponse.json({
      success: true,
      newsletters,
    }, {
      headers: {
        'Cache-Control': 'no-store', // This tells Vercel to not cache the response
      },
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch newsletters.', error: error.message },
      { status: 500 }
    );
  }
}
