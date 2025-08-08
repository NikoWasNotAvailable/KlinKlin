import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminOrder.css';

const CustomerOrder = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/api/orders?user=me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error('Error fetching customer orders:', err);
            }
        };

        fetchOrders();
    }, []);

    const handleGoToPayment = (orderId) => {
        navigate(`/payment/${orderId}`);
    };

    return (
        <div className="admin-orders-page">
            <div className="orders-list">
                {orders.length === 0 ? (
                    <p>You have no orders yet</p>
                ) : (
                    orders.map((order) => (
                        <div className="order-card">
                            <div className="order-user">
                                <div>
                                    <div className="name">{order.laundry_name}</div>
                                    <div className="service-type">
                                        Order #{order.id} - {order.type === 'kiloan' ? 'Jasa Cuci Reguler' : 'Jasa Cuci Satuan'}
                                    </div>
                                </div>
                            </div>

                            <div className="order-info-row">
                                <div className="order-info-item">
                                    <strong>Status</strong>
                                    <div>{order.status}</div>
                                </div>
                                <div className="order-info-item">
                                    <strong>Harga</strong>
                                    <div>{order.total_price ? `Rp${order.total_price}` : '-'}</div>
                                </div>
                            </div>

                            <button
                                className={order.status !== 'received' ? "send-driver-btn.disabled" : "send-driver-btn"}
                                onClick={() => handleGoToPayment(order.id)}
                                disabled={order.status !== 'received'}
                            >
                                Go to Payment
                            </button>
                        </div>

                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerOrder;
