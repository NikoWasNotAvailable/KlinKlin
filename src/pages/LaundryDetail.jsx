import './LaundryDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import reviewer1 from '../assets/profile.png';
import defaultImage from '../assets/image1.jpg'; // fallback image

export default function LaundryDetail() {
    const { id } = useParams();
    const [laundry, setLaundry] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLaundry = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/laundries/${id}`);
                const data = await res.json();

                // ✅ Add imageUrl property for Base64 or fallback
                setLaundry({
                    ...data,
                    imageUrl: data.image
                        ? `data:image/jpeg;base64,${data.image}`
                        : defaultImage
                });
            } catch (err) {
                console.error('Failed to fetch laundry detail:', err);
            }
        };

        fetchLaundry();
    }, [id]);

    const handleOrderClick = () => {
        navigate(`/orderlaundry/${id}`);
    };

    if (!laundry) return <div>Loading...</div>;

    return (
        <div className="laundry-detail">
            <div className="top-content">
                <div className="main-image-box">
                    <img src={laundry.imageUrl} alt="Laundry" className="main-image" />
                </div>
                <div className="laundry-info">
                    <h2>{laundry.name}</h2>
                    <div className="stars">
                        ⭐⭐⭐⭐⭐ <span className="rating-text">{laundry.rating} | Lihat Ulasan</span>
                    </div>
                    <button className="order-button" onClick={handleOrderClick}>
                        Pesan Sekarang
                    </button>
                    <div className="map-box">
                        <div className="map-img">
                            <iframe
                                title="Google Map"
                                src={`https://www.google.com/maps?q=${laundry.latitude},${laundry.longitude}&hl=es;z=14&output=embed`}
                                width="280"
                                height="180"
                                style={{ borderRadius: '10px', border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>
                        <div className="address-box">
                            <h4>Alamat Tempat</h4>
                            <p>{laundry.address}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section">
                <h3>Ulasan Dari Pelanggan &gt;</h3>
                <div className="reviews">
                    {[...Array(3)].map((_, index) => (
                        <div className="review-card" key={index}>
                            <img src={reviewer1} alt="Reviewer" className="review-img" />
                            <div className="review-content">
                                <strong>Pengguna #{index + 1}</strong>
                                <div className="stars">⭐⭐⭐⭐⭐ <span className="rating-text">5.0</span></div>
                                <p>Layanan cepat dan hasil cucian bersih serta wangi. Sangat puas!</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
