'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get('/api/user/comiteemember', { withCredentials: true });
        console.log(res.data);
        setAdmins(res.data.users);
      } catch (err) {
        setError('Error fetching admin data.');
        console.log(err.res.data);
        console.error(err);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Comitee Members</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins && admins.length > 0 && admins.map((admin) => (
          <div
            key={admin._id}
            className="bg-[#bde9c977] p-4 shadow-md rounded-lg flex flex-col items-center"
          >
            <img
              src={
                admin.profile?.avatarUrl === 'https://default-avatar-url.com'? 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png': admin.profile?.avatarUrl
              }
              alt={admin.profile?.name || 'Admin'}
              className="w-16 h-16 rounded-full mb-4"
            />
            <h2 className="text-lg font-semibold">
              {admin.profile?.name || 'No Name'}
            </h2>
            <p className="text-sm text-gray-500">{admin.email}</p>
            <p className="text-sm text-gray-400">{admin.profile?.department || 'No Department'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminList;
