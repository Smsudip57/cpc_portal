'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tune } from '@mui/icons-material';
import { MyContext } from '@/context/context';
import { useContext } from 'react';
import Loader from '@/components/loader';

const DraftNewsletterList = () => {
  const [drafts, setDrafts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const context = useContext(MyContext);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await axios.get('/api/newsletter/getdrafts', { withCredentials: true });
        context.customToast(res.data);
        setDrafts(res.data.drafts);
        setLoading(false);
      } catch (err) {
        context.customToast(err.response.data);
        setError('Failed to fetch drafts. Please try again.');
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await axios.post(
        `/api/newsletter/action`,
        { id: id, action: action },
        { withCredentials: true }
      );
      context.customToast(res.data);
      // Refresh the draft list after an action
      setDrafts(drafts.filter((draft) => draft._id !== id));
    } catch (err) {
      context.customToast(err.response.data);
    }
  };

  if (loading) return <Loader/>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Draft Newsletters</h1>
      <div className="space-y-6">
        {drafts.map((draft) => (
          <div key={draft._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {draft.image && (
              <img
                src={draft.image}
                alt="Draft Image"
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{draft.title}</h2>
              <p className="text-sm font-semibold text-blue-600 mb-4">Category: {draft.category}</p>
              <div className="flex items-center mb-4">
                <img
                  src={draft.createdBy.avatarUrl || '/default-avatar.png'}
                  alt={draft.createdBy.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{draft.createdBy.name}</h3>
                  <p className="text-sm text-gray-500">Created at {new Date(draft.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-base text-gray-700 mb-4">
                <p>{draft.content}</p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleAction(draft._id, true)}
                  className="py-2 px-4 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(draft._id, false)}
                  className="py-2 px-4 bg-red-500 text-white font-medium rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftNewsletterList;
