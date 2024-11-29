import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/connect/dbConnect';
import User from '@/models/user'; 
import jwt from 'jsonwebtoken';  
 

export async function POST(req) {
  try {
    const { email, password, role, name } = await req.json();
    if(!email || !password ) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });}
    await dbConnect();

    const token = req.cookies.get('user');
    if (!token && (role === 'admin' || role === 'moderator')) {
      return NextResponse.json({ success: false, message: 'Authorization required' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
    }
    let currentUser;
    if (decoded) {
      currentUser = await User.findById(decoded.userId);
    }
    if((currentUser && currentUser.role === 'admin') &&(!email || !password || !role || !name)) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });}
    await dbConnect();
    if ((!currentUser || currentUser.role !== 'admin') && (role === 'admin' || role === 'moderator')) {
      return NextResponse.json({ success: false, message: 'Only admins can create admins or moderators' }, { status: 403 });
    }

    
    let actualRole
    if(role !== 'admin' && role !== 'moderator'){
        actualRole = 'guest';
    }else{
        actualRole = role;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      role:actualRole,
      name
    });

    await newUser.save();

    let usertoken
    if(role !== 'admin' && role !== 'moderator'){
        usertoken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    }

    const response = NextResponse.json({
        success: true,
        message: `${newUser.role} has been created successfully`,    
        data: { name: newUser.name, email: newUser.email, role: newUser.role },
      });
  
      if(usertoken){
        response.cookies.set('user', `${usertoken}; HttpOnly; Path=/; Max-Age=2592000; Secure; SameSite=Strict`);
      }
  
      return response;

  } catch (error) {
    console.error("Error creating user:", error.stack);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
