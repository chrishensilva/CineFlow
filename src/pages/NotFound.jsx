import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
    return (
        <>
            <Header />
            <div className="flex-center" style={{
                minHeight: '80vh',
                flexDirection: 'column',
                textAlign: 'center',
                paddingTop: '80px'
            }}>
                <h1 style={{ fontSize: '6rem', color: 'var(--primary-color)', marginBottom: '0' }}>404</h1>
                <h2 style={{ marginBottom: '20px' }}>Page Not Found</h2>
                <p style={{ color: '#888', marginBottom: '30px' }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
            <Footer />
        </>
    );
};

export default NotFound;
