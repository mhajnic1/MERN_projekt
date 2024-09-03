import { useState } from 'react';
import { Loader } from '../components';
import PostList from '../components/PostList';
import { Box, useMediaQuery } from "@mui/material";
import FriendListWidget from "../widgets/FriendListWidget";
import { useSelector } from "react-redux";

const UserProfile = ({ posts, searchText }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const token = useSelector((state) => state.token);
  const friendId = useSelector((state) => state?.friendId);
  const isFriend = Boolean(friendId);

  const getUsername = async () => {
    try {
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
      setUsername(data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (friendId) {
      getUsername();
    } else {
      setLoading(false);
    }
  }, [friendId]);

  return (
    <>
      <section className="max-w-7xl mx-auto mt-6">
        <div>
          <h1 className="flex justify-center items-center font-extrabold text-[#222328] text-[32px]">
            Browse through {!isFriend ? "your" : `${username}'s`} collection
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
