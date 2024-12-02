'use client';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MyContext } from '@/context/context';
import Loader from '@/components/loader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const context = useContext(MyContext);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatarUrl: '',
    contact: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', { withCredentials: true });
        const userData = response.data.user;
        setUser(userData);
        setUser((prevUser) => ({
          ...prevUser,
          profile: {
            ...prevUser.profile,
            contact: '0' + userData.profile.contact, // Prepend '0' to the contact number
          },
        }));
        

        // Initialize form with updatable fields only
        setFormData({
          name: userData.profile.name || '',
          bio: userData.profile.bio || '',
          avatarUrl: userData.profile.avatarUrl || '',
          contact: userData.profile.contact || '',
        });
        setImagePreview(userData.profile.avatarUrl || '');
      } catch (err) {
        context.customToast(err.response.data);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('contact', formData.contact);
    
    // Add the file object directly instead of base64 string
    const fileInput = document.getElementById('avatar-upload');
    if (fileInput?.files[0]) {
      formDataToSend.append('avatar', fileInput.files[0]);
    }
  
    try {
      const response = await axios.put('/api/user/updateprofile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      context.customToast(response.data.message);

      setIsEditing(false);
      setUser({
        ...response.data.user,
        profile: {
          ...response.data.user.profile,
          contact: '0' + response.data.user.profile.contact,
        },
      });
      
      // Refresh user data or UI as needed
    } catch (err) {
      console.error('Error updating profile:', err);
      context.customToast(err.response?.data?.message || 'Something went wrong!');
      setIsEditing(false)
    }
  };
  
  

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.profile.name || '',
      bio: user.profile.bio || '',
      avatarUrl: user.profile.avatarUrl || '',
      contact: user.profile.contact || '',
    });
    setImagePreview(user.profile.avatarUrl || '');
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className='min-h-screen min-w-screen  bg-[#BDE9C9]'>
      <div className="max-w-4xl mx-auto p-6 pt-12 text-black">
      <div className="flex items-center justify-between">
        <div className="relative">
          <img 
            src={(imagePreview === 'https://default-avatar-url.com' || imagePreview === '')
              ? 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png' 
              : imagePreview}
            alt="Avatar" 
            className="w-28 h-28 rounded-full object-cover"
          />
          {isEditing && (
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full cursor-pointer hover:bg-gray-700"
            >
              +
            </label>
          )}
          <input 
            id="avatar-upload" 
            type="file" 
            className="hidden" 
            onChange={handleImageUpload}
          />
        </div>
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">{isEditing ? (
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange}
              className="p-2 border rounded-lg"
            />
          ) : (
            user.profile.name
          )}</h1>
          {isEditing && (
            <div className="ml-4 flex gap-2">
              <button 
                onClick={handleCancelEdit} 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleFormSubmit} 
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-100 rounded-lg">
          <strong className="block text-sm text-gray-700">Batch:</strong>
          {user.profile.batch || 'Not set'}
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <strong className="block text-sm text-gray-700">Roll:</strong>
          {user.profile.roll || 'Not set'}
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <strong className="block text-sm text-gray-700">Department:</strong>
          {user.profile.department || 'Not set'}
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <strong className="block text-sm text-gray-700">CPC ID:</strong>
          {user.profile.cpc_id || 'Not set'}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Other Details</h2>
        <div>
          <strong className="block text-sm text-gray-700">Bio:</strong>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              rows={3}
            ></textarea>
          ) : (
            user.profile.bio || 'Not set'
          )}
        </div>

        <div className="mt-4">
          <strong className="block text-sm text-gray-700">Contact:</strong>
          {isEditing ? (
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder={user.profile.contact || 'Not set yet'}
            />
          ) : (
            user.profile.contact || 'Not set yet'
          )}
        </div>
      </div>

      {!isEditing && (
        <button 
          onClick={() => setIsEditing(true)} 
          className="mt-6 text-blue-500 hover:text-blue-700"
        >
          Edit Profile
        </button>
      )}
    </div>
    </div>
  );
};

export default Profile;
