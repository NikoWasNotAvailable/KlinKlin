import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error('Gagal memuat data order:', err);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div className="payment-success">Loading...</div>;

  return (
    <div className="payment-success">
      <h2>✅ Pembayaran Berhasil!</h2>
      <p>Terima kasih! Berikut detail pesanan kamu:</p>

      <div className="order-details">
        <p><strong>ID Pesanan:</strong> {order.id}</p>
        <p><strong>Laundry:</strong> {order.laundry_name}</p>
        <p><strong>Tipe Layanan:</strong> {order.type}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Waktu Penjemputan:</strong> {new Date(order.pickup_datetime).toLocaleString('id-ID')}</p>

        {order.type === 'kiloan' && (
          <>
            <p><strong>Jasa Kiloan:</strong> {order.service_name}</p>
            <p><strong>Harga:</strong> {order.total_price ? `Rp. ${order.total_price.toLocaleString('id-ID')}` : 'Belum ditentukan'}</p>
          </>
        )}

        {order.type === 'satuan' && order.items && (
          <>
            <p><strong>Layanan Satuan:</strong></p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity}x (Rp. {item.price.toLocaleString('id-ID')})
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> Rp. {order.total_price?.toLocaleString('id-ID')}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
