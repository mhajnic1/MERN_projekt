/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
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
  const userId = useSelector((state) => state.user?._id);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendId]);


  return (
    <>
      <Box 
      width="100%"
      padding="2rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="0.5rem"
      justifyContent="space-between"
      >
        <Box>
          <h1 className="flex justify-content items-center font-extrabold text-[#222328] text-[32px]">
            Browse through {!isFriend ? "your" : `${username}'s`} collection
          </h1>
        </Box>

        {loading ? (
          <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
            <Loader />
          </Box>
        ) : (
          <PostList posts={posts} searchText={searchText} />
        )}
          <Box flexBasis="26%">
            <Box m="2rem 0" />
            <FriendListWidget userId={friendId ? friendId : userId} />
          </Box>
      </Box>
    </>
  );
};

export default UserProfile;
