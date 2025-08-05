import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Laundry from './pages/Laundry.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Profile from './pages/Profile.jsx';
import LaundryDetail from './pages/LaundryDetail.jsx';
import MetodePembayaran from './pages/MetodePembayaran.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import OrderLaundry from './pages/OrderLaundry.jsx';
import OrderRoute from './pages/OrderRoute.jsx';
import OwnerConfirmOrder from './pages/OwnerConfirmOrder.jsx';
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
        <Route path="/payment/:id" element={<App />}>
          <Route index element={<MetodePembayaran />} />
        </Route>
        <Route path="/payment/success/:id" element={<App />}>
          <Route index element={<PaymentSuccess />} />
        </Route>
        <Route path="/laundrydetail/:id" element={<App />}>
          <Route index element={<LaundryDetail />} />
        </Route>
        <Route path="/orderlaundry" element={<App />}>
          <Route index element={<OrderLaundry />} />
        </Route>
        <Route path="/profile" element={<App />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="/owner/confirm/:id" element={<App />}>
          <Route index element={<OwnerConfirmOrder />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
