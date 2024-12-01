import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbConnect';  // Your database connection utility
import Newsletter from '@/models/newsletter'; // The Newsletter model
import User from '@/models/user'; // The User model

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch newsletters and populate the 'createdBy' field with user details (name and profile picture)
    const newsletters = await Newsletter.find({ publishedAt: { $ne: null } })
  .populate('createdBy', 'profile.name profile.avatarUrl')  // Populate profile.name and profile.avatarUrl
  .sort({ publishedAt: -1 });// Optionally, you can sort newsletters by creation date
//  console.log(newsletters);
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
