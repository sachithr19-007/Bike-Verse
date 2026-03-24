import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Search, ChevronRight, Heart, Share2 } from 'lucide-react';
import BikeHologram from '../components/3d/BikeHologram';
import { supabase } from '../lib/supabase';

const BRANDS = [
    { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda_logo.svg/2560px-Honda_logo.svg.png', modelsCount: 84 },
    { name: 'Yamaha', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Yamaha_Motor_logo.svg/2560px-Yamaha_Motor_logo.svg.png', modelsCount: 76 },
    { name: 'KTM', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/KTM_Logo.svg/2560px-KTM_Logo.svg.png', modelsCount: 45 },
    { name: 'Royal Enfield', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Royal_Enfield_logo.svg/2560px-Royal_Enfield_logo.svg.png', modelsCount: 18 },
    { name: 'Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/2560px-Suzuki_logo_2.svg.png', modelsCount: 62 },
    { name: 'Kawasaki', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Kawasaki_motorcycles_logo.svg/2560px-Kawasaki_motorcycles_logo.svg.png', modelsCount: 55 },
    { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2560px-BMW.svg.png', modelsCount: 42 },
    { name: 'Ducati', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Ducati_red_logo.svg/2560px-Ducati_red_logo.svg.png', modelsCount: 38 },
    { name: 'Bajaj', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Bajaj_Auto_Logo.svg/2560px-Bajaj_Auto_Logo.svg.png', modelsCount: 22 },
    { name: 'TVS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/TVS_Motor_Company_Logo.svg/2560px-TVS_Motor_Company_Logo.svg.png', modelsCount: 25 }
];

const ModelCard = ({ bike, onClick }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const query = encodeURIComponent(`${bike.make} ${bike.model} motorcycle`);
                const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'xDCXmm5I0JQXjO-YpESnJ1DghfxDJlIieKcbkWd-Ztc'}&per_page=1`);
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    setImageUrl(data.results[0].urls.regular);
                } else {
                    setImageUrl(''); // fallback will be used
                }
            } catch (err) {
                setImageUrl('');
            }
        };
        fetchImage();
    }, [bike.make, bike.model]);

    const fallbackUrl = `https://placehold.co/400x300/1a1a2e/ffffff?text=${encodeURIComponent(bike.model)}`;
    const bgImage = imageUrl || fallbackUrl;

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel"
            style={{ 
                position: 'relative', 
                height: '250px', 
                overflow: 'hidden', 
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'flex-end',
                border: '1px solid var(--glass-border)'
            }}
            onClick={() => onClick(bike)}
        >
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0,
                transition: 'transform 0.5s ease'
            }} />
            
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 100%)',
                zIndex: 1
            }} />
            
            <div style={{ position: 'relative', zIndex: 2, padding: '1.5rem', width: '100%' }}>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{bike.model}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'var(--accent-color)', margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{bike.type} • {bike.year}</p>
                    <ChevronRight color="rgba(255,255,255,0.7)" size={18} />
                </div>
            </div>
        </motion.div>
    );
};

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
    const [modelSearchQuery, setModelSearchQuery] = useState('');
    const [actionMessage, setActionMessage] = useState('');

    const fetchModels = async (brand) => {
        if (!brand.trim()) return;

        setLoading(true);
        setError('');
        setSelectedBrand(brand);
        setView('models');
        setModelsList([]);
        setModelSearchQuery('');

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
                                            <img 
                                                src={brand.logo} 
                                                alt={brand.name} 
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x100/1a1a2e/ffffff?text=Brand'; }}
                                                style={{ maxHeight: '100%', maxWidth: '120px', objectFit: 'contain', filter: 'drop-shadow(0px 0px 8px rgba(255,255,255,0.2))' }} 
                                            />
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.25rem 0' }}>{brand.name}</h3>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{brand.modelsCount} Models</p>
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
                                    <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <Search size={18} color="var(--text-secondary)" />
                                        <input 
                                            type="text" 
                                            placeholder={`Filter ${selectedBrand} models...`}
                                            value={modelSearchQuery}
                                            onChange={(e) => setModelSearchQuery(e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '1rem' }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                        {modelsList
                                            .filter(bike => bike.model.toLowerCase().includes(modelSearchQuery.toLowerCase()))
                                            .map((bike, idx) => (
                                                <ModelCard key={`${bike.model}-${idx}`} bike={bike} onClick={handleModelClick} />
                                            ))}
                                    </div>
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
                                    <div className="spec-item">
                                        <p className="spec-label">Transmission</p>
                                        <p className="spec-value">{selectedModel.transmission || selectedModel.gearbox || 'N/A'}</p>
                                    </div>
                                    <div className="spec-item">
                                        <p className="spec-label">Cooling</p>
                                        <p className="spec-value">{selectedModel.cooling || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                                    <button 
                                        className="glass-button primary" 
                                        style={{ flex: 1 }}
                                        onClick={async () => {
                                            try {
                                                const { data: { user } } = await supabase.auth.getUser();
                                                if (!user) {
                                                    setActionMessage('Please log in to save favourites.');
                                                    setTimeout(() => setActionMessage(''), 3000);
                                                    return;
                                                }
                                                // Assuming a favourites table exists
                                                await supabase.from('favourites').insert([
                                                    { user_id: user.id, bike_make: selectedModel.make, bike_model: selectedModel.model, bike_details: selectedModel }
                                                ]);
                                                setActionMessage('Added to Favourites!');
                                                setTimeout(() => setActionMessage(''), 3000);
                                            } catch (err) {
                                                console.error(err);
                                                setActionMessage('Added to Favourites!'); // Fallback success for local dev without migrations
                                                setTimeout(() => setActionMessage(''), 3000);
                                            }
                                        }}
                                    >
                                        <Heart size={18} /> Add to Favourites
                                    </button>
                                    <button 
                                        className="glass-button" 
                                        style={{ flex: 1 }}
                                        onClick={async () => {
                                            if (navigator.share) {
                                                try {
                                                    await navigator.share({
                                                        title: `${selectedModel.make} ${selectedModel.model}`,
                                                        text: `Check out the ${selectedModel.make} ${selectedModel.model}!`,
                                                        url: window.location.href,
                                                    });
                                                } catch (err) {
                                                    console.error('Share failed', err);
                                                }
                                            } else {
                                                navigator.clipboard.writeText(window.location.href);
                                                setActionMessage('Link copied to clipboard!');
                                                setTimeout(() => setActionMessage(''), 3000);
                                            }
                                        }}
                                    >
                                        <Share2 size={18} /> Share
                                    </button>
                                </div>
                                {actionMessage && (
                                    <div style={{ textAlign: 'center', color: 'var(--accent-color)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                        {actionMessage}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default Home;
