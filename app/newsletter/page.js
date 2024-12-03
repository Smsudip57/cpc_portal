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
    <div className="text-black pt-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side: Category Selector */}
          <div className="md:w-1/4 w-full p-4 h-max bg-gray-100 rounded-lg shadow-sm">
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
          <div className="md:w-3/4 w-full">
            <h3 className="text-xl font-semibold mb-4">Newsletters</h3>
            <div className="flex flex-col gap-6">
              {filteredNewsletters.map((newsletter) => (
                <div key={newsletter._id} className="border p-4 md:p-8 rounded-lg shadow-md flex flex-col">
                  <h4 className="text-lg md:text-2xl font-semibold mb-2">{newsletter.title}</h4>
                  <div className="flex items-center gap-2 my-6">
                    <img
                      src={newsletter?.createdBy?.profile?.avatarUrl === 'https://default-avatar-url.com'
                        ? 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png'
                        : newsletter?.createdBy?.profile?.avatarUrl}
                      alt={newsletter?.createdBy?.profile?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <p className="text-sm text-gray-600">{newsletter.createdBy.profile.name}</p>
                  </div>
                  <img src={newsletter?.image} alt={newsletter.title} className="w-full h-40 object-cover rounded-md mb-4" />
                  <p className="text-sm text-gray-500 my-4">Published on {new Date(newsletter.publishedAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700 flex-grow" style={{ whiteSpace: 'pre-wrap' }}>
                    {newsletter.content}
                  </p>
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
