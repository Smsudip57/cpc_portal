'use client';

import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { MyContext } from '@/context/context';
import Loader from '@/components/loader';

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState();
  const [error, setError] = useState(null);
  const context = useContext(MyContext);

  useEffect(() => {
    // Fetch all users when the component mounts
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/user/getuserdata', { withCredentials: true });
        setUsers(res.data.users);
        context.customToast(res.data);
        setFilteredUsers(res.data.users);
      } catch (error) {
        context.customToast(error.response.data);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users); // Reset to all users if no search query
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

  if(!users.length) return  <Loader/>;


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
        {/* {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">{user.profile.name}</h2>
            <p className="text-sm text-gray-500">Batch: {user.profile.batch}</p>
            <p className="text-sm text-gray-500">Department: {user.profile.department}</p>
            <p className="text-sm text-gray-500">Roll: {user.profile.roll}</p>
            <p className="text-sm text-gray-500">CPC ID: {user.profile.cpc_id}</p>
          </div>
        ))} */}
        {
           !searchQuery ? (
            <p className="text-center py-[10%] text-gray-500">{users.length} users found.</p>
          ): (filteredUsers.map((user) => (
            <div key={user._id} className="bg-white p-6 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold">{user.profile.name}</h2>
              <p className="text-sm text-gray-500">Batch: {user.profile.batch}</p>
              <p className="text-sm text-gray-500">Department: {user.profile.department}</p>
              <p className="text-sm text-gray-500">Roll: {user.profile.roll}</p>
              <p className="text-sm text-gray-500">CPC ID: {user.profile.cpc_id}</p>
            </div>
          )))
        }
      </div>
    </div>
  );
};

export default UserSearch;
