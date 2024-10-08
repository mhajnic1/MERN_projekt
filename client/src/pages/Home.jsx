/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Loader } from '../components';
import PostList from '../components/PostList';
import { Box, useMediaQuery } from "@mui/material";
import FriendListWidget from "../widgets/FriendListWidget";
import { useSelector } from "react-redux";

const Home = ({ posts, searchText }) => {
  const [loading, setLoading] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useSelector((state) => state?.user);
  const _id = user?._id;

  return (
    <>
      <Box 
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        {/* AI Studio Showcase Heading and Description */}
        <Box
          flexBasis={isNonMobileScreens ? "74%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <Box>
            <h1 className="font-extrabold text-[#222328] text-[32px]">
              AI Art Showcase
            </h1>
            <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
              Browse through a collection of imaginative and visually stunning images
              generated by DALL-E AI
            </p>
          </Box>

          {/* Conditionally Render Loader or PostList */}
          {loading ? (
            <Loader />
          ) : (
            <PostList posts={posts} searchText={searchText} />
          )}
        </Box>

        {/* Friend List Widget */}
        {_id ? (
          <Box flexBasis="26%">
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        ) : (
          <Box flexBasis="26%">
            <Box m="2rem 0" />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Home;
