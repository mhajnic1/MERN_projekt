import { useState, useRef, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { setLogin } from "../state";

const Signup = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState(''); // To store signup errors
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      toggleForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError(''); // Reset the error message

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Dispatch login action and close form only if signup is successful
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        toggleForm(); // Close the modal if signup is successful
      } else {
        // Set error message and keep the form open if signup fails
        setSignupError(data.message);
      }
      
    } catch (error) {
      setSignupError('An error occurred. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (modalRef.current) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='w-96 bg-white rounded-lg p-8 shadow-lg' ref={modalRef}>
        <h2 className='text-2xl font-semibold mb-6 text-center'>
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2' htmlFor='username'>
              Username
            </label>
            <input
              className='w-full px-3 py-2 border rounded focus:outline-none focus:ring'
              id='username'
              type='text'
              placeholder='Enter your username'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
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

          {/* Display error message */}
          {signupError && (
            <div className="text-red-500 text-sm mb-4">
              {signupError}
            </div>
          )}

          <div className='flex justify-center'>
            <button
              className='w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none'
              type='submit'
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className='mt-4 text-center'>
          <span className='text-gray-700'>Have an account?</span>
          <button
            className='ml-2 text-blue-500 hover:text-blue-600' onClick={() => toggleForm()}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
