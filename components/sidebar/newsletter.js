'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Loader from '../loader';
import EditNoteIcon from '@mui/icons-material/EditNote';

const NewsletterList = () => {
  const [newsletters, setNewsletters] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch newsletters from the API
    const fetchNewsletters = async () => {
      try {
        const res = await axios.get('/api/newsletter/getnewsletter', {  
          withCredentials: true,
         });
        setNewsletters(res.data?.newsletters); // Set newsletters data in state
        console.log(res.data?.newsletters);
      } catch (error) {
        setError('Error fetching newsletters');
        console.error('Error fetching newsletters:', error);
      }
    };
    fetchNewsletters();
  }, []);

if (!newsletters) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <h1 className="text-3xl font-bold text-center mb-8">Latest Newsletters</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {newsletters?.length === 0 && <p className="text-center">No newsletters found.</p>}
      <div className="space-y-6">
        {newsletters?.map((newsletter) => (
          <div key={newsletter?._id} className="bg-white p-6 shadow-md rounded-lg">
            {/* Profile section */}
            <div className="flex justify-between items-center mb-4">
              {newsletter?.createdBy?.profile && <div className="flex items-center">
                <img
                  src={newsletter?.createdBy?.profile?.avatarUrl === 'https://default-avatar-url.com' 
                    ? 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png' 
                    : newsletter?.createdBy?.profile?.avatarUrl}
                  alt={newsletter?.createdBy?.profile?.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <h2 className="text-lg font-semibold">{newsletter?.createdBy?.profile?.name}</h2>
              </div>}
              <p className="text-sm text-gray-500">{new Date(newsletter?.publishedAt).toLocaleDateString()}</p>
            </div>
            
            {/* Newsletter Title and Category */}
            <h2 className="text-2xl font-bold mb-4">{newsletter?.title}</h2>
            <p className="text-sm text-gray-700 mb-4">Category: {newsletter?.category}</p>

            {/* Image after the content */}
            {newsletter?.image && (
              <img
                src={newsletter?.image}
                alt="Newsletter Image"
                className="w-full border-[1px] border-[#BDE9C9] h-auto rounded-lg mb-4"
              />
            )}

            {/* Content */}
            <div className="text-base text-gray-800 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
              {newsletter?.content}
            </div>
          </div>
        ))}
      </div>

      {/* Create button */}
      <Link href="/portal/create-newsletter">
        <button className="fixed flex flex-col items-center bottom-8 right-8 bg-[#01AA4D] text-white p-3 rounded-xl shadow-lg hover:bg-blue-600 transition">
          <EditNoteIcon fontSize='medium'/>Create
        </button>
      </Link>
    </div>
  );
};

export default NewsletterList;
