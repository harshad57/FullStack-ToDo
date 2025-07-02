import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

function Login() {
  const [msg, setmsg] = useState('');
  const [msg1, setmsg1] = useState('');

  const [values, setvalues] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()
  axios.defaults.withCredentials = true;

  const handlesubmit = (e) => {
    e.preventDefault();

    axios.post('https://fullstack-todo-ilbx.onrender.com/login', values)
      .then(res => {
        if (res.data.Status === "OK") {
          setmsg1('Login successful');
          navigate('/');
        }
        if (res.data.error === "User not found") {
          setmsg('User not found, please register first');
          setTimeout(() => setmsg(''), 1500);
        }
        if (res.data.error === "incorrect") {
          setmsg('Incorrect password or email id');
          setTimeout(() => setmsg(''), 1500);
        }
        if (res.data.error === "Login error") {
          setmsg('Login error, please try again');
          setTimeout(() => setmsg(''), 1500);
        }
      })
      .catch(err => console.log(err));
  }


  return (
    <div className="max-w-md mx-auto mt-10 border border-gray-500 rounded-lg shadow-md bg-white">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {msg && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{msg}</div>}
        <form onSubmit={handlesubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required
              placeholder="Enter your email"
              onChange={(e) => {
                setvalues({
                  ...values,
                  email: e.target.value
                })
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required placeholder='Enter your password'
              onChange={(e) => {
                setvalues({
                  ...values,
                  password: e.target.value
                })
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
          {msg1 && <div className="bg-red-100 text-green-700 p-3 rounded mb-4 text-center">{msg1}</div>}
          <div className='text-center mt-4'>
            Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;