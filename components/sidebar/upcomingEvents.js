import React, { useState, useEffect, useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import Image from "next/image";
import axios from "axios"; // Importing Axios
import { MyContext } from "@/context/context";
import { Button } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Loader from "../loader";
import { useRouter } from "next/navigation";

const EventList = () => {
  const { user } = useContext(MyContext); // Access the user context to check for admin
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null); // Track selected event
  const [formData, setFormData] = useState({});
  const context = useContext(MyContext);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

// Initialize when `selectedEventId` or `events` changes
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
  
  // Fetch events from your API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events/getevents"); // Adjust API endpoint if necessary
        if (res.data.success) {
          setEvents(res.data.events); // Set events to state if successful
        }
      } catch (error) {
        console.error("Error fetching events:", error); // Log error if any
      } finally {
        setLoading(false); // Stop loading when done
      }
    };
    fetchEvents(); // Call fetch events on component mount
  }, []);

  // Handle event selection
  const handleEventClick = (eventId) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null); // Deselect if the same event is clicked again
    } else {
      setSelectedEventId(eventId); // Select the event
      // Reset form data when switching events
      setFormData({});
    }
  };

  // Handle input changes in the dynamic form
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
  

  // Handle form submission
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
        
        // setFormData({});
      }
  
      // Handle success response
      context.customToast({ success: true, message: "Form submitted successfully!" });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "An error occurred during submission.";
      context.customToast({ success: false, message: errorMessage });
    }
  };

  // Delete event handler
  const handleDelete = async (eventId) => {
    try {
      const res = await axios.delete(
        `/api/events/deleteevent`,
        {
          data: { eventId: eventId }, // Use the `data` field to send the body
          withCredentials: true,
        }
      );
      context.customToast(res.data);
      if (res.data.success) {
        // Remove the event from the state after deletion
        setEvents(events.filter(event => event._id !== eventId));
        if (selectedEventId === eventId) {
          setSelectedEventId(null); // Deselect if the deleted event was selected
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      context.customToast(error.response.data);
    }
  };

  if (loading) {
    return  <Loader/>; // Show loading message
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
      {/* List of Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {!selectedEventId && events.map((event) => (
          <div
            key={event?._id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 relative ${selectedEventId === event?._id ? "hidden" : ""}`}
            onClick={() => handleEventClick(event?._id)} // Handle event click
          >
            {/* Show delete button only if the user is an admin */}
            {user?.role === "admin" && (
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(event?._id); }} // Prevent event click
                className="absolute z-50 top-2 right-2 bg-red-500 text-white p-1 rounded-md hover:bg-red-600 focus:outline-none"
              >
                <DeleteIcon />
              </button>
            )}

            <div className="relative aspect-[16/9]"> {/* Ensure the aspect ratio is square */}
              <img
                src={event?.image || "/default-image.jpg"} // Default image if no image
                alt={event?.title}
                width={500}
                height={500} // Set both width and height to create a square image
                layout="responsive"
                className="object-cover aspect-[16/9] w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{event?.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">
                {event?.description.slice(0, 100)}... {/* Truncate text if not expanded */}
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

      {/* Event Details and Form for Selected Event */}
      {selectedEventId && (
        <div className="flex flex-col md:flex-row md:gap-10 w-full">
          
          {/* Left Side: Event Details */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
            {events
              .filter((event) => event._id === selectedEventId)
              .map((event) => (
                <div key={event._id}>
                  <img
                    src={event?.image || "/default-image.jpg"} 
                    alt={event.title}
                    width={500}
                    height={500} 
                    layout="responsive"
                    className="object-cover aspect-[16/9] mb-8 rounded-md w-full h-full"
                  />
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
                  <div className="mt-4 text-sm text-gray-500 flex justify-between">
                    <span>{new Date(event?.start).toLocaleDateString()} -{" "}
                    {new Date(event?.end).toLocaleDateString()}</span>
                    <span className="font-semibold text-blue-600">৳{event?.regFee ? event?.regFee : "Free"}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Right Side: Dynamic Form for Team Members */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Register Team Members</h3>
            <form onSubmit={handleFormSubmit}>
            {events
              .filter((event) => event._id === selectedEventId)
              .map((event) => {
                const memberFields = [];
                for (let i = 0; i < event.teamMembers; i++) {
                  const memberKey = `member-${i + 1}`;
                  memberFields.push(
                    <div key={memberKey} className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-700">Member {i + 1}</h4>
                      <div className="flex gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={formData[memberKey]?.name || ""}
                          onChange={(e) => handleInputChange(e, memberKey, "name")}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Roll No."
                          value={formData[memberKey]?.roll || ""}
                          onChange={(e) => handleInputChange(e, memberKey, "roll")}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Restrict non-numeric input
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          placeholder="Batch"
                          value={formData[memberKey]?.batch || ""}
                          onChange={(e) => handleInputChange(e, memberKey, "batch")}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Department"
                          value={formData[memberKey]?.department || ""}
                          onChange={(e) => handleInputChange(e, memberKey, "department")}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                  );
                }
                return memberFields;
              })}
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
