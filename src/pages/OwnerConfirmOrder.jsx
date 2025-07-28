import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OwnerConfirmOrder.css';

const OwnerConfirmOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [weight, setWeight] = useState('');
    const pricePerKg = 30000;
    const pickupFee = 30000;

    useEffect(() => {
        // Fetch order detail
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');

                const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order details:', err);
            }
        };

        fetchOrder();
    }, [id]);

    const totalPrice = weight ? pickupFee + weight * pricePerKg : 0;

    const handleConfirm = async () => {
        try {
            const token = localStorage.getItem('token');

            await fetch(`http://localhost:3000/api/orders/${id}/confirm`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    weight: parseFloat(weight),
                    total_price: totalPrice,
                }),
            });

            alert('Order confirmed successfully!');
            navigate('/order');
        } catch (err) {
            console.error('Error confirming order:', err);
            alert('Failed to confirm order.');
        }
    };

    if (!order) return <div>Loading...</div>;

    return (
        <div className="owner-confirm-container">
            <h2>Order</h2>
            <p className="breadcrumb">Order &gt; Details</p>
            <h3 className="order-title">Cuci Kiloan</h3>

            <div className="confirm-box">
                <div className="left">
                    <label>Berat Cucian</label>
                    <div className="weight-input">
                        <input
                            type="number"
                            placeholder="Masukan Berat"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <span>KG</span>
                    </div>

                    <label>Tipe Jasa</label>
                    <div className="service-card">
                        <div className="service-header">
                            <strong>Jasa Cuci Reguler</strong>
                            <span>Rp. 30,000</span>
                        </div>
                        <p>Lorem ipsum dolor sit amet consectetur. Donec maecenas dictum vulputate nulla nibh.</p>
                    </div>
                </div>

                <div className="right">
                    <h4>Estimasi Biaya</h4>
                    <div className="price-row">
                        <span>Biaya Jemput</span>
                        <span>Rp. {pickupFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="price-row">
                        <span>{weight || 0}kg Cuci Express</span>
                        <span>Rp. {(weight * pricePerKg || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="price-row total">
                        <strong>Total Biaya</strong>
                        <strong>Rp. {totalPrice.toLocaleString('id-ID')}</strong>
                    </div>

                    <button
                        className="confirm-button"
                        onClick={handleConfirm}
                        disabled={!weight}
                    >
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OwnerConfirmOrder;
