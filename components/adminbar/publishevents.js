'use client';

import React, { useState,useContext } from 'react';
import axios from 'axios';
import { MyContext } from '@/context/context';


export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    teamMembers: '',
    regFee: '',
    lastdate: '',
  });
// const [formData, setFormData] = useState({
//     title: 'Sample Event Title',
//     description: `This is a sample event description that goes into more detail. 
//     This event will focus on team-building activities, workshops, and lectures designed to enhance communication, 
//     problem-solving skills, and leadership within teams. 
//     We will have multiple sessions on topics such as effective team collaboration, 
//     time management, conflict resolution, and strategic planning. 
//     The event will include interactive activities like role-playing exercises, 
//     group discussions, and challenges that require creative thinking and collaboration.
  
//     Special guest speakers from various industries will also join to share their experiences and insights. 
//     The event is designed for individuals looking to enhance their teamwork abilities, 
//     improve their leadership skills, and network with like-minded professionals. 
//     A networking lunch will be provided where attendees can interact with each other and the speakers. 
  
//     Date: 10th December 2024. The event will start at 10:00 AM and conclude by 12:00 PM. 
//     Please ensure to register by the end of this week to secure your spot. 
//     We have a limited number of spots available and registration fees are ₹100 per participant.`,
//     start: '2024-12-10T10:00',  // ISO 8601 format date-time
//     end: '2024-12-10T12:00',    // ISO 8601 format date-time
//     teamMembers: '5',            // Example team size
//     regFee: '100',
//     lastdate: '2024-12-10T12:00',               // Example registration fee
//   });
  
  
  const [image, setImage] = useState(null); 
  const [message, setMessage] = useState('');
  const context = useContext(MyContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      const response = await axios.post('/api/events/createaevent', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      context.customToast(response.data);

      if (response.data.success) {
        setMessage('Event created successfully!');
        setFormData({
          title: '',
          description: '',
          start: '',
          end: '',
          teamMembers: '',
          regFee: '',
        });
        setImage(null);
      } else {
        setMessage(response.data.message || 'Failed to create event');
      }
    } catch (error) {
      context.customToast(error.response.data);
      console.error(error);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='w-full bg-[#BDE9C9] rounded-lg py-6'>
        <p class="text-xl font-mono w-full font-semibold pt-2 text-center">Create Event</p>
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-md bg-[#4ADE80]">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="datetime-local"
            name="start"
            value={formData.start}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="datetime-local"
            name="lastdate"
            value={formData.lastdate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Last Date</label>
          <input
            type="datetime-local"
            name="end"
            value={formData.end}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Team Members</label>
          <input
            type="number"
            name="teamMembers"
            value={formData.teamMembers}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Registration Fee</label>
          <input
            type="number"
            name="regFee"
            value={formData.regFee}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
    </div>
  );
}
