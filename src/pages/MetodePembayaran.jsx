import React, { useState, useEffect } from 'react';
import './MetodePembayaran.css';
import { useParams, useNavigate } from 'react-router-dom';
import bca from '../assets/bca.png';
import mandiri from '../assets/mandiri.png';
import axios from 'axios';

const MetodePembayaran = () => {
    const { id } = useParams(); // order ID from URL
    const navigate = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectedVA, setSelectedVA] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [saveCard, setSaveCard] = useState(false);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token'); // or from context
                const response = await axios.get(`http://localhost:3000/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrder(response.data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            }
        };

        fetchOrder();
        setSelectedMethod('OVO');
    }, [id]);

    const handlePay = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/orders/${id}/pay`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Pembayaran berhasil!');
            navigate(`/payment/success/${id}`);
        } catch (error) {
            alert('Gagal melakukan pembayaran.');
            console.error('Payment error:', error);
        }
    };

    if (!order) return <div>Loading...</div>;

    return (
        <div className="metode-page">
            <button className="back-button" onClick={() => navigate(-1)}><span className="arrow">&larr;</span></button>
            <div className="breadcrumb">Laundry &gt; Tempat Laundry &gt; Booking &gt; Metode Pembayaran</div>

            <div className="metode-container">
                <div className="left-side">
                    <h3>Metode Pembayaran</h3>

                    <div className="method-list">
                        {['OVO', 'Go-Pay', 'Virtual Account', 'Kartu Kredit/Debit', 'Transfer Bank'].map((method) => (
                            <div className="method-item" key={method}>
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method}
                                        checked={selectedMethod === method}
                                        onChange={() => setSelectedMethod(method)}
                                    />
                                    {method}
                                </label>

                                {selectedMethod === method && method === 'Virtual Account' && (
                                    <div className="sub-options">
                                        {['BCA', 'Mandiri'].map((bank) => {
                                            const logo = bank === 'BCA' ? bca : mandiri;

                                            return (
                                                <label key={bank}>
                                                    <input
                                                        type="radio"
                                                        name="va"
                                                        value={bank}
                                                        checked={selectedVA === bank}
                                                        onChange={() => setSelectedVA(bank)}
                                                    />
                                                    <img src={logo} alt={bank} height="20" />
                                                    {bank}
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}

                                {selectedMethod === method && method === 'Kartu Kredit/Debit' && (
                                    <div className="sub-options">
                                        {['BCA', 'Mandiri', 'BNI', 'CIMB Niaga'].map((bank) => (
                                            <label key={bank}>
                                                <input
                                                    type="radio"
                                                    name="bank"
                                                    value={bank}
                                                    checked={selectedBank === bank}
                                                    onChange={() => setSelectedBank(bank)}
                                                />
                                                {bank}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {selectedMethod === 'Kartu Kredit/Debit' && (
                        <div className="card-section">
                            <label>
                                <strong>Nomor Kartu</strong>
                                <input type="text" placeholder="Ex: 1234 5678 9012 3456" />
                            </label>

                            <div className="form-row">
                                <label>
                                    <strong>Tanggal Kedaluwarsa</strong>
                                    <input type="text" placeholder="Ex: 21 Januari 2023" />
                                </label>

                                <label>
                                    <strong>CVC/CVV</strong>
                                    <input type="text" placeholder="CVV" />
                                </label>
                            </div>

                            <label className="save-card">
                                <input
                                    type="checkbox"
                                    checked={saveCard}
                                    onChange={() => setSaveCard(!saveCard)}
                                />
                                Simpan kartu ini untuk transaksi berikutnya
                            </label>
                        </div>
                    )}

                    <button className="pay-button" onClick={handlePay}>Bayar Sekarang</button>
                </div>

                <div className="right-side">
                    <h4>Ringkasan</h4>
                    {order.total_weight && (
                        <>
                            <p><strong>Berat Cucian:</strong></p>
                            <div className="berat-cucian">{order.total_weight} kg</div>
                        </>
                    )}

                    <p><strong>Tipe Layanan:</strong></p>
                    <div className="summary-service-box">
                        {order.items?.map((item, i) => (
                            <div key={i}>
                                <div className="header">
                                    <span>{item.name}</span>
                                    <span>Rp. {item.price.toLocaleString()}</span>
                                </div>
                                <p>Jumlah: {item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pricing">
                        <p>Harga Asli: <span>Rp. {order.total_price?.toLocaleString()}</span></p>
                        <p><strong>Total:</strong> <strong>Rp. {order.total_price?.toLocaleString()}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetodePembayaran;
