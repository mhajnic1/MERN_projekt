import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import { Home, CreatePost, UserProfile } from './pages'; 
import { Login, Signup } from './components';
import { handleSearchChange } from './utils'; // Import the function
import { useSelector } from "react-redux";

import { createTheme } from "@mui/material/styles";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { themeSettings } from "./theme";
import { useMemo } from "react";

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const user = useSelector((state) => state?.user);
  const token = useSelector((state) => state.token);

  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/posts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert('Error fetching posts: ', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/posts/${user._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const result = await response.json();
          setUserPosts(result.data.reverse());
        }
      } catch (error) {
        console.log(error)
      }
    };

    fetchUserPosts();
  }, [token, user?._id]);

  return (
    <BrowserRouter>
      <Navbar
        searchText={searchText}
        handleSearchChange={(e) =>
          handleSearchChange(
            e,
            setSearchText,
            allPosts,
            searchTimeout,
            setSearchTimeout,
            setSearchedResults
          )
        }
      />
      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-74px)] pt-16">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                posts={searchText ? searchedResults : allPosts} 
                searchText={searchText}
              />} 
          />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Signup />} />
          <Route path="/posts/:userId" element={
            <UserProfile
              posts={userPosts}
            />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
