import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageLaundry.css';

export default function ManageLaundry() {
    const [laundry, setLaundry] = useState({
        name: '',
        description: '',
        address: '',
        latitude: 0,
        longitude: 0,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const [kiloanServices, setKiloanServices] = useState([{ name: '', price: '', type: 'kiloan' }]);
    const [satuanServices, setSatuanServices] = useState([{ name: '', price: '', type: 'satuan' }]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch('http://localhost:3000/api/laundries/my-laundry', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setLaundry({
                        name: data.name || '',
                        description: data.description || '',
                        address: data.address || '',
                        latitude: data.latitude || '',
                        longitude: data.longitude || '',
                    });

                    // ✅ Set image preview dari base64
                    if (data.image) {
                        setImagePreview(`data:image/jpeg;base64,${data.image}`);
                    }

                    setKiloanServices(
                        data.services?.filter(s => s.type === 'kiloan')?.length
                            ? data.services.filter(s => s.type === 'kiloan')
                            : [{ name: '', price: '', type: 'kiloan' }]
                    );

                    setSatuanServices(
                        data.services?.filter(s => s.type === 'satuan')?.length
                            ? data.services.filter(s => s.type === 'satuan')
                            : [{ name: '', price: '', type: 'satuan' }]
                    );
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [navigate]);


    const handleLaundryChange = e => {
        const { name, value } = e.target;
        setLaundry(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (type, index, field, value) => {
        const updateList = type === 'kiloan' ? [...kiloanServices] : [...satuanServices];
        updateList[index][field] = value;
        type === 'kiloan' ? setKiloanServices(updateList) : setSatuanServices(updateList);
    };

    const addService = (type) => {
        const newService = { name: '', price: '', type };
        if (type === 'kiloan') setKiloanServices(prev => [...prev, newService]);
        else setSatuanServices(prev => [...prev, newService]);
    };

    const removeService = (type, index) => {
        if (type === 'kiloan') {
            const updated = kiloanServices.filter((_, i) => i !== index);
            setKiloanServices(updated.length ? updated : [{ name: '', price: '', type: 'kiloan' }]);
        } else {
            const updated = satuanServices.filter((_, i) => i !== index);
            setSatuanServices(updated.length ? updated : [{ name: '', price: '', type: 'satuan' }]);
        }
    };

    const handleSave = () => {
        if (!laundry.name || !laundry.address) {
            alert('Please fill in the laundry name and address.');
            return;
        }
        if (!kiloanServices[0].name || !satuanServices[0].name) {
            alert('Please add at least one service for both kiloan and satuan.');
            return;
        }

        const token = localStorage.getItem('token');

        const formattedServices = [...kiloanServices, ...satuanServices].map(svc => ({
            ...svc,
            price: Number(svc.price) || 0
        }));

        let imageBase64 = null;
        if (imagePreview) {
            // kalau preview ada, ambil base64-nya (tanpa prefix data:image/...;)
            imageBase64 = imagePreview.split(',')[1];
        }

        const payload = {
            ...laundry,
            services: formattedServices,
            image: imageBase64 // ✅ kirim base64 image
        };

        fetch('http://localhost:3000/api/laundries/my-laundry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message || 'Saved!');
                navigate('/profile');
            })
            .catch(err => {
                console.error(err);
                alert('Failed to save laundry');
            });
    };



    if (loading) return <div className="manage-laundry-container">Loading...</div>;

    return (
        <div className="manage-laundry-container">
            <h1>Manage Laundry</h1>

            <div className="card">
                <h2>🏠 Laundry Info</h2>
                <div className="laundry-info-row">
                    {/* Left side: form fields */}
                    <div className="laundry-form-fields">
                        <div className="form-group">
                            <label>Name</label>
                            <input name="name" placeholder="Laundry name" value={laundry.name} onChange={handleLaundryChange} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" placeholder="Brief description" value={laundry.description} onChange={handleLaundryChange} />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea name="address" placeholder="Full address" value={laundry.address} onChange={handleLaundryChange} />
                        </div>
                    </div>

                    {/* Right side: image upload */}
                    <div className="laundry-image-upload">
                        <label htmlFor="imageUpload" className="image-upload-label">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Laundry" className="preview-img" />
                            ) : (
                                <div className="image-placeholder">+ Add Image</div>
                            )}
                        </label>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
            </div>


            <div className="card">
                <h2>⚖️ Kiloan Services</h2>
                {kiloanServices.map((service, i) => (
                    <div key={i} className="service-row">
                        <select
                            value={service.name}
                            onChange={e => handleServiceChange('kiloan', i, 'name', e.target.value)}
                        >
                            <option value="">Select Service</option>
                            <option value="Cuci Reguler">Cuci Reguler</option>
                            <option value="Dry Cleaning">Dry Cleaning</option>
                            <option value="Setrika Saja">Setrika Saja</option>
                        </select>
                        <input
                            placeholder="Price"
                            type="number"
                            value={service.price}
                            onChange={e => handleServiceChange('kiloan', i, 'price', e.target.value)}
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeService('kiloan', i)}
                        >
                            ✖
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addService('kiloan')}
                >
                    + Add Kiloan
                </button>
            </div>


            <div className="card">
                <h2>🧥 Satuan Services</h2>
                {satuanServices.map((service, i) => (
                    <div key={i} className="service-row">
                        <input
                            placeholder="Service Name"
                            value={service.name}
                            onChange={e => handleServiceChange('satuan', i, 'name', e.target.value)}
                        />
                        <input
                            placeholder="Price"
                            type="number"
                            value={service.price}
                            onChange={e => handleServiceChange('satuan', i, 'price', e.target.value)}
                        />
                        <button type="button" className="remove-btn" onClick={() => removeService('satuan', i)}>✖</button>
                    </div>
                ))}
                <button type="button" className="add-btn" onClick={() => addService('satuan')}>+ Add Satuan</button>
            </div>

            <div className="action-buttons">
                <button className="save-btn" onClick={handleSave}>💾 Save</button>
                <button className="cancel-btn" onClick={() => navigate('/profile')}>❌ Cancel</button>
            </div>
        </div>
    );
}
