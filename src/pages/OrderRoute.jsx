import React from 'react';
import { Navigate } from 'react-router-dom';
import CustomerOrder from './Order';
import AdminOrderPage from './AdminOrder';
import OwnerOrderPage from './AdminOrder';
import { jwtDecode } from 'jwt-decode';

const OrderRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        const role = decoded.role;

        switch (role) {
            case 'customer':
                return <CustomerOrder />;
            case 'admin':
                return <AdminOrderPage />;
            case 'laundry_owner':
                return <OwnerOrderPage />;
            default:
                return <Navigate to="/login" />;
        }
    } catch (err) {
        console.error('Invalid token');
        return <Navigate to="/login" />;
    }
};

export default OrderRoute;
