'use client';

import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { MyContext } from '@/context/context';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const context = useContext(MyContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events/getpastevent',{ withCredentials: true }); // Replace with the correct route
        context.customToast(response.data);
        if (response.data.success) {
          setEvents(response.data.events);
        } else {
          console.error('No events found:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        context.customToast(error.response.data);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 text-stone-700 min-h-screen">
      <h1 className="text-xl lg:text-3xl font-bold text-center mb-8">Past Events</h1>
      {events.length === 0 ? (
        <p className="text-center text-gray-500">No past events found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white w-full rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={event.image}
                alt={event.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <div className="relative">
                    <p
                      className={`text-gray-600 mt-2 ${
                        isExpanded ? "" : "line-clamp-3"
                      }`}
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: isExpanded ? "none" : 3,
                        whiteSpace: "pre-wrap", // Ensures text formatting is preserved
                      }}
                    >{event.description}</p>
                    {event.description.length > 100 && ( // Adjust length threshold if needed
                      <button
                        onClick={toggleExpanded}
                        className="text-blue-500 mt-1 text-sm"
                      >
                        {isExpanded ? "See less" : "See more"}
                      </button>
                    )}
                  </div>
                <div className='flex mt-4 justify-start gap-5 items-center'>
                <p className="text-sm text-gray-500">
                  Start: {new Date(event.start).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  End: {new Date(event.end).toLocaleDateString()}
                </p>
                  </div>  
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      <Footer/>

    </div>
  );
};

export default EventsPage;
