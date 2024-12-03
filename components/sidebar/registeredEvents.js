import React, { useState, useEffect, useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import Image from "next/image";
import axios from "axios"; 
import { MyContext } from "@/context/context";
import { Button } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Loader from "../loader";
import { useRouter } from "next/navigation";

const EventList = () => {
  const { user } = useContext(MyContext); 
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null); 
  const [formData, setFormData] = useState({});
  const context = useContext(MyContext);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };


useEffect(() => {
  const selectedEvent = events.find((event) => event._id === selectedEventId);
  if (selectedEvent) {
    const initialFormData = Array.from({ length: selectedEvent.teamMembers }).reduce(
      (acc, _, i) => {
        acc[`member-${i + 1}`] = { name: "", roll: "", batch: "", department: "" };
        return acc;
      },
      {}
    );
    setFormData(initialFormData);
  }
}, [selectedEventId, events]);

  
    const validateFormData = () => {
      for (const memberKey in formData) {
        const member = formData[memberKey];
        if (!member.name || !member.roll || !member.batch || !member.department) {
          return false;
        }
      }
      return true;
    };
  
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events/registeredevent",{ withCredentials: true });
        if (res.data.success) {
          setEvents(res.data.events); 
        }
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching events:", error); 
        setLoading(false); 
      }
    };
    fetchEvents();
  }, []);

  
  const handleEventClick = (eventId) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null); 
    } else {
      setSelectedEventId(eventId); 
      setFormData({});
    }
  };

  
  const handleInputChange = (e, memberKey, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [memberKey]: {
        ...prev[memberKey],
        [field]: value,
      },
    }));
  };
  

  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateFormData()) {
      context.customToast({ success: false, message: "Please fill in all the fields." });
      return;
    }
  
    try {
      const response = await axios.post("/api/user/eventregister", { ...formData, eventId: selectedEventId }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      if (response.data.url) {
        router.push(response.data.url);
        
       
      }
  
      
      context.customToast({ success: true, message: "Form submitted successfully!" });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "An error occurred during submission.";
      context.customToast({ success: false, message: errorMessage });
    }
  };

  
  const handleDelete = async (eventId) => {
    try {
      const res = await axios.delete(
        `/api/events/deleteevent`,
        {
          data: { eventId: eventId }, 
          withCredentials: true,
        }
      );
      context.customToast(res.data);
      if (res.data.success) {
        
        setEvents(events.filter(event => event._id !== eventId));
        if (selectedEventId === eventId) {
          setSelectedEventId(null); 
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      context.customToast(error.response.data);
    }
  };

  if (loading) {
    return  <Loader/>; 
  }

  return (
    <div className="flex flex-wrap gap-6 p-6 relative">
      {selectedEventId && (
        <Button
        className="text-[#027223] w-max absolute text-md font-semibold"
        onClick={() => setSelectedEventId(null)}
      >
        <ArrowBackIosIcon fontSize="small"/>
        Back
      </Button>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {!selectedEventId && events.map((event) => (
          <div
            key={event?._id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 relative ${selectedEventId === event?._id ? "hidden" : ""}`}
            onClick={() => handleEventClick(event?._id)} 
          >
            
            {user?.role === "admin" && (
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(event?._id); }} 
                className="absolute z-50 top-2 right-2 bg-red-500 text-white p-1 rounded-md hover:bg-red-600 focus:outline-none"
              >
                <DeleteIcon />
              </button>
            )}

            <div className="relative aspect-[16/9]"> 
              <img
                src={event?.image || "/default-image.jpg"} 
                alt={event?.title}
                width={500}
                height={500} 
                layout="responsive"
                className="object-cover aspect-[16/9] w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{event?.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">
                {event?.description.slice(0, 100)}... 
              </p>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>{new Date(event?.start).toLocaleDateString()} -{" "}
                {new Date(event?.end).toLocaleDateString()}</span>
                
              </div>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span className="text-red-700">Last Date: {event?.lastdate ? new Date(event?.lastdate).toLocaleDateString(): "N/A"}</span>
                <span className="font-semibold text-blue-600">৳{event?.regFee ? event.regFee : "Free"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      {selectedEventId && (
        <div className="flex flex-col md:flex-row md:gap-10 w-full">
          
         
          <div className="w-full bg-white p-6 rounded-lg shadow-lg">
            {events
              .filter((event) => event._id === selectedEventId)
              .map((event) => (
                <div key={event._id} className="flex gap-10">
                  <img
                    src={event?.image || "/default-image.jpg"} 
                    alt={event.title}
                    width={500}
                    height={500} 
                    layout="responsive"
                    className="object-cover basis-1/2 aspect-[16/9] mb-8 rounded-md w-full h-full"
                  />
                  <div className="basis-1/2">
                    
                  <h2 className="text-2xl font-bold text-gray-800">{event?.title}</h2>
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
                        whiteSpace: "pre-wrap", 
                      }}
                    >{event.description}</p>
                    {event.description.length > 100 && ( 
                      <button
                        onClick={toggleExpanded}
                        className="text-blue-500 mt-1 text-sm"
                      >
                        {isExpanded ? "See less" : "See more"}
                      </button>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-gray-500 flex justify-between">
                    <span>{new Date(event?.start).toLocaleDateString()} -{" "}
                    {new Date(event?.end).toLocaleDateString()}</span>
                    <span className="font-semibold text-blue-600">৳{event?.regFee ? event?.regFee : "Free"}</span>
                  </div>
                  </div>
                </div>
              ))}
          </div>

          
         
        </div>
      )}
    </div>
  );
};

export default EventList;
