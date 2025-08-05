import React, { useState, useEffect } from 'react';
import './OrderLaundry.css';
import { useParams, useNavigate } from 'react-router-dom';

const OrderLaundry = () => {
  const navigate = useNavigate();
  const [jenisLayanan, setJenisLayanan] = useState({ kiloan: false, satuan: false });
  const [kiloanServices, setKiloanServices] = useState([]);
  const [satuanServices, setSatuanServices] = useState([]);
  const [selectedKiloan, setSelectedKiloan] = useState(null);
  const [selectedSatuan, setSelectedSatuan] = useState({});
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/services?laundry_place_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setKiloanServices(data.filter(s => s.type === 'kiloan'));
      setSatuanServices(data.filter(s => s.type === 'satuan'));
    };

    fetchServices();
  }, []);



  const toggleJenis = (type) => {
    if (type === 'kiloan') {
      setJenisLayanan({ kiloan: true, satuan: false });
    } else if (type === 'satuan') {
      setJenisLayanan({ kiloan: false, satuan: true });
    }
  };

  const toggleLayanan = (nama) => {
    if (layananDipilih.includes(nama)) {
      setLayananDipilih(layananDipilih.filter(item => item !== nama));
    } else {
      setLayananDipilih([...layananDipilih, nama]);
    }
  };

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    const laundryPlaceId = 1;

    if (!tanggal || !jam) {
      alert('Harap pilih tanggal dan jam penjemputan!');
      return;
    }

    const pickup_datetime = new Date(`${tanggal}T${jam}`);
    const now = new Date();

    if (pickup_datetime < now) {
      alert('Tanggal dan jam penjemputan tidak boleh di masa lalu!');
      return;
    }

    try {
      const body = {
        laundry_place_id: laundryPlaceId,
        type: jenisLayanan.kiloan ? 'kiloan' : 'satuan',
        pickup_datetime: pickup_datetime.toISOString(),
      };

      if (jenisLayanan.kiloan) {
        const selected = kiloanServices.find(s => s.id === selectedKiloan);
        if (!selected) return alert('Pilih jasa kiloan terlebih dahulu!');
        body.service_id = selected.id;
        body.price = null;
      } else {
        const items = Object.entries(selectedSatuan)
          .filter(([, qty]) => qty > 0)
          .map(([id, qty]) => {
            const service = satuanServices.find(s => s.id === Number(id));
            return {
              service_id: Number(id),
              quantity: qty,
              price: service ? qty * service.price : 0, // ⬅️ Tambahkan kalkulasi total harga per item
            };
          });
        if (items.length === 0) return alert('Pilih setidaknya 1 layanan satuan.');
        body.items = items;

        // Tambahkan total price keseluruhan untuk satuan
        const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
        body.price = totalPrice;
      }

      console.log(body.price);

      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal membuat order');
      }

      navigate('/order');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
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

          {/* Kiloan Service Selection */}
          {jenisLayanan.kiloan && (
            <>
              <h4>Pilih Tipe Jasa</h4>
              <div className="tipe-jasa">
                {kiloanServices.map(service => (
                  <label key={service.id} className="jasa-card">
                    <input
                      type="radio"
                      name="tipeJasa"
                      value={service.id}
                      checked={selectedKiloan === service.id}
                      onChange={() => setSelectedKiloan(service.id)}
                    />
                    <div>
                      <div className="jasa-title">{service.name}</div>
                      <div className="jasa-harga">Rp. {service.price.toLocaleString('id-ID')}</div>
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

          {/* Satuan Service Selection */}
          {jenisLayanan.satuan && (
            <>
              <h4>Pilih Layanan Satuan</h4>
              <div className="layanan-list">
                {satuanServices.map(service => {
                  const isChecked = selectedSatuan[service.id] !== undefined;
                  return (
                    <div key={service.id} className="satuan-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            setSelectedSatuan(prev => {
                              const updated = { ...prev };
                              if (e.target.checked) {
                                updated[service.id] = 1; // default to 1 if checked
                              } else {
                                delete updated[service.id];
                              }
                              return updated;
                            });
                          }}
                        />{' '}
                        {service.name} (Rp. {service.price.toLocaleString('id-ID')})
                      </label>

                      {isChecked && (
                        <input
                          type="number"
                          min="1"
                          value={selectedSatuan[service.id]}
                          onChange={(e) =>
                            setSelectedSatuan(prev => ({
                              ...prev,
                              [service.id]: Number(e.target.value) || 1,
                            }))
                          }
                          style={{ marginLeft: '10px', width: '60px' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 💰 Total Price Display */}
              <div className="total-satuan">
                <strong>Total Harga: </strong>
                Rp. {Object.entries(selectedSatuan)
                  .reduce((acc, [id, qty]) => {
                    const service = satuanServices.find(s => s.id === Number(id));
                    return acc + (service ? service.price * qty : 0);
                  }, 0)
                  .toLocaleString('id-ID')}
              </div>
            </>
          )}

        </div>
      </div>

      {/* Bottom: Waktu dan Order Button */}
      <div className="order-bottom">
        <div className="form-group">
          <label>Pilih Tanggal Penjemputan</label>
          <input
            type="date"
            value={tanggal}
            onChange={e => setTanggal(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // hanya bisa pilih dari hari ini ke depan
          />
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
