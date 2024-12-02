import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbConnect';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

export async function PUT(req) {
  try {
    // Parse form data
    const body = await req.formData();
    const name = body.get('name');
    const bio = body.get('bio');
    const contact = body.get('contact');
    const avatarFile = body.get('avatar'); // Optional file input
    // Validate input
    // console.log(name, bio, contact, avatarFile);
    if (contact && isNaN(contact)) {
      return NextResponse.json(
        { success: false, message: 'Invalid contact number.' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Authenticate user
    const cookie = req.cookies.get('user')?.value || '';
    const token = cookie.split(';')[0]?.trim();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided.' },
        { status: 401 }
      );
    }

    let decodedUser;
    try {
      decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification error:', err);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token.' },
        { status: 403 }
      );
    }

    if (!decodedUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token.' },
        { status: 403 }
      );
    }

    const userId = decodedUser.userId;

    // Get the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    // Upload image if provided
    let avatarUrl = user.profile.avatarUrl; // Retain existing avatar
    if (avatarFile) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const base64Image = buffer.toString('base64');

      const imgbbApiKey = process.env.IMGBB_API_KEY;
      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=6814e6d7dce22366f1b8183031526a91`,
        {
          method: 'POST',
          body: new URLSearchParams({
            image: base64Image,
            name: avatarFile.name.split('.')[0],
          }),
        }
      );

      const imgbbData = await imgbbResponse.json();
      if (imgbbData.success) {
        avatarUrl = imgbbData.data.url;
      } else {
        console.error('Image upload failed:', imgbbData);
        return NextResponse.json(
          { success: false, message: 'Image upload failed.' },
          { status: 500 }
        );
      }
    }

    // Update the user profile
    const updatedFields = {
      ...(name && { 'profile.name': name }),
      ...(bio && { 'profile.bio': bio }),
      ...(contact && { 'profile.contact': Number(contact) }),
      ...(avatarUrl && { 'profile.avatarUrl': avatarUrl }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully.',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating profile:', err);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
