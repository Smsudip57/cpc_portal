import { NextResponse } from 'next/server';
import * as cookie from 'cookie';
import dbConnect from '@/connect/dbConnect'; 
import User from '@/models/user'; 
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const userToken = cookies.user ? cookies.user.split(';')[0] : null;

    if (!userToken) {
      return NextResponse.json(
        { success: false, message: 'Please log in.' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);  // Decodes the token and verifies it

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token.' },
        { status: 401 }
      );
    }
    const userId = decoded.userId;
    await dbConnect();
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found or token is invalid.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        name: user.name,
        role: user.role,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Error finding and validating user:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
