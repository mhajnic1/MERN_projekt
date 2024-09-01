import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logo } from '../assets';
import SearchBar from './SearchBar'; // Import SearchBar
import Login from './Login';
import Signup from './Signup';

const Navbar = ({ isLoggedIn, searchText, handleSearchChange }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const toggleLoginPopup = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const toggleSignupPopup = () => {
    setIsSignupOpen(!isSignupOpen);
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
      <div className="flex space-x-4 flex-shrink-0">
        {isLoggedIn ? (
          <Link to="/create-post" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
            Create
          </Link>
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
