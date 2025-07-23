import React, { useState } from 'react';
import './OrderLaundry.css';
import { useNavigate } from 'react-router-dom';

const OrderLaundry = () => {
  const navigate = useNavigate();
  const [jenisLayanan, setJenisLayanan] = useState({
    kiloan: false,
    satuan: false
  });
  const [tipeJasa, setTipeJasa] = useState('');
  const [layananDipilih, setLayananDipilih] = useState([]);
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');

  const jasaOptions = {
    reguler: { label: 'Jasa Cuci Reguler', biaya: 30000 },
    dryclean: { label: 'Jasa Dry Cleaning', biaya: 30000 },
    setrika: { label: 'Jasa Setrika', biaya: 30000 },
  };

  const layananList = [
    "Jas Kerja / Kuliah", "Selimut Besar", "Selimut Sedang", "Selimut Kecil",
    "Spray Besar", "Spray Sedang", "Spray Kecil",
    "Karpet Besar", "Karpet Sedang", "Karpet Kecil"
  ];

  const toggleJenis = (type) => {
    if (type === 'kiloan') {
      setJenisLayanan({ kiloan: true, satuan: false });
      setLayananDipilih([]);
    } else if (type === 'satuan') {
      setJenisLayanan({ kiloan: false, satuan: true });
      setTipeJasa('');
    }
  };

  const toggleLayanan = (nama) => {
    if (layananDipilih.includes(nama)) {
      setLayananDipilih(layananDipilih.filter(item => item !== nama));
    } else {
      setLayananDipilih([...layananDipilih, nama]);
    }
  };

  const handleOrder = () => {
    navigate('/metodepembayaran');
  };

  return (
    <div className="order-page">
      <div className="breadcrumbs">Laundry &gt; Tempat Laundry &gt; Booking</div>

      <div className="order-layout">
        {/* Left: Cuci Kiloan */}
        <div className="order-section">
          <label>
            <input
              type="radio"
              checked={jenisLayanan.kiloan}
              onChange={() => toggleJenis('kiloan')}
            /> Cuci Kiloan
          </label>

          {jenisLayanan.kiloan && (
            <>
              <h4>Pilih Tipe Jasa</h4>
              <div className="tipe-jasa">
                {Object.entries(jasaOptions).map(([key, jasa]) => (
                  <label className="jasa-card" key={key}>
                    <input
                      type="radio"
                      name="tipeJasa"
                      value={key}
                      checked={tipeJasa === key}
                      onChange={(e) => setTipeJasa(e.target.value)}
                    />
                    <div>
                      <div className="jasa-title">{jasa.label}</div>
                      <div className="jasa-harga">Rp. {jasa.biaya.toLocaleString('id-ID')}</div>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Cuci Satuan */}
        <div className="order-section">
          <label>
            <input
              type="radio"
              checked={jenisLayanan.satuan}
              onChange={() => toggleJenis('satuan')}
            /> Cuci Satuan
          </label>

          {jenisLayanan.satuan && (
            <>
              <h4>Pilih Layanan Satuan</h4>
              <div className="layanan-list">
                {layananList.map((item, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={layananDipilih.includes(item)}
                      onChange={() => toggleLayanan(item)}
                    /> {item}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom: Waktu dan Order Button */}
      <div className="order-bottom">
        <div className="form-group">
          <label>Pilih Tanggal Penjemputan</label>
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Pilih Jam Penjemputan</label>
          <input type="time" value={jam} onChange={e => setJam(e.target.value)} />
        </div>

        <button className="btn-order" onClick={handleOrder}>Order</button>
      </div>
    </div>
  );
};

export default OrderLaundry;
