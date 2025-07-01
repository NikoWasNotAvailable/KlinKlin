import { useNavigate } from 'react-router-dom';
import klinKlinImage from '../assets/home.png';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/Image5.jpg';
import image6 from '../assets/Image6.jpg';
import './Laundry.css';

export default function Laundry() {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate('/laundrydetail'); // you can add `?id=${id}` if dynamic detail is needed later
  };

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
              {laundryPlaces.map((place) => (
                <div
                  className="laundry-card"
                  key={place.id}
                  onClick={() => handleCardClick(place.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={place.image} alt={place.name} />
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  <p>⭐ {place.rating} / 5</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const laundryPlaces = [
  {
    id: 1,
    name: 'Laundry Anggrek',
    description: 'Quality Laundry, Fast And Clean.',
    rating: 4.1,
    image: image1,
  },
  {
    id: 2,
    name: 'Laundry Kemanggisan',
    description: 'Friendly service and excellent results.',
    rating: 4.2,
    image: image2,
  },
  {
    id: 3,
    name: 'Laundry Palmerah',
    description: 'Fast and punctual pick-up and delivery.',
    rating: 4.3,
    image: image3,
  },
  {
    id: 4,
    name: 'Laundry Slipi',
    description: 'Affordable prices, clean results.',
    rating: 4.4,
    image: image4,
  },
  {
    id: 5,
    name: 'Laundry Rompas',
    description: 'Clothes always come back smelling fresh and neatly folded!',
    rating: 4.4,
    image: image5,
  },
  {
    id: 6,
    name: 'Luiz Laundry',
    description: 'Fast and satisfying service.',
    rating: 4.4,
    image: image6,
  },
];
