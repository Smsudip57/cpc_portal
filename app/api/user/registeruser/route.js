import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/connect/dbConnect';
import User from '@/models/user'; 
import jwt from 'jsonwebtoken';  
 

export async function POST(req) {
  try {
    const { email, password, role, name, department, roll, batch } = await req.json();
    if(!email || !password ) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });}
    await dbConnect();

    const cookie = req.cookies.get('user')?.value || '';
    const token = cookie.split(';')[0]?.trim();
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


      let cpcId
      if(currentUser && currentUser.role === 'admin' ){
        cpcId = Math.floor(100000 + Math.random() * 900000).toString();
      }
      if ((!currentUser || currentUser.role !== 'admin') && (role === 'admin' || role === 'moderator')) {
        return NextResponse.json({ success: false, message: 'Only admins can create admins or moderators' }, { status: 403 });
      }else{
        
      }
      
      
    let actualRole
      if(currentUser && currentUser.role === 'admin'){
        actualRole = role;
      }else{
        actualRole = 'guest';
      }
    // if(role !== 'admin' && role !== 'moderator'){
    //     actualRole = 'guest';
    // }else{
    //     actualRole = role;
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: actualRole,
      profile: {
        name,
        department,
        roll,
        batch,
        cpc_id: cpcId
      },
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
  
      if(usertoken && !cpcId){
        response.cookies.set('user', `${usertoken}; HttpOnly; Path=/; Max-Age=2592000; Secure; SameSite=Strict`);
      }
  
      return response;

  } catch (error) {
    console.error("Error creating user:", error.stack);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
