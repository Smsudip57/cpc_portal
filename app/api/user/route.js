import dbConnect from '@/connect/dbConnect';
import User from '@/models/user'; // Assume you have a User model
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();

  try {
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}