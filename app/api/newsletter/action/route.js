import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/connect/dbConnect'; // Your database connection utility
import Newsletter from '@/models/newsletter'; // Newsletter model
import User from '@/models/user'; // User model

export async function POST(req) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    // Step 2: Parse the request body
    const { id, action } = await req.json();

    // Step 3: Verify the JWT token from cookies
    const cookie = req.cookies.get('user')?.value || '';
    const token = cookie.split(';')[0]?.trim();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. No token provided.' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Invalid token.' },
        { status: 401 }
      );
    }

    // Step 4: Check if the user is an admin
    const user = await User.findById(decoded.userId);
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admins only.' },
        { status: 403 }
      );
    }

    // Step 5: Find the newsletter
    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      return NextResponse.json(
        { success: false, message: 'Newsletter not found.' },
        { status: 404 }
      );
    }

    // Step 6: Perform the action
    if (action) {
      // Publish the newsletter
      newsletter.publishedAt = new Date();
      newsletter.status = 'Published';
      await newsletter.save();
      return NextResponse.json({
        success: true,
        message: 'Newsletter published successfully.',
      });
    } else {
      // Delete the newsletter
      await Newsletter.findByIdAndDelete(id);
      return NextResponse.json({
        success: true,
        message: 'Newsletter deleted successfully.',
      });
    }
  } catch (error) {
    console.error('Error managing newsletter:', error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
