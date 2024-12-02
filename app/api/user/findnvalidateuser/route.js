import { NextResponse, NextRequest } from 'next/server';
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
        { success: false },
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
      const response = NextResponse.json(
        { success: false, message: 'User not found or token is invalid.' },
        { status: 404 }
      );
      // response.cookies.set('user', '', {
      //   httpOnly: true, 
      //   secure: true, 
      //   sameSite: 'Strict', 
      //   maxAge: 0, 
      //   path: '/',
      // });
      return response;
    }

    return NextResponse.json({
      success: true,
      data: {
        name: user.profile.name,
        role: user.role,
        email: user.email,
        avatarUrl: user.profile.avatarUrl
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
