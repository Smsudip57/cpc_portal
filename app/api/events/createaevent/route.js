import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import Event from '@/models/event';
import User from '@/models/user';  // Your Event model

// Directory to save uploaded files
const UPLOAD_DIR = path.join(process.cwd(), 'public'); 

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const POST = async (req) => {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const start = formData.get('start');
    const end = formData.get('end');
    const lastdate = formData.get('lastdate');
    const teamMembers = formData.get('teamMembers');
    const regFee = formData.get('regFee');
    const file = formData.get('image'); // Assuming the file field is named 'image'

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
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
    }
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 403 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user || !(user.role === 'admin' || user.role === 'moderator')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 404 }
      );
    }

    // Save the uploaded file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Write the file to the server
    fs.writeFileSync(filePath, buffer);

    // Construct the file URL (relative to the public folder)
    const imageUrl = `/${filename}`;

    // Create and save the new event in the database
    const newEvent = new Event({
      title,
      description,
      start,
      end,
      teamMembers,
      regFee,
      lastdate,
      image: imageUrl, // Store the image URL
      createdBy: decoded.userId,  // Use the userId from the decoded JWT
    });

    await newEvent.save();

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      imageUrl,  // Return the image URL in the response
    });
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
