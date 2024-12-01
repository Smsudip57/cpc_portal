'use client';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MyContext } from '@/context/context';
import Loader from '@/components/loader';

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const context = useContext(MyContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/user/getuserdata', { withCredentials: true });
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
        context.customToast(res.data);
      } catch (error) {
        context.customToast(error.response?.data || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          Object.values(user.profile).some((val) =>
            val.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
    }
  }, [searchQuery, users]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/user/deleteuser`, {
        withCredentials: true,
        data: { userId },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      context.customToast({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      context.customToast(error.response?.data || 'Failed to delete user');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">User Search</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          placeholder="Search by name, batch, department, roll, CPC ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white p-6 shadow-md rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{user.profile.name}</h2>
              <p className="text-sm text-gray-500">Batch: {user.profile.batch}</p>
              <p className="text-sm text-gray-500">Department: {user.profile.department}</p>
              <p className="text-sm text-gray-500">Roll: {user.profile.roll}</p>
              <p className="text-sm text-gray-500">CPC ID: {user.profile.cpc_id}</p>
              {context.user?.role === 'admin' && (
                <p className="text-sm text-gray-700">Role: {user.role}</p>
              )}
            </div>
            {context.user?.role === 'admin' && (
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
