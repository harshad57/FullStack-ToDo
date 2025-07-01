import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [msg, setmsg] = useState('');
    const [msg1, setmsg1] = useState('');

    const [values, setvalues] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    function handlesubmit(e) {
        e.preventDefault();

        axios.post('https://fullstack-todo-ilbx.onrender.com/register', values)
            .then(res => {
                if (res.data.Status === "OK") {
                    setmsg1('Login successful');
                    navigate('/login');
                }
                if (res.data.error === "Registration failed") {
                    setmsg('This email was already registered');
                }
                if (res.data.error === "Hashing failed") {
                    setmsg('Error while creating your account');
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-8 border border-gray-200 rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
            {msg && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{msg}</div>}
            <form onSubmit={handlesubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold text-gray-700">Username</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required name='name'
                        placeholder="Enter your name"
                        onChange={(e) => {
                            setvalues({
                                ...values,
                                name: e.target.value
                            })
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required name='email'
                        placeholder="Enter your email"
                        onChange={(e) => {
                            setvalues({
                                ...values,
                                email: e.target.value
                            })
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required
                        placeholder="Enter your password" name='password'
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
                    Register
                </button>
                {msg1 && <div className="bg-red-100 text-green-700 p-3 rounded mb-4 text-center">{msg1}</div>}
                <div className='text-center mt-4'>
                    Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
                </div>
            </form>
        </div>
    );
}

export default Register;