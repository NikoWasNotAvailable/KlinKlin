import React, { useState } from 'react';
import './MetodePembayaran.css';
import bca from '../assets/bca.png'
import mandiri from '../assets/mandiri.png'
import { useNavigate } from 'react-router-dom';

const MetodePembayaran = () => {
    const navigate = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectedVA, setSelectedVA] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [saveCard, setSaveCard] = useState(false);

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

                                {/* Virtual Account Sub-options */}
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

                                {/* Kartu Kredit/Debit Sub-options */}
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

                    {/* Form kartu */}
                    {selectedMethod === 'Kartu Kredit/Debit' && (
                        <div className="card-section">
                            <label>
                                <strong>Nomor Kartu</strong>
                                <input type="text" placeholder="Ex: 1234 5678 9012 3456" />
                            </label>

                            <div className="form-row">
                                <label>
                                    <strong>Tanggal Kedaluwarsa</strong>
                                    <input className="tanggal-kedaluwarsa" type="text" placeholder="Ex: 21 Januari 2023" />
                                </label>

                                <label>
                                    <strong>CVC/CVV</strong>
                                    <div className="cvv-input">
                                        <input type="text" placeholder="Ex: CVV" />
                                    </div>
                                </label>
                            </div>

                            <label className="save-card">
                                <input
                                    type="checkbox"
                                    checked={saveCard}
                                    onChange={() => setSaveCard(!saveCard)}
                                />
                                Simpan kartu ini dengan aman untuk transaksi berikutnya
                            </label>
                        </div>
                    )}
                </div>

                <div className="right-side">
                    <h4>Ringkasan</h4>
                    <p><strong>Berat Cucian:</strong></p>
                    <div className="berat-cucian">5 kg</div>

                    <p><strong>Tipe Layanan:</strong></p>
                    <div className="summary-service-box">
                        <div className="header">
                            <span>Cuci reguler</span>
                            <span>Rp. 30.000</span>
                        </div>
                        <p className="desc">Lorem ipsum dolor sit amet consectetur. Donec malesuada dictum vulputate nibh nibh.</p>
                    </div>

                    <div className="pricing">
                        <p>Harga Asli: <span>Rp. 120.000</span></p>
                        <p>Diskon: <span>Rp. 30.000</span></p>
                        <p>Ongkir: <span>Rp. 20.000</span></p>
                        <p><strong>Total:</strong> <strong>Rp. 70.000</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetodePembayaran;
