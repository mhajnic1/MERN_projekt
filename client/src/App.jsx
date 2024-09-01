import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import { Home, CreatePost } from './pages'; 
import { Login, Signup } from './components';
import { handleSearchChange } from './utils'; // Import the function

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
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

  return (
    <BrowserRouter>
      <Navbar 
        isLoggedIn={isLoggedIn} 
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
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
