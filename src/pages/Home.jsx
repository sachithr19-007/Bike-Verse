import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Search, ChevronRight } from 'lucide-react';
import BikeHologram from '../components/3d/BikeHologram';

const BRANDS = [
    { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg' },
    { name: 'Yamaha', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Yamaha_Motor_Logo.svg' },
    { name: 'KTM', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/KTM_Logo.svg/1024px-KTM_Logo.svg.png' },
    { name: 'Royal Enfield', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Royal_Enfield_logo.svg/512px-Royal_Enfield_logo.svg.png' },
    { name: 'Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg' },
    { name: 'Kawasaki', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Kawasaki_logo_%282020%29.svg' },
    { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
    { name: 'Ducati', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Ducati_logo.svg/1200px-Ducati_logo.svg.png' }
];

const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

const transitionProperties = { duration: 0.4, ease: 'easeOut' };

const Home = () => {
    const [view, setView] = useState('brands'); // 'brands' | 'models' | 'specs'
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState(null);
    const [modelsList, setModelsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Custom Search State
    const [searchQuery, setSearchQuery] = useState('');

    const fetchModels = async (brand) => {
        if (!brand.trim()) return;

        setLoading(true);
        setError('');
        setSelectedBrand(brand);
        setView('models');
        setModelsList([]);

        try {
            const url = `http://localhost:3001/api/bikes?name=${encodeURIComponent(brand.trim())}`;
            const res = await fetch(url);

            if (!res.ok) throw new Error(await res.text() || 'Failed to fetch models');

            const data = await res.json();

            if (data && data.length > 0) {
                // Filter duplicates based on strictly on model name (often API returns multiple years of same model)
                const uniqueModels = data.reduce((acc, current) => {
                    const exists = acc.find(item => item.model === current.model);
                    if (!exists) return acc.concat([current]);
                    return acc;
                }, []);
                setModelsList(uniqueModels);
            } else {
                setError(`No bikes found for "${brand}".`);
            }
        } catch (err) {
            setError(err.message || 'Error retrieving data.');
        } finally {
            setLoading(false);
        }
    };

    const handleModelClick = (modelObj) => {
        setSelectedModel(modelObj);
        setView('specs');
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {/* 3D Canvas sits strictly behind content */}
            <div className="canvas-container" id="canvas-root">
                <BikeHologram />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', paddingTop: '6rem', paddingBottom: '2rem', overflowY: 'auto' }}>

                <AnimatePresence mode="wait">

                    {/* ======================= BRAND VIEW ======================= */}
                    {view === 'brands' && (
                        <motion.div
                            key="brands-view"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transitionProperties}
                            style={{ maxWidth: '900px', margin: '0 auto' }}
                        >
                            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.1, textAlign: 'center' }}>
                                Find Your <span className="accent-text">Machine</span>
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', textAlign: 'center' }}>
                                Select a top manufacturer to explore their lineup, or use the custom search.
                            </p>

                            {/* Custom Search Box */}
                            <div className="glass-panel" style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                                <input
                                    type="text"
                                    className="glass-input"
                                    placeholder="Or search any custom bike (e.g. Hayabusa)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchModels(searchQuery)}
                                />
                                <button className="glass-button primary" onClick={() => fetchModels(searchQuery)}>
                                    <Search size={18} />
                                </button>
                            </div>

                            {/* Brand Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                {BRANDS.map(brand => (
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        key={brand.name}
                                        className="glass-panel brand-card"
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer', border: '1px solid var(--glass-border)' }}
                                        onClick={() => fetchModels(brand.name)}
                                    >
                                        <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                            <img src={brand.logo} alt={brand.name} style={{ maxHeight: '100%', maxWidth: '120px', objectFit: 'contain', filter: 'drop-shadow(0px 0px 8px rgba(255,255,255,0.2))' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{brand.name}</h3>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ======================= MODELS VIEW ======================= */}
                    {view === 'models' && (
                        <motion.div
                            key="models-view"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transitionProperties}
                            style={{ maxWidth: '800px', margin: '0 auto' }}
                        >
                            <button
                                className="glass-button"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
                                onClick={() => setView('brands')}
                            >
                                <ArrowLeft size={18} /> Back to Brands
                            </button>

                            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                                {selectedBrand.toUpperCase()} <span style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>Models</span>
                            </h2>

                            {loading && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--accent-color)', padding: '3rem' }}>
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                        <Loader2 size={32} />
                                    </motion.div>
                                    <span style={{ fontSize: '1.2rem' }}>Retrieving lineup...</span>
                                </div>
                            )}

                            {error && (
                                <div style={{ padding: '1rem', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', color: '#ff6b6b', borderRadius: '8px' }}>
                                    {error}
                                </div>
                            )}

                            {!loading && !error && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {modelsList.map((bike, idx) => (
                                        <motion.div
                                            whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                            key={`${bike.model}-${idx}`}
                                            className="glass-panel"
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', cursor: 'pointer' }}
                                            onClick={() => handleModelClick(bike)}
                                        >
                                            <div>
                                                <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>{bike.model}</h3>
                                                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{bike.type} • {bike.year}</p>
                                            </div>
                                            <ChevronRight color="var(--accent-color)" />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ======================= SPECS VIEW ======================= */}
                    {view === 'specs' && selectedModel && (
                        <motion.div
                            key="specs-view"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transitionProperties}
                            style={{ maxWidth: '600px', margin: '0 auto' }}
                        >
                            <button
                                className="glass-button"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
                                onClick={() => setView('models')}
                            >
                                <ArrowLeft size={18} /> Back to Models
                            </button>

                            <div className="glass-panel specs-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                                        <span style={{ color: 'var(--accent-color)' }}>{selectedModel.make.toUpperCase()}</span> {selectedModel.model}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Year: {selectedModel.year} • Type: {selectedModel.type}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div className="spec-item">
                                        <p className="spec-label">Engine</p>
                                        <p className="spec-value">{selectedModel.engine || selectedModel.displacement || 'N/A'}</p>
                                    </div>
                                    <div className="spec-item">
                                        <p className="spec-label">Power</p>
                                        <p className="spec-value">{selectedModel.power || 'N/A'}</p>
                                    </div>
                                    <div className="spec-item">
                                        <p className="spec-label">Torque</p>
                                        <p className="spec-value">{selectedModel.torque || 'N/A'}</p>
                                    </div>
                                    <div className="spec-item">
                                        <p className="spec-label">Weight</p>
                                        <p className="spec-value">{selectedModel.total_weight || selectedModel.dry_weight || 'N/A'}</p>
                                    </div>
                                    <div className="spec-item">
                                        <p className="spec-label">Fuel Capacity</p>
                                        <p className="spec-value">{selectedModel.fuel_capacity || 'N/A'}</p>
                                    </div>
                                    <div className="spec-item">
                                        <p className="spec-label">Top Speed</p>
                                        <p className="spec-value">{selectedModel.top_speed || 'N/A'}</p>
                                    </div>
                                    <div className="spec-item" style={{ gridColumn: '1 / -1' }}>
                                        <p className="spec-label">Transmission</p>
                                        <p className="spec-value">{selectedModel.transmission || selectedModel.gearbox || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default Home;
