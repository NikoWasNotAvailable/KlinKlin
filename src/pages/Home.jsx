import klinKlinImage from '../assets/home.png'
import easyImg from '../assets/easy.png'
import fastImg from '../assets/fast.png'
import ontimeImg from '../assets/ontime.png'
import cleanImg from '../assets/clean.png'

import './Home.css'

export default function Home() {
  return (
    <div className="app-container">
      <div className="split-section-home">
        <div className="left-container-home">
          <h1>
            Clean Your Dirty Laundry With KlinKlin
          </h1>
          <div className="button-group">
            <button className="action-button">Place an Order</button>
            <button className="action-button">Explore KlinKlin</button>
          </div>
        </div>

        <div className="right-container">
          <img src={klinKlinImage} alt="KlinKlin Illustration" className="main-image" />
        </div>
      </div>

      <section className="service-section">
        <h2>Our Service</h2>
        <div className="service-items">
          <div className="service-item">
            <img src={easyImg} alt="Easy" />
            <p>Easy</p>
          </div>
          <div className="service-item">
            <img src={fastImg} alt="Fast" />
            <p>Fast</p>
          </div>
          <div className="service-item">
            <img src={ontimeImg} alt="On Time" />
            <p>On Time</p>
          </div>
          <div className="service-item">
            <img src={cleanImg} alt="Clean" />
            <p>Clean</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About Us</h2>
        <p>
          KlinKlin adalah layanan laundry online yang hadir untuk memudahkan kebutuhan mencuci Anda. Dengan sistem pemesanan yang praktis dan antar-jemput langsung ke lokasi Anda, kami mengutamakan kebersihan, kecepatan, dan kenyamanan. KlinKlin siap menjadi solusi laundry modern yang terpercaya untuk gaya hidup Anda yang sibuk.
        </p>
      </section>
    </div>
  )
}
