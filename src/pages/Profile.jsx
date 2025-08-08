import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import defaultAvatar from '../assets/profile.png';

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch('http://localhost:3000/api/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error('Unauthorized');
                }
                const data = await res.json();

                setUser({
                    username: data.username,
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    dob: data.dob ? new Date(data.dob).toLocaleDateString() : '',
                    email: data.email || '',
                    instagram: data.instagram || '',
                    twitter: data.twitter || '',
                    facebook: data.facebook || '',
                    role: data.role, // store role
                    profileImg: defaultAvatar,
                });
            })
            .catch(() => {
                localStorage.removeItem('token');
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user) return <div className="profile-container">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-left">
                <div className="profile-avatar-box">
                    <img src={user.profileImg} alt="Avatar" className="profile-avatar" />
                    <h2>{`${user.firstName} ${user.lastName}`}</h2>
                </div>

                <div className="social-links">
                    <div className="social-row">
                        <i className="fa fa-envelope" /> <span>{user.email}</span>
                    </div>
                    {/* <div className="social-row">
                        <i className="fab fa-instagram" /> <span>{user.instagram}</span>
                    </div>
                    <div className="social-row">
                        <i className="fab fa-twitter" /> <span>{user.twitter}</span>
                    </div>
                    <div className="social-row">
                        <i className="fab fa-facebook" /> <span>{user.facebook}</span>
                    </div> */}
                </div>
            </div>

            <div className="profile-right">
                <div className="profile-info-box">
                    <div className="info-row">
                        <label>Username</label>
                        <span>{user.username}</span>
                    </div>
                    <div className="info-row">
                        <label>First Name</label>
                        <span>{user.firstName}</span>
                    </div>
                    <div className="info-row">
                        <label>Last Name</label>
                        <span>{user.lastName}</span>
                    </div>
                    <div className="info-row">
                        <label>Phone</label>
                        <span>{user.phone}</span>
                    </div>
                    <div className="info-row">
                        <label>Address</label>
                        <span>{user.address}</span>
                    </div>
                    <div className="info-row">
                        <label>Date of Birth</label>
                        <span>{user.dob}</span>
                    </div>

                    <div className="action-buttons">
                        {user.role === 'laundry_owner' && (
                            <button
                                className="manage-btn"
                                onClick={() => navigate('/managelaundry')}
                            >
                                Manage Laundry
                            </button>
                        )}
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
