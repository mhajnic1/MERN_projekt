import { useState, useEffect } from 'react';
import { download } from '../assets';
import { downloadImage } from '../utils';
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../state";
import FlexBetween from './FlexBetween';
import Friend from "./Friend";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { FavoriteBorderOutlined, ChatBubbleOutlineOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import DownloadIcon from '@mui/icons-material/Download';
import WidgetWrapper from './WidgetWrapper';

const Card = ({ _id, userId, username, prompt, photo, initialLikes, initialComments }) => {
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);

  const [likes, setLikes] = useState(new Map(Object.entries(initialLikes)));
  const [comments, setComments] = useState(initialComments);

  // Check if the post is liked by the current user
  const isLiked = likes.has(loggedInUserId);
  const likeCount = likes.size;
  const [isComments, setIsComments] = useState(false);
  
 

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

  // Handle Comment button click
  const handleComment = () => {
    // For now, we'll just increment the comment count. You could expand this
    // to open a comment modal or text input for the user to submit a comment.
    setComments(comments + 1);
    // Similarly, you could make an API call here to update comments in your backend.
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
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${username}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )}
      </Box>
    </WidgetWrapper>
  );
  

};

export default Card;
