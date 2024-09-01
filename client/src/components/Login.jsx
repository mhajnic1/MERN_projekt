/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ toggleForm }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      toggleForm(); // Close the modal when clicking outside
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Logging in...');

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    
      const data = await response.json();
      console.log(data);

      if (data.success) {
        navigate('/');
      } else {
        console.log('Login failed:', data.message);
      }
      
    } catch (error) {
      console.error(error);
    }

    toggleForm(); // Close the modal after login attempt
  };

  useEffect(() => {
    if (modalRef.current) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='w-96 bg-white rounded-lg p-8 shadow-lg' ref={modalRef}>
        <h2 className='text-2xl font-semibold mb-6 text-center'>
          Log In
        </h2>
        <form onSubmit={handleLogin}>
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2' htmlFor='email'>
              Email
            </label>
            <input
              className='w-full px-3 py-2 border rounded focus:outline-none focus:ring'
              id='email'
              type='email'
              placeholder='Enter your email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2' htmlFor='password'>
              Password
            </label>
            <input
              className='w-full px-3 py-2 border rounded focus:outline-none focus:ring'
              id='password'
              type='password'
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <div className='flex justify-center'>
            <button
              className='w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none'
              type='submit'
            >
              Log In
            </button>
          </div>
        </form>
        <div className='mt-4 text-center'>
          <span className='text-gray-700'>Don't have an account?</span>
          <a className='ml-2 text-blue-500 hover:text-blue-600' href='/users/register'>
            Sign Up
          </a>
        </div>
        <button
          className='absolute top-2 right-2 text-gray-500'
          onClick={toggleForm}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Login;
