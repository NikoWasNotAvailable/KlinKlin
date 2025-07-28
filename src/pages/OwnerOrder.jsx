import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminOrder.css';

const OwnerOrder = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error('Error fetching owner orders:', err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="admin-orders-page">
            <div className="orders-list">
                {orders.length === 0 ? (
                    <p>No ongoing orders</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-user">
                                <img src="/avatar-customer.png" alt="User" />
                                <div>
                                    <div className="name">
                                        {order.customer_first_name || 'Unknown'} {order.customer_last_name || ''}
                                    </div>
                                    <div className="service-type">
                                        {order.type === 'kiloan' ? 'Jasa Cuci Reguler' : 'Jasa Cuci Satuan'}
                                    </div>
                                </div>
                            </div>

                            <div className="order-info-row">
                                <div className="order-info-item">
                                    <strong>Address</strong>
                                    <div>{order.customer_address || 'No Address'}</div>
                                </div>
                                <div className="order-info-item">
                                    <strong>Time</strong>
                                    <div>{new Date(order.pickup_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>

                            <Link
                                className={`send-driver-btn ${order.status !== 'driver_assigned' ? 'disabled' : ''}`}
                                to={`/owner/confirm/${order.id}`}
                                onClick={(e) => {
                                    if (order.status !== 'driver_assigned') {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Confirm Order
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OwnerOrder;
