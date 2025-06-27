import { useState } from 'react'
import React from 'react'
import Register from './register';
import Home from './home';
import Login from './login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}>Home</Route>
      <Route path='/register' element={<Register/>}>Register</Route>
      <Route path='/login' element={<Login/>}>Login</Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
