import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbConnect'; 
import User from '@/models/user'; 
import jwt from 'jsonwebtoken'; 

export async function GET(req) {
  try {
    // Check for the cookie
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
    let users


    // Fetch all users
    await dbConnect();
    if(user.role === 'admin'){
      users = await User.find({}).select('-password'); // Exclude password field
    }else{
      users = await User.find({role: 'user'}).select('-password'); // Exclude password field
    }

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users', error: error.message }, { status: 500 });
  }
}
