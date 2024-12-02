import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbConnect';
import Event from '@/models/event';
import News from '@/models/news';
import Newsletter from '@/models/newsletter';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const cookie = req.cookies.get('user')?.value || '';
    const token = cookie.split(';')[0]?.trim();

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    let decodedUser;
    try {
      decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 403 });
    }

    // Connect to DB
    await dbConnect();

    // Fetch data from models
    const events = await Event.find().select('createdAt').lean();
    const news = await News.find().select('createdAt').lean();
    const newsletters = await Newsletter.find().select('publishedAt').lean();

    // Add type attribute and combine all data
    const combinedData = [
      ...events.map(event => ({ ...event, type: 'event' })),
      ...news.map(newsItem => ({ ...newsItem, type: 'news' })),
      ...newsletters.map(newsletter => ({ ...newsletter, type: 'newsletter' }))
    ];

    // Sort combined data
    const sortedData = combinedData.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
      return 0;
    });

    return NextResponse.json({ data: sortedData });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
