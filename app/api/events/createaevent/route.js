import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import Event from '@/models/event';
import User from '@/models/user';  

const UPLOAD_DIR = path.join(process.cwd(), 'public'); 


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
    const file = formData.get('image'); 

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(UPLOAD_DIR, filename);


    const base64Image = buffer.toString('base64');

    const imgbbApiKey = "6814e6d7dce22366f1b8183031526a91"; 
    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: new URLSearchParams({
        image: base64Image, 
        name: file.name.split('.')[0], 
      }),
    });
    

    const imgbbData = await imgbbResponse.json();

    if (!imgbbData.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to upload image to ImgBB' },
        { status: 500 }
      );
    }

    const imageUrl = imgbbData.data.url;

  

    console.log(start, end, lastdate);
        
    function validateDates(start, end, lastdate) {
      const today = new Date();
      const startDate = new Date(start);
      const endDate = new Date(end);
      const lastDate = new Date(lastdate);

      if (endDate < today) return false;
      if (startDate <= endDate) return false;
      if (lastDate <= startDate) return false;

      return true;
    }

    if (!validateDates(start, end, lastdate)) {
      return NextResponse.json(
        { success: false, message: 'Invalid date range' },
        { status: 400 }
      );
    }

    
    const newEvent = new Event({
      title,
      description,
      start,
      end:lastdate,
      teamMembers,
      regFee,
      lastdate:end,
      image: imageUrl,
      createdBy: decoded.userId, 
    });

    await newEvent.save();
    console.log(newEvent);

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      imageUrl, 
    });
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
