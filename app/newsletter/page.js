'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/navbar';

const NewsletterPage = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get('/api/newsletter/getnewsletter');
        setNewsletters(response.data.newsletters);
        setFilteredNewsletters(response.data.newsletters); // By default, show all newsletters
        
        // Extract categories from the newsletters
        const allCategories = ['All', ...new Set(response.data.newsletters.map(newsletter => newsletter.category))];
        setCategories(allCategories);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      }
    };
    fetchNewsletters();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredNewsletters(newsletters);
    } else {
      const filtered = newsletters.filter(newsletter => newsletter.category === selectedCategory);
      setFilteredNewsletters(filtered);
    }
  }, [selectedCategory, newsletters]);

  return (
    <div className='mx-auto text-black'>
        <Navbar/>
      <div className='max-w-6xl mx-auto p-6 relative'>
      <div className="flex pt-16 justify-center">
        {/* Left Side: Category Selector */}
        <div className="w-1/4 p-4 bg-gray-100 h-max">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer py-2 px-4 rounded hover:bg-gray-200 ${category === selectedCategory ? 'bg-gray-300' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Newsletters Display */}
        <div className="w-3/4 p-4">
          <h3 className="text-xl font-semibold mb-4">Newsletters</h3>
          <div className="flex flex-col gap-6">
            {filteredNewsletters.map((newsletter) => (
              <div key={newsletter._id} className="border w-full p-8 rounded-lg shadow-md">
                <h4 className="text-2xl font-semibold">{newsletter.title}</h4>
                <div className='flex justify-between items-center py-6'>
                    <div className='flex justify-center items-center gap-1'>
                    <img
                  src={newsletter?.createdBy?.profile?.avatarUrl === 'https://default-avatar-url.com' 
                    ? 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png' 
                    : newsletter?.createdBy?.profile?.avatarUrl}
                  alt={newsletter?.createdBy?.profile?.name}
                  className="w-8 h-8 rounded-full mr-4"
                />
                <p className="text-sm text-gray-600">{newsletter.createdBy.profile.name}</p>
                    </div>
                <div className="mt-2 text-sm text-gray-500">Published on {new Date(newsletter.publishedAt).toLocaleDateString()}</div>
                {console.log(newsletter)}
                </div>
                <img src={newsletter?.image} alt={newsletter.title} className="w-full mb-4" />
                <p className='p-4' style={{whiteSpace: 'pre-wrap'}}>{newsletter.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
