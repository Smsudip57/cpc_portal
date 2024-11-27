import { NextResponse } from 'next/server';
import cookie from 'cookie'; 

export async function GET() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  
  response.cookies.set('user', '', {
    httpOnly: true, 
    secure: true, 
    sameSite: 'Strict', 
    maxAge: 0, 
    path: '/',
  });

  return response;
}
