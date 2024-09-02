import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logo } from '../assets';
import SearchBar from './SearchBar'; // Import SearchBar
import Login from './Login';
import Signup from './Signup';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLogout } from '../state';



const Navbar = ({ searchText, handleSearchChange }) => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const isAuth = Boolean(useSelector((state) => state.token));
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();

  const toggleLoginPopup = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const toggleSignupPopup = () => {
    setIsSignupOpen(!isSignupOpen);
  };

  const handleLogout = () => {
    dispatch(
      setLogout()
    );
    navigate('/');
    window.location.reload()
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
        {isAuth ? (
          <>
            <Link to="/create-post" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
              Create
            </Link>
            <button 
              onClick={handleLogout}
              className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
            >
              Log out
            </button>

            <Link to={`/posts/${user._id}`} className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
              {user.username}
            </Link>
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
