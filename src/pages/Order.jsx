import React, { useState } from 'react';
import './Order.css';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [jenisLayanan, setJenisLayanan] = useState('');
  const [tipeJasa, setTipeJasa] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [layananDipilih, setLayananDipilih] = useState([]);
  const [beratKg, setBeratKg] = useState(0); // ✅ Move this up

  const jasaOptions = {
    reguler: { label: 'Jasa Cuci Reguler', biaya: 20000 },
    dryclean: { label: 'Jasa Dry Cleaning', biaya: 30000 },
    setrika: { label: 'Jasa Setrika', biaya: 25000 },
  };

  const biayaJasa = tipeJasa ? jasaOptions[tipeJasa].biaya : 0;
  const biayaPerKg = 9000;
  const biayaLaundry = beratKg * biayaPerKg;
  const totalBiaya = biayaJasa + biayaLaundry;


  const layananList = [
    "Jas Kerja / Kuliah", "Selimut Besar", "Selimut Sedang", "Selimut Kecil",
    "Spray Besar", "Spray Sedang", "Spray Kecil",
    "Karpet Besar", "Karpet Sedang", "Karpet Kecil"
  ];



  const toggleLayanan = (nama) => {
    if (layananDipilih.includes(nama)) {
      setLayananDipilih(layananDipilih.filter(item => item !== nama));
    } else {
      setLayananDipilih([...layananDipilih, nama]);
    }
  };

  const navigate = useNavigate();

  const handleMetodePembayaran = () => {
    navigate('/metodepembayaran');
  };



  return (
    <div className="order-page">
      <div className="breadcrumbs">Laundry &gt; Tempat Laundry &gt; Booking</div>

      <div className="order-container">
        {/* KIRI */}
        <div className="order-left">
          <h3>Pilih Jenis Layanan</h3>
          <label>
            <input
              type="radio"
              name="jenis"
              value="satuan"
              checked={jenisLayanan === 'satuan'}
              onChange={e => setJenisLayanan(e.target.value)}
            /> Cuci Satuan
          </label>
          <label>
            <input
              type="radio"
              name="jenis"
              value="kiloan"
              checked={jenisLayanan === 'kiloan'}
              onChange={e => setJenisLayanan(e.target.value)}
            /> Cuci Kiloan
          </label>
          <h3>Berat Cucian (kg)</h3>
          <input
            type="number"
            min="0"
            className="text-box"
            placeholder="Masukkan berat cucian dalam kg"
            value={beratKg}
            onChange={e => setBeratKg(Number(e.target.value))}
          />

          <h3>Pilih Tipe Jasa</h3>
          <div className="tipe-jasa">
            {Object.entries(jasaOptions).map(([key, jasa]) => (
              <label className="jasa-card" key={key}>
                <input
                  type="radio"
                  name="jasa"
                  value={key}
                  checked={tipeJasa === key}
                  onChange={e => setTipeJasa(e.target.value)}
                />
                <div>
                  <h4>{jasa.label}</h4>
                  <p>Rp. {jasa.biaya.toLocaleString('id-ID')}</p>
                </div>
              </label>
            ))}
          </div>

        </div>

        {/* KANAN */}
        <div className="order-right">
          <h3>Pilih Layanan Satuan</h3>
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

          <h3>Pilih Tanggal Penjemputan</h3>
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} />

          <h3>Pilih Jam Penjemputan</h3>
          <input type="time" value={jam} onChange={e => setJam(e.target.value)} />

          <h3>Estimasi Biaya</h3>
          <div className="estimasi">
            <p>Biaya Jemput: Rp. {biayaJasa.toLocaleString('id-ID')},00</p>
            <p>Biaya Cuci ({beratKg} kg): Rp. {biayaLaundry.toLocaleString('id-ID')},00</p>
            <p><strong>Total Biaya: Rp. {totalBiaya.toLocaleString('id-ID')},00</strong></p>
          </div>


          <button className="btn-bayar" onClick={handleMetodePembayaran}>Pilih Metode Pembayaran</button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
