// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Laundry from './pages/Laundry.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx'
import LaundryDetail from './pages/LaundryDetail.jsx'
import MetodePembayaran from './pages/MetodePembayaran.jsx'
import OrderRoute from './pages/OrderRoute.jsx'
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
          <Route index element={<OrderRoute />} />
        </Route>
        <Route path="/metodepembayaran" element={<App />}>
          <Route index element={<MetodePembayaran />} />
        </Route>
        <Route path="/laundrydetail" element={<App />}>
          <Route index element={<LaundryDetail />} />
        </Route>
        <Route path="/profile" element={<App />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
