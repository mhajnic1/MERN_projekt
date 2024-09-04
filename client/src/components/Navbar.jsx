import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Notifications } from '@mui/icons-material';
import { Menu, MenuItem, IconButton, Badge } from '@mui/material';
import { logo } from '../assets';
import Login from './Login';
import Signup from './Signup';
import { useSelector, useDispatch } from "react-redux";
import { unsetFriend, setLogout } from '../state';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const Navbar = ({ searchText, handleSearchChange }) => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for managing dropdown
  const [notifications, setNotifications] = useState([]); // State for notifications
  const isAuth = Boolean(useSelector((state) => state.token));
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user._id) {
        try {
          const response = await fetch(`http://localhost:8080/notifications/${user._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          // Log response status and text
          console.log('Response Status:', response.status);
          const responseText = await response.text();
          console.log('Response Text:', responseText);

          // Try parsing JSON
          try {
            const data = JSON.parse(responseText);
            if (data.success) {
              setNotifications(data.notifications);
            } else {
              console.error('Failed to fetch notifications');
            }
          } catch (jsonError) {
            console.error('Failed to parse JSON:', jsonError);
          }
        } catch (err) {
          console.error('Error fetching notifications:', err);
        }
      }
    };

    fetchNotifications();
  }, [user, token]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:8080/notifications/${user._id}/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Update UI after marking as read
      setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const toggleLoginPopup = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const toggleSignupPopup = () => {
    setIsSignupOpen(!isSignupOpen);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/');
  };

  const handleUser = () => {
    dispatch(unsetFriend());
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationItemClick = (notificationId) => {
    markAsRead(notificationId);
    handleNotificationClose();
  };

  return (
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
      {/* Logo */}
      <Link to="/" className="flex-shrink-0">
        <img src={logo} alt="logo" className="w-28 object-contain" />
      </Link>
      
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={handleSearchChange}
        className="border rounded-lg p-2"
      />

      {/* Right-side buttons */}
      <div className="flex space-x-4 flex-shrink-0 items-center">
        {isAuth ? (
          <>
            {/* Notification Icon with Badge */}
            <IconButton onClick={handleNotificationClick} color="primary">
              <Badge badgeContent={notifications.length} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>

            <Link to="/create-post" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
              Create
            </Link>

            <Link to={`/posts/${user._id}`}
              onClick={handleUser}>
              <AccountBoxIcon style={{ fontSize: 40 }}/>
              {user.username}
            </Link>

            <IconButton 
              onClick={handleLogout}>
              <LogoutIcon style={{ fontSize: 40 }}/>
            </IconButton>
            

            {/* Notification Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem
                    key={notification._id}
                    onClick={() => handleNotificationItemClick(notification._id)}
                  >
                    {notification.message}
                  </MenuItem>
                ))
              ) : (
                <MenuItem onClick={handleNotificationClose}>No new notifications</MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <>
            <button 
              onClick={toggleLoginPopup}
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
            >
              Login
            </button>
            <button 
              onClick={toggleSignupPopup}
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
            >
              Signup
            </button>
          </>
        )}
      </div>

      {/* Render Login Popup */}
      {isLoginOpen && <Login toggleForm={toggleLoginPopup} />}
      {isSignupOpen && <Signup toggleForm={toggleSignupPopup} />}
    </header>
  );
};

export default Navbar;
