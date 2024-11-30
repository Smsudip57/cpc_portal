import News from '@/models/news'; // Adjust the import if needed
import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbConnect';  
import User from '@/models/user';
import jwt from 'jsonwebtoken';

export const GET = async (req) => {
  try {
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
  
      
    // Fetch all news articles from the database and sort by createdAt
    const news = await News.find().sort({ createdAt: -1 }); // Adjust sorting as needed
    return NextResponse.json({news, userId});
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch news' },
      { status: 500 }
    );
  }
};
