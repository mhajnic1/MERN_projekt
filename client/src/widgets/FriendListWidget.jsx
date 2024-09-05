/* eslint-disable react/prop-types */
import { Box, Typography, Divider } from "@mui/material";
import Friend from "../components/Friend";
import WidgetWrapper from "../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const loggedInUserFriends = useSelector((state) => state.user?.friends);
  const viewedUserFriends = useSelector((state) => state?.friends);

  const friends = userId === loggedInUserId ? loggedInUserFriends : viewedUserFriends;

  useEffect(() => {
    const getFriends = async () => {
      const response = await fetch(`http://localhost:8080/users/${userId}/friends`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
           },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data, forUserId: userId }));
    };

    getFriends();

  }, [dispatch, token, userId]);

  return (
    <WidgetWrapper>
      <Typography
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Divider />
      
      <Box display="flex" flexDirection="column" gap="1.5rem" paddingTop="0.5rem">
        {Array.isArray(friends) && friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={friend.username}
              postId={false}
            /> 
          ))
        ) : (
          <Typography>No friends found.</Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
