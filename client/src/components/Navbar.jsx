import React from 'react';
import { Link } from 'react-router-dom';
import { logo } from '../assets';
import SearchBar from './SearchBar'; // Import SearchBar

const Navbar = ({ isLoggedIn, searchText, handleSearchChange }) => {
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
            <Link to="/users/login" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
              Login
            </Link>
            <Link to="/users/register" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
