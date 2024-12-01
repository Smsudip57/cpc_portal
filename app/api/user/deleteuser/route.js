import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/connect/dbConnect';
import User from '@/models/user';

export async function DELETE(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Get user token from cookies
    const cookie = req.cookies.get('user')?.value || '';
    const token = cookie.split(';')[0]?.trim();
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    // Decode token to get current user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.userId;

    // Fetch current user from database
    const currentUser = await User.findById(currentUserId);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Only admins can delete users' }, { status: 403 });
    }

    // Parse request body to get the user ID to delete
    const body = await req.json();
    const { userId } = body;

    if (userId === currentUserId) {
      return NextResponse.json({ success: false, message: 'You cannot delete yourself' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Find and delete the user
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    await userToDelete.deleteOne();

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
