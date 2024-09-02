import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components';

import PostList from '../components/PostList';

const UserProfile = ({ posts, searchText }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
