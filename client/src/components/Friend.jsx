/* eslint-disable react/prop-types */
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriend, setFriends } from "../state";
import FlexBetween from "./FlexBetween";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';


const Friend = ({ friendId, name, postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user?.friends);
  const isFriend = friends?.find((friend) => friend._id === friendId);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:8080/users/${id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const deletePost = async () => {
    const response = await fetch(`http://localhost:8080/posts/${postId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: id }),
    });
    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <FlexBetween
    sx={{
      alignItems: 'center',
      mb: '0.5rem', // bottom margin za ime i ikonu
    }}>
      <FlexBetween gap="1rem">
        <Box
          onClick={() => {
            sessionStorage.setItem('scrollPosition', window.scrollY);
            dispatch(setFriend({ friendId }));
            navigate(`/posts/${friendId}`);
            window.scrollTo(0, 0);
          }}
          
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.dark,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
        </Box>
      </FlexBetween>
      {token && (
        friendId !== id ? (
          <IconButton
            onClick={() => patchFriend()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            {isFriend ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
        ) : postId && (
          <IconButton
            onClick={() => deletePost()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            <DeleteIcon sx={{ color: primaryDark }} />
          </IconButton>
        )
      )}
      </FlexBetween>
  );
};

export default Friend;