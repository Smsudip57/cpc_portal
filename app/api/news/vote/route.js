import News from '@/models/news';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from '@/connect/dbConnect';


export async function POST(req) {
  try {
      const { newsId, vote } = await req.json(); 
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
      const userId = String(decoded.userId);
      await dbConnect();
      const user = await User.findById(decoded.userId);
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 404 }
        );
      }

    const news = await News.findById(newsId); // Find the news by its ID

    if (!news) {
      return NextResponse.json({ success: false, message: 'News not found' }, { status: 404 });
    }

    console.log(news.upvotes, news.downvotes);

    // If the vote is false (downvote)
    if (vote) {
        // Handle upvote
        if (news.downvotes.includes(userId)) {
          // Remove from downvotes if user exists there
          news.downvotes = news.downvotes.filter(id => id.toString() !== userId.toString());
        }
        if (!news.upvotes.includes(userId)) {
          // Add to upvotes if not already present
          news.upvotes.push(userId);
        }
      } else {
        // Handle downvote
        if (news.upvotes.includes(userId)) {
          // Remove from upvotes if user exists there
          news.upvotes = news.upvotes.filter(id => id.toString() !== userId.toString());
        }
        if (!news.downvotes.includes(userId)) {
          // Add to downvotes if not already present
          news.downvotes.push(userId);
        }
      }
      
      // Save the updated news item
      await news.save();
      

    return NextResponse.json({ success: true, message: 'Vote updated successfully' });
  } catch (error) {
    console.error('Error during voting:', error);
    return NextResponse.json({ success: false, message: 'Failed to vote' }, { status: 500 });
  }
};
