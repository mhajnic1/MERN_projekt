import React, { useState, useEffect } from 'react';
import { download } from '../assets';
import { downloadImage } from '../utils';
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../state";
import FlexBetween from './FlexBetween';
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";

const Card = ({ _id, username, prompt, photo, initialLikes, initialComments }) => {
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);

  // Local state for likes and comments
  // Initialize likes with Map
  const [likes, setLikes] = useState(new Map(Object.entries(initialLikes)));
  const [comments, setComments] = useState(initialComments);

  // Check if the post is liked by the current user
  const isLiked = likes.has(loggedInUserId);
  const likeCount = likes.size;
  const [isComments, setIsComments] = useState(false);
  
 

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;


  useEffect(() => {
    const fetchLikes = async () => {
      const response = await fetch(`http://localhost:8080/posts/${_id}`);
      const data = await response.json();
      setLikes(new Map(Object.entries(data.likes || {}))); // Update state with fetched likes
    };

    fetchLikes();
  }, [_id]);

  const patchLike = async () => {
    const response = await fetch(`http://localhost:8080/posts/${_id}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    if (!response.ok) {
      const text = await response.text(); // Read response as text for debugging
      console.error(`Error response: ${text}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setLikes(new Map(Object.entries(data.likes || {})));
  };

  // Handle Comment button click
  const handleComment = () => {
    // For now, we'll just increment the comment count. You could expand this
    // to open a comment modal or text input for the user to submit a comment.
    setComments(comments + 1);
    // Similarly, you could make an API call here to update comments in your backend.
  };



  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card mb-6">
      {/* Post Image */}
      <img 
        className="w-full h-auto object-cover rounded-xl"
        src={photo}
        alt={prompt}
      />

      {/* Post Details */}
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-8 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        <p className="text-white text-md overflow-y-auto prompt">{prompt}</p>

        {/* Name and Download Button */}
        <FlexBetween className="mt-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-700 flex justify-center items-center text-white text-xs font-bold">
              {username[0]}
            </div>
            <p className="text-white text-sm">{username}</p>
          </div>
          <button type="button" onClick={() => downloadImage(_id, photo)} className="outline-none bg-transparent border-none">
            <img src={download} alt="download" className="w-6 h-6 object-contain invert" />
          </button>
        </FlexBetween>
      </div>

      {/* Likes and Comments Section */}
      <FlexBetween className="mt-4 px-4">
        <div className="flex items-center gap-2">
        <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleComment} className="text-[#6469ff]">💬 Comment</button>
          <span className="text-sm text-gray-500">{comments} Comments</span>
        </div>
      </FlexBetween>
    </div>
  );
};

export default Card;
