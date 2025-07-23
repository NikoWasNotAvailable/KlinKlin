import './LaundryDetail.css';
import { useNavigate } from 'react-router-dom';
import laundryImg from '../assets/image1.jpg';
import laundryImg2 from '../assets/image2.jpg';
import laundryImg3 from '../assets/image3.jpg';
import laundryImg4 from '../assets/image4.jpg';
import laundryImg5 from '../assets/image5.jpg';
import laundryImg6 from '../assets/image6.jpg';
import reviewer1 from '../assets/profile.png';

export default function LaundryDetail() {
    const reviews = [
        { name: 'Marvin McKinney', img: reviewer1 },
        { name: 'Jane Cooper', img: reviewer1 },
        { name: 'Jacob Jones', img: reviewer1 },
        { name: 'Jenny Wilson', img: reviewer1 },
        { name: 'Jane Cooper', img: reviewer1 },
        { name: 'Jenny Wilson', img: reviewer1 },
    ];

    const recommendations = [
        { image: laundryImg2, name: 'Laundry Kemanggisan' },
        { image: laundryImg3, name: 'Laundry Palmerah' },
        { image: laundryImg4, name: 'Laundry Slipi' },
        { image: laundryImg5, name: 'Laundry Rompas' },
    ];
    const navigate = useNavigate();

    const handleOrderClick = (id) => {
        navigate('/orderlaundry');
    };
    return (
        <div className="laundry-detail">
            <div className="top-content">
                <div className="main-image-box">
                    <img src={laundryImg} alt="Laundry" className="main-image" />
                </div>
                <div className="laundry-info">
                    <h2>Laundry Anggrek</h2>
                    <div className="stars">
                        ⭐⭐⭐⭐⭐ <span className="rating-text">5.0 | Lihat 136 Ulasan</span>
                    </div>
                    <button className="order-button" onClick={handleOrderClick}>Pesan Sekarang</button>
                    <div className="map-box">
                        <div className="map-img">
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.7465977901478!2d106.78308999999999!3d-6.201942000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6b7a2f5e2f3%3A0x7b0dd43834c85f24!2sBINUS%20University%20Anggrek!5e0!3m2!1sen!2sid!4v1681301959012!5m2!1sen!2sid"
                                width="280"
                                height="180"
                                style={{ borderRadius: '10px', border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        <div className="address-box">
                            <h4>Alamat Tempat</h4>
                            <p>
                                Jl. Anggrek Kemanggisan, RT 05 RW 02,
                                Kelurahan Bojong Gede, Kecamatan Lamping, Kota Jakarta Barat,
                                Indonesia
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section">
                <h3>Ulasan Dari Pelanggan &gt;</h3>
                <div className="reviews">
                    {reviews.map((review, index) => (
                        <div className="review-card" key={index}>
                            <img src={review.img} alt={review.name} className="review-img" />
                            <div className="review-content">
                                <strong>{review.name}</strong>
                                <div className="stars">⭐⭐⭐⭐⭐ <span className="rating-text">5.0</span></div>
                                <p>
                                    Nama tempat layanan cuci pakaian saya selalu cepat, customer
                                    care-nya oke, hasil cucian juga wangi dan cepat kering. Saya
                                    puas & recommended me!
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h3>Rekomendasi Laundry Lain</h3>
                <div className="recommendations">
                    {recommendations.map((rec, index) => (
                        <div className="rec-card" key={index}>
                            <img src={rec.image} alt={rec.name} />
                            <h4>{rec.name}</h4>
                            <p>Keterangan tempat seputar lokasi tempat, jasa yang ditawarkan dan lain lain</p>
                            <span className="stars">⭐ 5.0 | 100 Ulasan</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
