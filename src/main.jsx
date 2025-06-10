// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Laundry from './pages/Laundry.jsx';
import Order from './pages/Order.jsx';
import Login from './pages/Login.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/home" element={<App />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/laundry" element={<App />}>
          <Route index element={<Laundry />} />
        </Route>
        <Route path="/order" element={<App />}>
          <Route index element={<Order />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
