import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { MyContext } from '@/context/context';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../loader';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const content = useContext(MyContext);
  const [userId, setUserId] = useState(); // Set this based on logged-in user

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news/getnews', {
          withCredentials: true,
        });
        setNews(response.data.news);
        setUserId(response.data.userId);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch news');
        setLoading(false);
        content.customToast(error.response.data);
      }
    };

    fetchNews();
  }, []);

  // Handle Upvote/Downvote
  const handleVote = async (newsId, vote) => {
    try {
      await axios.post('/api/news/vote', { newsId, vote });
      setNews((prevNews) =>
        prevNews.map((item) =>
          item._id === newsId
            ? {
                ...item,
                upvotes: vote ? [...item.upvotes, userId] : item.upvotes.filter((id) => id !== userId),
                downvotes: !vote ? [...item.downvotes, userId] : item.downvotes.filter((id) => id !== userId),
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error submitting vote:', error);
      content.customToast(error.response.data);
    }
  };

  // Handle Delete
  const handleDelete = async (newsId) => {
    try {
      await axios.delete(`/api/news/deletenews`, {
        withCredentials: true,
        data: { NewsId: newsId },
      });
      setNews((prevNews) => prevNews.filter((item) => item._id !== newsId));
      content.customToast({ success: true, message: 'News deleted successfully' });
    } catch (error) {
      console.error('Error deleting news:', error);
      content.customToast(error.response.data);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="news-list">
      {news.map((newsItem) => (
        <div key={newsItem._id} className="news-item flex mb-8 border-b pb-8">
          <div className="news-image w-1/3 relative">
            <img src={newsItem.image} alt={newsItem.title} className="w-full h-auto object-cover rounded-lg aspect-square" />
            {content.user && content.user.role === 'admin' && (
              <button
                onClick={() => handleDelete(newsItem._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                <DeleteIcon />
              </button>
            )}
          </div>
          <div className="news-details w-2/3 pl-6">
            <h2 className="text-2xl font-bold mb-4">{newsItem.title}</h2>
            <p
              className="text-lg mb-4"
              style={{ whiteSpace: 'pre-wrap' }} // Preserve spaces and new lines
            >
              {newsItem.description}
            </p>
            <div className="social-links">
              {newsItem.facebook && (
                <a
                  href={newsItem.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mr-4"
                >
                  Facebook Link
                </a>
              )}
              {newsItem.diu && (
                <a
                  href={newsItem.diu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  DIU Link
                </a>
              )}
            </div>

            {/* Upvote/Downvote Buttons */}
            {userId && (
              <>
                <div className="vote-buttons mt-4">
                  <button
                    onClick={() => handleVote(newsItem._id, true)} // Upvote
                    className={`upvote-btn ${newsItem.upvotes.includes(userId) ? 'text-blue-500' : ''}`}
                  >
                    Upvote
                  </button>
                  <button
                    onClick={() => handleVote(newsItem._id, false)} // Downvote
                    className={`downvote-btn ${newsItem.downvotes.includes(userId) ? 'text-red-500' : ''}`}
                  >
                    Downvote
                  </button>
                </div>
                <div className="vote-counts mt-2">
                  <span>{newsItem.upvotes.length} Upvotes</span>
                  <span className="ml-4">{newsItem.downvotes.length} Downvotes</span>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
