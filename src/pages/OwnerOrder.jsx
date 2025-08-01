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

                            <button
                                className={`send-driver-btn ${order.status !== 'driver_assigned' ? 'disabled' : ''}`}
                                onClick={async (e) => {
                                    if (order.status !== 'driver_assigned') return;

                                    if (order.type === 'satuan') {
                                        try {
                                            const token = localStorage.getItem('token');
                                            const res = await fetch(`http://localhost:3000/api/orders/${order.id}/confirm`, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Authorization: `Bearer ${token}`,
                                                },
                                                body: JSON.stringify({}) // no weight or price needed
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                                alert('Order confirmed!');
                                                window.location.reload(); // refresh to reflect new status
                                            } else {
                                                alert(data.error || 'Failed to confirm order');
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert('An error occurred');
                                        }
                                    } else {
                                        window.location.href = `/owner/confirm/${order.id}`;
                                    }
                                }}
                            >
                                Confirm Order
                            </button>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OwnerOrder;
