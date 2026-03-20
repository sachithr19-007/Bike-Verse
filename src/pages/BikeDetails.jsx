import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BikeHologram from '../components/3d/BikeHologram';

const BikeDetails = () => {
    const { id } = useParams();

    // Mock data for now until Supabase is fully integrated
    const bike = {
        id,
        name: 'Ducati Panigale V4 S',
        brand: 'Ducati',
        price: '$31,595',
        engine: '1,103 cc Desmosedici Stradale V4',
        power: '210 hp @ 12,500 rpm',
        torque: '90.6 lb-ft @ 11,000 rpm',
        weight: '431 lbs (wet)',
        description: 'The Panigale V4 represents the last step in the characteristic path of Ducati sport bikes. A motorcycle that is the closest representation of a MotoGP bike ever built for public roads.'
    };

    return (
        <div className="container" style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', gap: '2rem' }}>

            {/* 3D Viewport Area */}
            <div style={{ flex: 1, position: 'relative' }}>
                {/* Placeholder for Bike Hologram single view */}
                <div className="glass-panel" style={{ height: '600px', background: 'rgba(0, 0, 0, 0.4)', padding: 0, overflow: 'hidden', position: 'relative' }}>
                    <BikeHologram />
                </div>
            </div>

            {/* Specifications Panel */}
            <motion.div
                className="glass-panel"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
                <div>
                    <h4 style={{ color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>{bike.brand}</h4>
                    <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{bike.name}</h2>
                    <p style={{ fontSize: '1.5rem', fontWeight: 300 }}>{bike.price}</p>
                </div>

                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{bike.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Engine</p>
                        <p style={{ fontWeight: 600 }}>{bike.engine}</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Power</p>
                        <p style={{ fontWeight: 600 }}>{bike.power}</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Torque</p>
                        <p style={{ fontWeight: 600 }}>{bike.torque}</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Weight</p>
                        <p style={{ fontWeight: 600 }}>{bike.weight}</p>
                    </div>
                </div>

                <button className="glass-button primary" style={{ marginTop: 'auto' }}>
                    Compare Specs
                </button>
            </motion.div>
        </div >
    );
};

export default BikeDetails;
