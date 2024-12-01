import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import News from '@/models/news';
import User from '@/models/user'; // Your User model

export async function DELETE(req) {
  try {
      console.log(req.body);
    const body = await req.json();

    const {NewsId} =  body
    if (!NewsId) {
      return NextResponse.json(
        { success: false, message: 'News ID is required' },
        { status: 400 }
      );
    }

    // Handle authentication and extract user info from token
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
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 403 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user || !(user.role === 'admin' || user.role === 'moderator')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Find the News to delete
    const news = await News.findById(NewsId);
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News not found' },
        { status: 404 }
      );
    }

    // Delete the News's file from the server
    // if (News.image) {
    //   const filePath = path.join(process.cwd(), 'public', News.image);
    //   if (fs.existsSync(filePath)) {
    //     fs.unlinkSync(filePath); // Remove the file
    //   } else {
    //     console.warn('File not found:', filePath);
    //   }
    // }

    // Delete the News from the database
    await News.findByIdAndDelete(NewsId);

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (error) {
    console.error('News deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete News' },
      { status: 500 }
    );
  }
};
