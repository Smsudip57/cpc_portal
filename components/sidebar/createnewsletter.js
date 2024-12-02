'use client';

import { useState, useContext } from 'react';
import { MyContext } from '@/context/context';
import axios from 'axios';

const CreateNewsletter = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: null, // Optional image file
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const context = useContext(MyContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const formBody = new FormData();
      formBody.append('title', formData.title);
      formBody.append('content', formData.content);
      formBody.append('category', formData.category);
      if (formData.image) {
        formBody.append('image', formData.image);
      }

      const res = await axios.post('/api/newsletter/postnewsletter', formBody, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      context.customToast(res.data);

      if (res.data?.success) {
        setMessage('Newsletter created successfully!');
        setFormData({
          title: '',
          content: '',
          category: '',
          image: null,
        });
      } else {
        setMessage(`Error: ${res.data?.message}`);
      }
    } catch (error) {
      console.error('Error creating newsletter:', error);

      context.customToast(error?.response?.data);

      if (error?.response?.data) {
        context.customToast(error?.response?.data);
        setMessage(`Error: ${error?.response?.data?.message}`);
      } else {
        const unknownError = { message: 'An unknown error occurred.' };
        context.customToast(unknownError);
        setMessage(unknownError?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-center mb-6">Create Newsletter</h1>
      {message && <p className={`text-center mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="4"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            style={{ whiteSpace: 'pre-wrap' }} // Preserve newlines
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image:</label>
          <input
            type="file"
            required
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isLoading ? 'Submitting...' : 'Create Newsletter'}
        </button>
      </form>
    </div>
  );
};

export default CreateNewsletter;
