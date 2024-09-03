 
import { useState } from 'react';
import { Loader } from '../components';
import { useSelector } from "react-redux";

import PostList from '../components/PostList';

const UserProfile = ({ posts, searchText }) => {
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.token);
  const friendId = useSelector((state) => state?.friendId);
  const isFriend = Boolean(useSelector((state) => state?.friendId));

  const getUsername = async () => {
    const response = await fetch(
      `http://localhost:8080/users/${friendId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data)
    //setLoading(true);
    //return data.username
  };

  return (
    <>
      <section className="max-w-7xl mx-auto mt-6">
        <div>
          <h1 className="flex justify-center items-center font-extrabold text-[#222328] text-[32px]">
          Browse through {!isFriend ? "your" : "user's" /* getUsername(friendId) */} collection
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
