import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components';
import { useSelector } from "react-redux";
import PostList from '../components/PostList';

const UserProfile = ({ posts, searchText }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/posts/${user._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const result = await response.json();
          setUserPosts(result.data.reverse());
        }
      } catch (error) {
        alert('Error fetching posts: ', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <section className="max-w-7xl mx-auto mt-6">
        <div>
          <h1 className="font-extrabold text-[#222328] text-[32px]">
          Browse through your collection
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <PostList posts={posts} searchText={searchText} />
        )}
      </section>
    </>
  );
};

export default UserProfile;
