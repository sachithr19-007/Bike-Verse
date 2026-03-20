import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 100,
            padding: '1.5rem 0',
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0) 100%)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="accent-text">Bike</span>Verse
                    </h2>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '20px' }}>
                        <Search size={18} color="#aaa" />
                        <input
                            type="text"
                            placeholder="Search bikes..."
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                outline: 'none',
                                width: '150px',
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                {user.user_metadata?.full_name || user.email}
                            </span>
                            <button onClick={handleLogout} className="glass-button" style={{ padding: '0.5rem 1rem' }}>
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/auth" className="glass-button">
                            <User size={18} />
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
