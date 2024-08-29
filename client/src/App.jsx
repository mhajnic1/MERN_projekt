import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import { logo } from './assets'
import { Home } from './pages'; 
import { CreatePost } from './pages'; 
import { Login, Signup } from './components';
 
const App = () => {
  return (
    <BrowserRouter>
      <header  className="w-full flex justify-between items-center bg-white
      sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
          {/*OpenAI logo */}
        <Link to="/">
          <img src={logo} alt="logo"
          className="w-28 object-contain" />
        </Link>
          {/*Create post button */}
        <Link to="/create-post"
        className="font-inter font-medium bg-[#6469ff] text-white
        px-4 py-2 rounded-md"> Create </Link>

        <Link to="/users/login"
        className="font-inter font-medium bg-[#6469ff] text-white
        px-4 py-2 rounded-md"> Login </Link>

        <Link to="/users/register"
        className="font-inter font-medium bg-[#6469ff] text-white
        px-4 py-2 rounded-md"> Signup </Link>
      </header>

      <main className="sm:p-8 px-4 py-8
      w-full bg-[#f9fafe] min-h-[calc(100vh-74px)]">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create-post" element={<CreatePost/>} />
          <Route path="/users/login" element={<Login/>} />
          <Route path="/users/register" element={<Signup/>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App