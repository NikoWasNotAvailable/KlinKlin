import React, { useEffect, useState } from 'react';
import './AdminOrder.css';

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/orders?status=pending', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };

        fetchOrders();
    }, []);


    const handleSendDriver = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/orders/${orderId}/assign-driver`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const error = await res.json();
                alert('Failed to assign driver: ' + (error.error || 'Unknown error'));
                return;
            }

            alert('Driver successfully assigned! ✅');

            // Option 1: Re-fetch orders
            const updated = await fetch('http://localhost:3000/api/orders?status=pending', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const newOrders = await updated.json();
            setOrders(newOrders);

            // Option 2: Or simply reload the page (uncomment if you prefer this)
            // window.location.reload();

        } catch (err) {
            console.error('Failed to assign driver:', err);
            alert('Something went wrong while assigning driver.');
        }
    };



    return (
        <div className="admin-orders-page">
            <div className="orders-list">
                {orders.length === 0 ? (
                    <p>No pending orders</p>
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

                            <button
                                className="send-driver-btn"
                                onClick={() => handleSendDriver(order.id)}
                                disabled={order.status !== 'pending'}
                            >
                                Send Driver
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOrderPage;
