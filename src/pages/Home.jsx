import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import BikeHologram from '../components/3d/BikeHologram';

const Home = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [bikeData, setBikeData] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setBikeData(null);

        try {
            const url = `https://api.api-ninjas.com/v1/motorcycles?name=${encodeURIComponent(query.trim())}`;

            const apiKey = import.meta.env.VITE_NINJAS_API_KEY;

            console.log('Sending request to:', url);
            console.log('With API Key set:', !!apiKey);

            const response = await fetch(url, {
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'api-ninjas.com'
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errText = await response.text();
                console.error('API Error Response:', errText);
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response Data:', data);

            if (data && data.length > 0) {
                setBikeData(data[0]);
            } else {
                setError('No bike found. Please check spelling (e.g., "yamaha r15").');
            }
        } catch (err) {
            console.error('Fetch Exception:', err);
            setError(err.message || 'An error occurred during search.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {/* 3D Canvas will be behind this content */}
            <div className="canvas-container" id="canvas-root">
                <BikeHologram />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ maxWidth: '600px', marginTop: '5rem' }}
                >
                    <h1 style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1.1 }}>
                        Explore the <span className="accent-text">Future</span> of Riding
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Immerse yourself in full 3D holographic specifications of the world's most advanced motorcycles.
                    </p>

                    <div className="glass-panel" style={{ display: 'inline-block', padding: '1.5rem', borderRadius: '12px', width: '100%' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Find your dream machine</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                className="glass-input"
                                placeholder="e.g. Ducati Panigale"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button className="glass-button primary" onClick={handleSearch} disabled={loading}>
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Animated Loading Spinner */}
                    {loading && (
                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--accent-color)' }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                <Loader2 size={24} />
                            </motion.div>
                            <span>Fetching specifications...</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', color: '#ff6b6b', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}

                    {/* Specs Card */}
                    {bikeData && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel"
                            style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        >
                            <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                                    {bikeData.make?.charAt(0).toUpperCase() + bikeData.make?.slice(1)} {bikeData.model}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{bikeData.year} • {bikeData.type}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Engine</p>
                                    <p style={{ fontWeight: 600 }}>{bikeData.engine || bikeData.displacement || 'N/A'}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Power</p>
                                    <p style={{ fontWeight: 600 }}>{bikeData.power || 'N/A'}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Torque</p>
                                    <p style={{ fontWeight: 600 }}>{bikeData.torque || 'N/A'}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Weight</p>
                                    <p style={{ fontWeight: 600 }}>{bikeData.total_weight || bikeData.dry_weight || 'N/A'}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fuel Capacity</p>
                                    <p style={{ fontWeight: 600 }}>{bikeData.fuel_capacity || 'N/A'}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Top Speed</p>
                                    <p style={{ fontWeight: 600 }}>{bikeData.top_speed || 'N/A'}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
