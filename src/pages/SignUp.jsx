import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import google from '../assets/google.webp';
import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';
import './Login.css';

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        dob: '',
        email: '',
        role: 'customer' // default role
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/api/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Sign Up failed');
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="brand">
                    <img src={logo} alt="Logo" className="logo-image" />
                    <span className="brand-text">KlinKlin</span>
                </div>
                <div className="login-form">
                    <h1>Create Account</h1>
                    <h2>Join us and start washing</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Role Selection (Radio) */}
                        <div className="form-element" style={{ marginTop: '1rem' }}>
                            <label>Register as</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="customer"
                                        checked={formData.role === 'customer'}
                                        onChange={handleChange}
                                    />
                                    Customer/User
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="laundry_owner"
                                        checked={formData.role === 'laundry_owner'}
                                        onChange={handleChange}
                                    />
                                    Laundry Owner
                                </label>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="form-element">
                            <label>Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="form-element">
                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="form-element">
                            <label>First Name</label>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
                        </div>
                        <div className="form-element">
                            <label>Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                        </div>
                        <div className="form-element">
                            <label>Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-element">
                            <label>Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="form-element">
                            <label>Date of Birth</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                        </div>
                        <div className="form-element">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <button type="submit" disabled={loading}>
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>

                        <div className="or">
                            <hr /> or <hr />
                        </div>

                        <div className="social-login">
                            <div className="social-button google">
                                <img className="provider-icon" src={google} alt="Google" />
                            </div>
                            <div className="social-button facebook">
                                <img className="provider-icon" src={facebook} alt="Facebook" />
                            </div>
                            <div className="social-button twitter">
                                <img className="provider-icon" src={twitter} alt="Twitter" />
                            </div>
                        </div>

                        <span>
                            Already have an account? <a href="/login">Log in</a>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
}
