import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Laundry.css';
import defaultImage from '../assets/home.png'; // fallback image

export default function Laundry() {
  const navigate = useNavigate();
  const [laundryPlaces, setLaundryPlaces] = useState([]);

  const handleCardClick = (id) => {
    navigate(`/laundrydetail/${id}`);
  };

  useEffect(() => {
    const fetchLaundryPlaces = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:3000/api/laundries', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        // ✅ Convert base64 from DB into proper image URL
        const formattedData = data.map(place => ({
          ...place,
          imageUrl: place.image
            ? `data:image/jpeg;base64,${place.image}`
            : defaultImage
        }));

        setLaundryPlaces(formattedData);
      } catch (error) {
        console.error('Error fetching laundry places:', error);
      }
    };

    fetchLaundryPlaces();
  }, []);

  return (
    <div className="app-container-laundry">
      <div className="split-section-laundry">
        <div className="left-container-laundry">
          <h2>Your Location</h2>
          <div className="map-container">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.7465977901478!2d106.78308999999999!3d-6.201942000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6b7a2f5e2f3%3A0x7b0dd43834c85f24!2sBINUS%20University%20Anggrek!5e0!3m2!1sen!2sid!4v1681301959012!5m2!1sen!2sid"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <p>
            <span>Alamat:</span> Jl. Lorem ipsum dolor sit amet consectetur, RT 06 RW 12,
            Kelurahan Bojong Gede, Kecamatan Lamping, Kota Jakarta Barat, Indonesia
          </p>
        </div>

        <div className="right-container">
          <h2>Laundry Place</h2>
          <div className="laundry-cards-wrapper">
            <div className="laundry-cards">
              {laundryPlaces.length === 0 ? (
                <p>Loading...</p>
              ) : (
                laundryPlaces.map((place) => (
                  <div
                    className="laundry-card"
                    key={place.id}
                    onClick={() => handleCardClick(place.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={place.imageUrl} alt={place.name} />
                    <h3>{place.name}</h3>
                    <p>{place.description}</p>
                    <p>⭐ {place.rating ?? '4.0'} / 5</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
