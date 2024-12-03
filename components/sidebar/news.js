import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { MyContext } from '@/context/context';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../loader';
import FacebookIcon from '@mui/icons-material/Facebook';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const content = useContext(MyContext);
  const [userId, setUserId] = useState(); 
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };


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

  
  const handleVote = async (newsId, vote) => {
    try {
      
      await axios.post('/api/news/vote', { newsId, vote });
  
      
      setNews((prevNews) =>
        prevNews.map((item) =>
          item._id === newsId
            ? {
                ...item,
                upvotes: vote
                  ? [...new Set([...item.upvotes, userId])]  
                  : item.upvotes.filter((id) => id !== userId), 
                downvotes: !vote
                  ? [...new Set([...item.downvotes, userId])]  
                  : item.downvotes.filter((id) => id !== userId), 
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error submitting vote:', error);
      content.customToast(error.response.data);
    }
  };
  
  
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
        <div key={newsItem._id} className="news-item flex m-8 rounded-lg border-b p-8 bg-[#bde9c979]">
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
            <div className="relative">
                    <p
                      className={`text-gray-600 mt-2 ${
                        isExpanded ? "" : "line-clamp-3"
                      }`}
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: isExpanded ? "none" : 8,
                        whiteSpace: "pre-wrap", 
                      }}
                    >{newsItem?.description}</p>
                    {newsItem?.description.length > 100 && ( 
                      <button
                        onClick={toggleExpanded}
                        className="text-blue-500 mt-1 text-sm"
                      >
                        {isExpanded ? "See less" : "See more"}
                      </button>
                    )}
                  </div>
            <div className="social-links pt-4 flex items-center">
              {newsItem.facebook && (
                <a
                  href={newsItem.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline mr-4"
                >
                  <FacebookIcon/>
                </a>
              )}
              {newsItem.diu && (
                <a
                  href={newsItem.diu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  <img src='/logo.png' className='w-[45px] mt-[3px]'/>
                </a>
              )}
            </div>

            
            {userId && (
              <>
                <div className="vote-buttons mt-4 flex gap-8 relative">
                  <button
                    onClick={() => handleVote(newsItem._id, true)} 
                    className={`upvote-btn gap-2 text-white px-2 py-1 rounded-md items-center flex ${newsItem.upvotes.includes(userId) ? 'bg-blue-500' : 'bg-gray-500'}`}
                  >
                    {newsItem.upvotes.length}
                    <ThumbUpIcon fontSize='small'/>
                  </button>
                  <button
                    onClick={() => handleVote(newsItem._id, false)} 
                    className={`downvote-btn gap-2 text-white px-2 py-1 rounded-md items-center flex  ${newsItem.downvotes.includes(userId) ? 'bg-red-500' : 'bg-gray-500'}`}
                  >
                    {newsItem.downvotes.length}
                    <ThumbDownIcon fontSize='small'/>
                  </button>
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
