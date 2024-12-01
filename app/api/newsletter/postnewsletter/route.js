import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbConnect';
import Newsletter from '@/models/newsletter'; // Import the Newsletter model
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.formData();
    const title = body.get('title');
    const content = body.get('content');
    const category = body.get('category');
    const file = body.get('image');
    
    // Validate fields
    if (!title || !content || !category) {
      return NextResponse.json({ success: false, message: 'Title, content, and category are required.' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    const cookie = req.cookies.get('user')?.value || '';
    const token = cookie.split(';')[0]?.trim();
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No token provided.' }, { status: 401 });
    }

    let decodedUser;
    try {
      decodedUser = jwt.verify(token, process.env.JWT_SECRET); 
    } catch (err) {
      console.error('JWT verification error:', err);
      return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 403 });
    }

    if (!decodedUser) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 403 });
    }

    const user = await User.findById(decodedUser.userId);
    if (!user || user.role === 'guest') {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    // Save the uploaded file
    const buffer = Buffer.from(await file.arrayBuffer());
    // const filename = `${Date.now()}-${file.name}`;
    // const filePath = path.join(UPLOAD_DIR, filename);


    //uploading to imgbb
    const base64Image = buffer.toString('base64');

    const imgbbApiKey = "6814e6d7dce22366f1b8183031526a91"; // Add your ImgBB API key to environment variables
    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: new URLSearchParams({
        image: base64Image, // Base64 string
        name: file.name.split('.')[0], // Optional: Name of the image
      }),
    });
    

    const imgbbData = await imgbbResponse.json();

    if (!imgbbData.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to upload image to ImgBB' },
        { status: 500 }
      );
    }

    const imageUrl = imgbbData.data.url; // Get the image URL from ImgBB

    // Write the file to the server
    // fs.writeFileSync(filePath, buffer);

    // Construct the file URL (relative to the public folder)
    // const imageUrl = `/${filename}`;

    // Create the newsletter entry
    const newNewsletter = new Newsletter({
      title,
      content,
      category,
      image: imageUrl || null,
      status: 'Draft', // Save as draft
      createdBy: decodedUser.userId,
    });

    await newNewsletter.save();

    return NextResponse.json({
      success: true,
      message: 'Newsletter created successfully!',
      newsletter: newNewsletter,
    }, { status: 201 });
  } catch (err) {
    console.error('Error creating newsletter:', err.stack);
    return NextResponse.json({ success: false, message: 'Failed to create newsletter.', error: err.message }, { status: 500 });
  }
}
