/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { download } from '../assets';
import { downloadImage } from '../utils';
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../state";
import FlexBetween from './FlexBetween';
import Friend from "./Friend";
import { Box, Divider, IconButton, Typography, useTheme, TextField, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { FavoriteBorderOutlined, ChatBubbleOutlineOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import DownloadIcon from '@mui/icons-material/Download';
import WidgetWrapper from './WidgetWrapper';

const Card = ({ _id, userId, username, prompt, photo, initialLikes, initialComments }) => {
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);

  const [likes, setLikes] = useState(new Map(Object.entries(initialLikes)));
  

  // Check if the post is liked by the current user
  const isLiked = likes.has(loggedInUserId);
  const likeCount = likes.size;
  const [isComments, setIsComments] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState(""); 

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:8080/posts/${_id}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    if (response.ok) {
      const data = await response.json();
      setLikes(new Map(Object.entries(data.likes || {})));
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${_id}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          username: username, // Make sure this is correctly set
          text: newComment,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }
  
      const data = await response.json();
      // Handle the response data, e.g., update state with new comments
      console.log('Comment submitted successfully', data);
      setComments(data.data.comments);
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  
  

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };



  return (
    <WidgetWrapper>
      <Friend
        friendId={userId}
        name={username}
      />
      
      <Box 
        className="rounded-xl shadow-card hover:shadow-cardhover card mb-6"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          '&:hover .post-details': {
            display: 'flex', 
          },
        }}
      >
        {/* Post Image */}
        <img 
          className="w-full h-auto object-cover rounded-xl"
          src={photo}
          alt={prompt}
        />
        
        {/* Post Details */}
        <Box 
          className="post-details" 
          sx={{
            position: 'absolute',
            offsetBottom: '5rem',
            transform: 'translateY(-100%)', // 2,8 ako zelimo da dira donji rub slike 
            left: 0,
            right: 0,
            backgroundColor: '#10131f',
            margin: '0rem', // 0.5 ako zelimo da izgleda kao hover
            padding: '1rem',
            borderRadius: '0.75rem',
            display: 'none', // Default to hidden
            flexDirection: 'column',
            maxHeight: '94.5%',
            overflowY: 'auto',
          }}
        >
          {/* Container for prompt*/}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center', 
            }}
          >
            {/* Prompt Text */}
            <Typography variant="body2" color="white" sx={{ flex: 1 }}>
              {prompt}
            </Typography>

            
          </Box>
        </Box>
  
        {/* Likes and Comments Section */}
        <FlexBetween className="mt-4 px-4">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
  
          {/* Download Button */}
          <IconButton 
              onClick={() => downloadImage(_id, photo)} 
              sx={{ bgcolor: 'transparent', border: 'none' }}
            >
              <DownloadIcon sx={{ color: 'black' }} /> 
            </IconButton>
        </FlexBetween>
  
        {isComments && (
        <Box 
          mt="0.5rem" 
          sx={{ 
            maxHeight: '300px', // Set a fixed maximum height
            overflowY: 'auto', // Enable vertical scrolling
            border: '1px solid #ddd', // Optional border for better visibility
            borderRadius: '8px', // Optional rounded corners
          }}
        >
          {comments.map((comment, index) => (
            <Box key={index} mb="1rem">
              <Divider />
              <Box sx={{ p: "0.5rem 1rem" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {comment.username}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatTimestamp(comment.createdAt)}
                  </Typography>
                </Box>
                <Typography sx={{ mt: '0.5rem' }}>
                  {comment.text}
                </Typography>
              </Box>
            </Box>
          ))}
          <Divider />
        </Box>
      )}

      {/* New Comment Input */}
      {isComments && (
        <Box display="flex" alignItems="center" mt="1rem">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentSubmit}
            sx={{ ml: '0.5rem' }}
          >
            <SendIcon />
          </Button>
        </Box>
      )}
      </Box>
    </WidgetWrapper>
  );
  

};

export default Card;
